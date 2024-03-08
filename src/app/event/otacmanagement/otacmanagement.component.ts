import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrDatagridSortOrder } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { OTAC } from 'src/app/data/otac.type';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';
import parse from 'parse-duration';

interface iOTAC extends OTAC {
  userEmail?: string;
  status: 'free' | 'taken' | 'out-of-time';
}

@Component({
  selector: 'app-otacmanagement',
  templateUrl: './otacmanagement.component.html',
  styleUrls: ['./otacmanagement.component.scss'],
})
export class OTACManagementComponent implements OnInit, OnDestroy {
  @Input() open: boolean;

  @Input() scheduledEvents: Observable<ScheduledEvent>;

  @Output() closeEvent = new EventEmitter<void>();

  private onDestroy = new Subject();

  currentScheduledEvent: ScheduledEvent = null;

  // The Validator Pattern for the duration only accepts strings that make up a valid duration
  // For example "1d" for 1 day, "24h" for 24 Hours, "60m" for 60 minutes.
  amountInputForm: FormGroup<{
    amountInput: FormControl<number>;
    duration: FormControl<string>;
  }> = new FormGroup({
    amountInput: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    duration: new FormControl<string>('', {
      validators: [Validators.pattern(/^(\d+[dhm]){1}$/)],
      nonNullable: true,
    }),
  });

  otacs: iOTAC[] = [];

  users: User[] = [];

  descSort = ClrDatagridSortOrder.DESC;

  constructor(
    private seService: ScheduledeventService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.list().subscribe({
      next: (users) => (this.users = users),
      error: () => (this.users = []),
    });

    this.scheduledEvents
      .pipe(
        takeUntil(this.onDestroy),
        tap((se: ScheduledEvent) => {
          this.currentScheduledEvent = se;
        }),
        switchMap((se: ScheduledEvent) => {
          return this.seService.listOtacs(se.id);
        })
      )
      .subscribe((otacList: OTAC[]) => {
        this.otacs =
          otacList?.map((otac) => this.addUserinformation(otac)) ?? [];
      });
  }

  addUserinformation(otac: OTAC): iOTAC {
    if (otac.user) {
      return {
        ...otac,
        status: this.hasRunOutOfTime(otac) ? 'taken' : 'out-of-time',
        userEmail: this.getUsername(otac.user),
      };
    }
    return { ...otac, status: 'free' };
  }

  getUsername(userId: string): string {
    return this.users.find((user) => user.id == userId)?.email ?? userId;
  }

  createOtacs() {
    this.seService
      .addOtacs(
        this.currentScheduledEvent.id,
        this.amountInputForm.controls.amountInput.value,
        this.amountInputForm.controls.duration.value
      )
      .subscribe((newOtacs: OTAC[]) => {
        this.otacs.push(
          ...newOtacs.map((otac) => this.addUserinformation(otac))
        );
        this.amountInputForm.controls.amountInput.setValue(1);
      });
  }

  deleteOtac(otac: iOTAC) {
    this.seService
      .deleteOtac(this.currentScheduledEvent.id, otac.name)
      .subscribe((res: ServerResponse) => {
        if (res.status == 200) {
          this.otacs.splice(this.otacs.indexOf(otac), 1);
        }
      });
  }

  getOverallInfo() {
    const usedOtacs: number = this.otacs.filter(
      (otac) => otac.user != ''
    ).length;
    return usedOtacs + '/' + this.otacs.length + ' OTACs used';
  }

  exportCSV() {
    let otacCSV = '';
    this.otacs.forEach((otac) => {
      otacCSV = otacCSV.concat(
        otac.name +
          ', ' +
          this.getUsername(otac.user) +
          ', ' +
          otac.redeemed_timestamp +
          ', ' +
          otac.max_duration +
          ', ' +
          otac.status +
          '\n'
      );
    });
    const filename = this.currentScheduledEvent.event_name + '_OTACs.csv';
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(otacCSV)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  close() {
    this.currentScheduledEvent = null;
    this.otacs = [];
    this.closeEvent.emit();
  }

  ngOnDestroy() {
    this.onDestroy.next('');
    this.onDestroy.complete();
  }

  hasMaxDuration(otac: OTAC) {
    return otac.max_duration != '';
  }

  hasRunOutOfTime(otac: OTAC) {
    if (!otac.user || !otac.redeemed_timestamp || !otac.max_duration) {
      return false;
    }
    const redeemedTimestamp = Date.parse(otac.redeemed_timestamp);
    const duration = parse(otac.max_duration);
    if (redeemedTimestamp + duration > Date.now()) {
      return true;
    }

    return false;
  }
}
