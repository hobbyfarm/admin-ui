import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { NewScheduledEventComponent } from './new-scheduled-event/new-scheduled-event.component';
import { ClrModal, ClrDatagridSortOrder } from '@clr/angular';
import { CourseService } from '../data/course.service';
import { combineLatest } from 'rxjs';
import { ScenarioService } from '../data/scenario.service';
import { UserService } from '../data/user.service';


interface extendedScheduledEvent extends ScheduledEvent {
  creatorEmail?: String;
  courseNames?: String[];
  scenarioNames?: String[];
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit {
  public events: extendedScheduledEvent[] = [];

  public deleteopen: boolean = false;

  public deletingevent: ScheduledEvent = new ScheduledEvent();

  public seSuccessAlert: string = "";
  public seDangerAlert: string = "";
  public seSuccessClosed: boolean = true;
  public seDangerClosed: boolean = true;

  public editingEvent: ScheduledEvent;

  public descSort = ClrDatagridSortOrder.DESC;

  constructor(
    public seService: ScheduledeventService,
    public courseService: CourseService,
    public scenarioService: ScenarioService,
    public userService: UserService
  ) {

  }

  @ViewChild("wizard", { static: true }) wizard: NewScheduledEventComponent;
  @ViewChild("deletemodal", { static: true }) deletemodal: ClrModal;

  ngOnInit() {
    this.refresh()
  }

  public openDelete(se: ScheduledEvent) {
    this.deletingevent = se;
    this.deletemodal.open();
  }

  public doDelete() {
    this.deleteopen = false;
    this.seService.delete(this.deletingevent)
      .subscribe(
        (_reply: string) => {
          this.refresh();
          this.seSuccessAlert = `Deleted scheduled event \"${this.deletingevent.event_name}\" successfully!`;
          this.seSuccessClosed = false;
          setTimeout(() => {
            this.seSuccessClosed = true;
          }, 2000);
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
    this.editingEvent = null;
    this.wizard.open();
  }

  public openEdit(se: ScheduledEvent) {
    this.editingEvent = se;
    this.wizard.setOnCloseFn(()=>{this.editingEvent = null})
    this.wizard.open();
  }

  public refresh() {
    combineLatest([this.seService.list(true), this.courseService.list(), this.scenarioService.list(), this.userService.getUsers()]).subscribe(([seList, courseList, scenarioList, userList]) => {
      this.events = seList
      this.events.forEach(event => {
        event.creatorEmail = userList.filter(u => u.id == event.creator)[0]?.email
        if (event.courses) {
          event.courseNames = courseList.filter(course => event.courses.includes(course.id)).map(c => c.name)

        }
        if (event.scenarios) {
          event.scenarioNames = scenarioList.filter(scenario => event.scenarios.includes(scenario.id)).map(sc => sc.name)
        }
      })
      console.log(this.events)
    })
  }

  public newupdated() {
    this.refresh();
  }

}
