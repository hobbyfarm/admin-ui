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

  public seSuccessAlert: string = "";
  public seDangerAlert: string = "";
  public seSuccessClosed: boolean = true;
  public seDangerClosed: boolean = true;

  constructor(
    public seService: ScheduledeventService
  ){

  }

  @ViewChild("wizard") wizard: NewScheduledEventComponent;
  @ViewChild("deletemodal") deletemodal: ClrModal;

  ngOnInit() {
    this.refresh();
  }

  public openDelete(se: ScheduledEvent) {
    this.deletingevent = se;
    this.deletemodal.open();
  }

  public doDelete()  {
    this.seService.delete(this.deletingevent)
    .subscribe(
      (reply: string) => {
        this.seSuccessAlert = reply;
        this.seSuccessClosed = false;
        setTimeout(() => {
          this.seSuccessClosed = true;
        }, 1000);
      },
      (reply: string) => {
        this.seDangerAlert = reply;
        this.seDangerClosed = false;
        setTimeout(() => {
          this.seDangerClosed = true;
        }, 1000);
      }
    )
  }

  public openNew() {
    this.wizard.open();
  }

  public refresh() {
    console.log("calling refresh");
    this.seService.list()
    .subscribe(
      (se: ScheduledEvent[]) => {
        this.events = se;
      }
    )
  }

}
