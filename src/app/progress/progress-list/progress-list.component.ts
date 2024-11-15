import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Progress } from '../../data/progress';
import { ServerResponse } from '../../data/serverresponse';
import { ProgressInfoComponent } from '../progress-info/progress-info.component';
import { timeSince } from '../../utils';
import { Router } from '@angular/router';

@Component({
  selector: 'progress-list',
  templateUrl: './progress-list.component.html',
  styleUrls: ['./progress-list.component.scss']
})
export class ProgressListComponent {
  @Input()
  public progressList: Progress[] = [];

  @Input()
  public hideUsername: boolean;

  @Input()
  public pause: Function;

  @Output() nameClickedEvent = new EventEmitter<string>();

  public timeSince = timeSince;

  @ViewChild('progressInfo') progressInfo: ProgressInfoComponent;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnChanges(): void {
    console.log('Progress list received:');
    console.log(this.progressList)
  }

  public terminateSession(p: Progress) {
    this.http
      .put(
        environment.server + '/session/' + p.session + '/finished',
        {}
      )
      .subscribe((_s: ServerResponse) => {
        p.finished = true;
      });
  }

  openInfo(p: Progress) {
    this.progressInfo.progress = p;
    this.progressInfo.openModal();
  }

  openTerminalWindow(p: Progress) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/session',
        p.session,
        'steps',
        Math.max(p.current_step - 1, 0),
      ])
    );
    window.open(url, '_blank');
  }

  public progressFilterName(p: Progress) {
    this.nameClickedEvent.emit(p.username);
  }

  public getProgress(p: Progress) {
    //If we are in the provisioning state or count of total steps is invalid
    if (p.total_step == 0 || p.current_step == 0) {
      return 100;
    }
    //if finished display the total step reached percentage
    if (p.finished) {
      return Math.floor(
        (p.max_step / p.total_step) * 100
      );
    }

    //if currently running display the current step percentage
    return Math.floor(
      (p.current_step / p.total_step) * 100
    );
  }

  public getProgressColorClass(p: Progress) {
    if (p.finished) {
      return 'status-finished';
    }
    if (p.current_step == 0) {
      return 'status-provisioning';
    }
    if (p.current_step == p.total_step) {
      return 'status-success';
    }
    return 'status-running';
  }

  public getUsername(p: Progress) {
    return this.hideUsername ? p.user : p.username;
  }
}