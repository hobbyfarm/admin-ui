import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ClrDatagridSortOrder
} from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { OTAC } from 'src/app/data/otac.type';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';

interface iOTAC extends OTAC {
  userEmail?: string;
  status: 'free' | 'taken';
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

  amountInputForm: FormGroup = new FormGroup({
    amountInput: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  amountNewOtacs: number = 1;

  otacs: iOTAC[] = [];

  users: User[] = [];

  descSort = ClrDatagridSortOrder.DESC;

  constructor(
    private seService: ScheduledeventService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
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
        status: 'taken',
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
      .addOtacs(this.currentScheduledEvent.id, this.amountNewOtacs)
      .subscribe((newOtacs: OTAC[]) => {
        this.otacs.push(
          ...newOtacs.map((otac) => this.addUserinformation(otac))
        );
        this.amountNewOtacs = 1;
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
}
