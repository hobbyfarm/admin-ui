import { Component } from '@angular/core';
import { ClrDatagridFilter, ClrDatagridFilterInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import { ScheduledEventBase } from 'src/app/data/scheduledevent';

@Component({
  selector: 'event-status-filter',
  templateUrl: './event-status-filter.component.html',
})
export class EventStatusFilterComponent implements ClrDatagridFilterInterface<ScheduledEventBase, boolean> {
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

  accepts(se: ScheduledEventBase): boolean {
    return !se.finished;
  }
}