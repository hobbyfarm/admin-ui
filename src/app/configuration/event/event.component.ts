import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { NewScheduledEventComponent } from './new-scheduled-event/new-scheduled-event.component';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public events: ScheduledEvent[] = [];

  public deleteopen: boolean = false;

  public deletingevent: ScheduledEvent = new ScheduledEvent();

  constructor(
    public seService: ScheduledeventService
  ){

  }

  @ViewChild("wizard") wizard: NewScheduledEventComponent;
  @ViewChild("deletemodal") deletemodal: ClrModal;

  ngOnInit() {
    this.seService.list()
    .subscribe(
      (se: ScheduledEvent[]) => {
        this.events = se;
      }
    )
  }

  public opendelete(se: ScheduledEvent) {
    this.deletingevent = se;
    this.deletemodal.open();
  }

  public doDelete()  {
    //  prepped for deleting.
  }

  public openNew() {
    this.wizard.open();
  }

}
