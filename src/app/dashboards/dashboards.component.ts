import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardScheduledEvent } from '../data/scheduledevent';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScheduledeventService } from '../data/scheduledevent.service';
import { UserService } from '../data/user.service';
import { RbacService } from '../data/rbac.service';
import { ProgressCount } from '../data/progress';
import { ProgressService } from '../data/progress.service';
import { VmService } from '../data/vm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit, OnDestroy {
  public loggedInAdminEmail: string;

  public scheduledEvents: DashboardScheduledEvent[] = [];
  public activeEvents: DashboardScheduledEvent[] = [];
  public finishedEvents: DashboardScheduledEvent[] = [];

  private listProgress: boolean = false;
  private listVMs: boolean = false;
  private updateInterval: any;

  public expandActiveEvents = true;

  constructor(
    private scheduledeventService: ScheduledeventService,
    private helper: JwtHelperService,
    private userService: UserService,
    private rbacService: RbacService,
    private progressService: ProgressService,
    private vmService: VmService,
    private router: Router
  ) {}

  ngOnInit() {
    this.rbacService
      .Grants('virtualmachines', 'list')
      .then((allowed: boolean) => {
        this.listVMs = allowed;
      });
    this.rbacService.Grants('progresses', 'list').then((allowed: boolean) => {
      this.listProgress = allowed;
    });
    this.scheduledeventService
      .list()
      .subscribe((s: DashboardScheduledEvent[]) => {
        this.scheduledEvents = s;
        this.activeEvents = s.filter((se) => se.active && !se.finished);
        this.finishedEvents = s.filter((se) => se.active && se.finished);
        const map = this.scheduledEvents.reduce<
          Map<string, DashboardScheduledEvent>
        >((map, se) => {
          map.set(se.id, se);
          return map;
        }, new Map());
        this.scheduledeventService.setDashboardCache(map);
        this.rbacService.Grants('users', 'list').then((rbacUsers) => {
          rbacUsers && this.sortEventLists();
        });
        this.setActiveSessionsCount();
        this.updateInterval = setInterval(() => {
          this.setActiveSessionsCount();
        }, 30 * 1000);
        if (this.activeEvents.length > 0) {
          this.router.navigateByUrl(
            `/dashboards/event/${this.activeEvents[0].id}`
          );
        }
      });
  }

  async sortEventLists() {
    // we always load our token synchronously from local storage
    // for symplicity we are using type assertion to string here, avoiding to handle promises we're not expecting
    const token = this.helper.tokenGetter() as string;
    this.loggedInAdminEmail = this.helper.decodeToken(token).email;
    this.userService.list().subscribe((users) => {
      this.scheduledEvents.forEach((se) => {
        se.creatorEmail = users.filter((u) => u.id == se.creator)[0]?.email;
      });
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

  setActiveSessionsCount() {
    if (this.listVMs) {
      this.vmService.count().subscribe((countMap) => {
        this.activeEvents.forEach((se) => {
          se.provisionedVMs = countMap[se.id] || 0;
        });
        this.finishedEvents.forEach((se) => {
          se.provisionedVMs = countMap[se.id] || 0;
        });
      });
    }
    if (this.listProgress) {
      this.progressService.count().subscribe((c: ProgressCount) => {
        this.activeEvents.forEach((se) => {
          se.activeSessions = c[se.id] || 0;
        });
        this.finishedEvents.forEach((se) => {
          se.activeSessions = c[se.id] || 0;
        });
      });
    }
  }

  getTooltipTitle(event: DashboardScheduledEvent): string {
    let tooltipTitle = '';
    if (event.activeSessions > 0) {
      tooltipTitle = `${event.activeSessions} active session(s)`;
    }
    if (event.provisionedVMs && event.provisionedVMs > 0) {
      tooltipTitle += ` and ${event.provisionedVMs} provisioned vm(s)`;
    }
    if (!tooltipTitle) {
      return 'No active sessions or provisioned vms!';
    }
    return tooltipTitle;
  }

  ngOnDestroy(): void {
    clearInterval(this.updateInterval);
  }
}
