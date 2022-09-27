import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { NewScheduledEventComponent } from './new-scheduled-event/new-scheduled-event.component';
import { ClrModal, ClrDatagridSortOrder } from '@clr/angular';
import { CourseService } from '../data/course.service';
import { ScenarioService } from '../data/scenario.service';
import { UserService } from '../data/user.service';
import { RbacService } from '../data/rbac.service';
import { Subscription } from 'rxjs';


interface extendedScheduledEvent extends ScheduledEvent {
  creatorEmail?: String;
  courseNames?: String[];
  scenarioNames?: String[];
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit, OnDestroy {
  public events: extendedScheduledEvent[] = [];

  public deleteopen: boolean = false;

  public deletingevent: ScheduledEvent = new ScheduledEvent();

  public seSuccessAlert: string = "";
  public seDangerAlert: string = "";
  public seSuccessClosed: boolean = true;
  public seDangerClosed: boolean = true;

  public editingEvent: ScheduledEvent;

  public descSort = ClrDatagridSortOrder.DESC;

  private scenarioSubscription: Subscription; 


  constructor(
    public seService: ScheduledeventService,
    public courseService: CourseService,
    public scenarioService: ScenarioService,
    public userService: UserService,
    public rbacService: RbacService
  ) {

  }

  @ViewChild("wizard", { static: true }) wizard: NewScheduledEventComponent;
  @ViewChild("deletemodal", { static: true }) deletemodal: ClrModal;

  ngOnInit() {
    this.seService.list().subscribe(se => {
      this.events = se
      this.updateFields()
    })   
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
    this.seService.list(true).subscribe(se => {
      this.events = se
      this.updateFields()
    })
  }

  public async updateFields() {
    if (await this.rbacService.Grants("courses", "list")) {
      this.courseService.list().subscribe(courseList => {
        this.events.forEach(se => {
          if (se.courses) {
            se.courseNames = courseList.filter(course => se.courses.includes(course.id)).map(c => c.name)
          }
        }
        )
      })
    }

    if (await this.rbacService.Grants("scenarios", "list")) {
      this.scenarioSubscription = this.scenarioService.list().subscribe(scenarioList => {
        this.events.forEach(se => {
          if (se.scenarios) {
            se.scenarioNames = scenarioList.filter(scenario => se.scenarios.includes(scenario.id)).map(s => s.name)
          }
        }
        )
      })
    }

    if (await this.rbacService.Grants("users", "list")) {
      this.userService.getUsers().subscribe(users => {
        this.events.forEach(se => {
          se.creatorEmail = users.filter(u => u.id == se.creator)[0]?.email
        })
      })
    }
  }

  public newupdated() {
    this.refresh();
  }

  ngOnDestroy() {
    // only if cached -> unsubscribe!
    if(this.scenarioSubscription) {
      this.scenarioSubscription.unsubscribe()
    }
  }
}
