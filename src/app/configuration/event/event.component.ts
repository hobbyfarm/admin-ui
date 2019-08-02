import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { NewScheduledEventComponent } from './new-scheduled-event/new-scheduled-event.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public events: ScheduledEvent[] = [];

  constructor(
    public seService: ScheduledeventService
  ){

  }

  @ViewChild("wizard") wizard: NewScheduledEventComponent;

  ngOnInit() {
    this.seService.list()
    .subscribe(
      (se: ScheduledEvent[]) => {
        this.events = se;
      }
    )
  }

  public openNew() {
    this.wizard.open();
  }

}
