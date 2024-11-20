import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Progress } from '../../data/progress';
import { ProgressInfoComponent } from '../progress-info/progress-info.component';
import { timeSince } from '../../utils';
import { SessionProgressService } from '../session-progress.service';

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

  constructor(
    private sessionProgressService: SessionProgressService
  ) {}

  public terminateSession(p: Progress) {
    return this.sessionProgressService.terminateSession(p);
  }

  openInfo(p: Progress) {
    this.progressInfo.progress = p;
    this.progressInfo.openModal();
  }

  openTerminalWindow(p: Progress) {
    this.sessionProgressService.openTerminalWindow(p);
  }

  public progressFilterName(p: Progress) {
    this.nameClickedEvent.emit(p.username);
  }

  public getProgress(p: Progress) {
    return this.sessionProgressService.getProgress(p);
  }

  public getProgressColorClass(p: Progress): string {
    return this.sessionProgressService.getProgressColorClass(p);
  }

  public getUsername(p: Progress) {
    return this.hideUsername ? p.user : p.username;
  }
}