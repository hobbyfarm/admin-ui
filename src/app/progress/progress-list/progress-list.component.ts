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
import { ClrDatagridComparatorInterface } from '@clr/angular';

export class DurationComparator
  implements ClrDatagridComparatorInterface<Progress>
{
  compare(a: Progress, b: Progress): number {
    const durationA = a.finished
      ? a.last_update.getTime() - a.started.getTime()
      : Date.now() - a.started.getTime();

    const durationB = b.finished
      ? b.last_update.getTime() - b.started.getTime()
      : Date.now() - b.started.getTime();

    return durationA - durationB;
  }
}

@Component({
  selector: 'progress-list',
  templateUrl: './progress-list.component.html',
  styleUrls: ['./progress-list.component.scss'],
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

  constructor(private sessionProgressService: SessionProgressService) {}

  public terminateSession(p: Progress) {
    return this.sessionProgressService.terminateSession(p);
  }

  public durationComparator = new DurationComparator();

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
