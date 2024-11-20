import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Progress } from '../../data/progress';
import { ServerResponse } from '../../data/serverresponse';
import { ProgressInfoComponent } from '../progress-info/progress-info.component';
import { timeSince } from '../../utils';
import { Router } from '@angular/router';
import { SessionProgressService } from '../session-progress.service';

@Component({
  selector: 'progress-card',
  templateUrl: './progress-card.component.html',
  styleUrls: ['./progress-card.component.scss'],
})
export class ProgressCardComponent {
  @Input()
  public progress: Progress;

  @Input()
  public hideUsername: boolean;

  @Input()
  public pause: Function;

  @Output() nameClickedEvent = new EventEmitter<string>();

  public timeSince = timeSince;

  @ViewChild('progressInfo') progressInfo: ProgressInfoComponent;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private sessionProgressService: SessionProgressService
  ) {}

  public terminateSession() {
    this.http
      .put(
        environment.server + '/session/' + this.progress.session + '/finished',
        {}
      )
      .subscribe((_s: ServerResponse) => {
        this.progress.finished = true;
      });
  }

  openInfo() {
    this.progressInfo.openModal();
  }

  openTerminalWindow() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/session',
        this.progress.session,
        'steps',
        Math.max(this.progress.current_step - 1, 0),
      ])
    );
    window.open(url, '_blank');
  }

  public progressFilterName() {
    this.nameClickedEvent.emit(this.progress.username);
  }

  public getProgress() {
    return this.sessionProgressService.getProgress(this.progress);
  }

  public getProgressColorClass() {
    return this.sessionProgressService.getProgressColorClass(this.progress);
  }

  public getUsername() {
    return this.hideUsername ? this.progress.user : this.progress.username;
  }
}
