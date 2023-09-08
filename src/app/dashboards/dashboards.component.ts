import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduledEvent } from '../data/scheduledevent';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScheduledeventService } from '../data/scheduledevent.service';
import { UserService } from '../data/user.service';
import { ProgressService } from 'src/app/data/progress.service';
import { ProgressCount } from 'src/app/data/progress';
import { VmService } from '../data/vm.service';
import { RbacService } from '../data/rbac.service';
import { Resource, Verb } from '../data/rbac';
import { lastValueFrom } from 'rxjs';

interface DashboardScheduledEvent extends ScheduledEvent {
  creatorEmail?: String;
  provisionedVMs?: Number;
}

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit, OnDestroy {
  public sessionDashboardActive: boolean = true;
  public vmDashboardActive: boolean = false;
  public selectedEvent: DashboardScheduledEvent;
  public loggedInAdminEmail: string;

  public scheduledEvents: DashboardScheduledEvent[] = [];
  public activeEvents: DashboardScheduledEvent[] = [];
  public finishedEvents: DashboardScheduledEvent[] = [];
  public updateInterval: any;

  public rbacSuccessSessions: boolean = false;
  public rbacSuccessVms: boolean = false;

  constructor(
    public scheduledeventService: ScheduledeventService,
    public vmService: VmService,
    public helper: JwtHelperService,
    public userService: UserService,
    public progressService: ProgressService,
    public rbacService: RbacService
  ) {}

  ngOnInit() {
    // verify rbac permissions before we display this page
    this.setRbacCheck(
      [
        'scheduledevents',
        'sessions',
        'progresses',
        'users',
        'courses',
        'scenarios',
      ],
      ['list', 'get']
    ).then((rbacCheckSessions: boolean) => {
      this.rbacSuccessSessions = rbacCheckSessions;
    });

    this.setRbacCheck(
      ['scheduledevents', 'virtualmachines', 'virtualmachinesets', 'users'],
      ['list', 'get']
    ).then((rbacCheck: boolean) => {
      this.rbacSuccessVms = rbacCheck;
    });

    this.scheduledeventService
      .list()
      .subscribe((s: DashboardScheduledEvent[]) => {
        this.scheduledEvents = s;
        this.activeEvents = s.filter((se) => !se.finished);
        this.finishedEvents = s.filter((se) => se.finished);
        if (this.activeEvents.length > 0) {
          this.selectedEvent = this.activeEvents[0];
        }
        this.rbacService.Grants('users', 'list').then((rbacUsers) => {
          rbacUsers && this.sortEventLists();
        });
        this.setActiveSessionsCount();
        this.updateInterval = setInterval(() => {
          this.setActiveSessionsCount();
        }, 30 * 1000);
      });
  }

  /**
   *
   * @returns true if all grants are successful; else false
   */
  async setRbacCheck(resources: Resource[], verbs: Verb[]) {
    let rbacCheck = true;
    outerForLoop: for (let resource of resources) {
      for (let verb of verbs) {
        const allowed: boolean = await this.rbacService.Grants(resource, verb);
        if (!allowed) {
          rbacCheck = false;
          break outerForLoop;
        }
      }
    }
    return rbacCheck;
  }

  async sortEventLists() {
    // we always load our token synchronously from local storage
    // for symplicity we are using type assertion to string here, avoiding to handle promises we're not expecting
    const token = this.helper.tokenGetter() as string;
    this.loggedInAdminEmail = this.helper.decodeToken(token).email;
    let users = await lastValueFrom(this.userService.getUsers());
    this.scheduledEvents.forEach((sEvent) => {
      sEvent.creatorEmail = users.find(
        (user) => user.id == sEvent.creator
      )?.email;
    });
    this.sortByLoggedInAdminUser(this.scheduledEvents);
    this.sortByLoggedInAdminUser(this.activeEvents);
    this.sortByLoggedInAdminUser(this.finishedEvents);
  }
  sortByLoggedInAdminUser(eventArray: DashboardScheduledEvent[]) {
    const isCreatedByMe = (e: DashboardScheduledEvent) =>
      Number(e.creatorEmail === this.loggedInAdminEmail);
    return eventArray.sort((a, b) => isCreatedByMe(b) - isCreatedByMe(a));
  }
  setScheduledEvent(ev: DashboardScheduledEvent) {
    this.selectedEvent = ev;
  }

  setActiveSessionsCount() {
    if (this.rbacSuccessVms) {
      this.vmService.count().subscribe((countMap) => {
        this.scheduledEvents.forEach((se) => {
          se.provisionedVMs = countMap[se.id] || 0;
        });
      });
    }
    if (this.rbacSuccessSessions) {
      this.progressService.count().subscribe((c: ProgressCount) => {
        this.scheduledEvents.forEach((se) => {
          se.activeSessions = c[se.id] || 0;
        });
      });
    }
  }

  setActiveDashboard(event: DashboardScheduledEvent, value: String) {
    this.setScheduledEvent(event);
    if (value == 'session') {
      this.vmDashboardActive = false;
      this.sessionDashboardActive = true;
    }
    if (value == 'vm') {
      this.sessionDashboardActive = false;
      this.vmDashboardActive = true;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.updateInterval);
  }
}
