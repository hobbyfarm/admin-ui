import { Component } from '@angular/core';
import { ClrDatagridFilter, ClrDatagridFilterInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import { ScheduledEvent } from 'src/app/data/scheduledevent';

@Component({
  selector: 'event-status-filter',
  templateUrl: './event-status-filter.component.html',
})
export class EventStatusFilterComponent implements ClrDatagridFilterInterface<ScheduledEvent, boolean> {
  enabled: boolean = true;

  constructor(filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }

  changes = new Subject<boolean>();

  setActive(active: boolean): void {
    this.enabled = active;
    this.changes.next(this.enabled);
  }

  isActive(): boolean {
    return this.enabled;
  }

  accepts(se: ScheduledEvent): boolean {
    return !se.finished;
  }
}