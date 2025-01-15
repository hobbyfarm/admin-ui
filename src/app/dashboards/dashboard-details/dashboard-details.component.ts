import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardScheduledEvent } from '../../data/scheduledevent';
import { ScheduledeventService } from '../../data/scheduledevent.service';
import { RbacService } from '../../data/rbac.service';
import { Resource, Verb } from '../../data/rbac';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss'],
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {
  public sessionDashboardActive: boolean = true;
  public vmDashboardActive: boolean = false;
  public statisticsDashboardActive: boolean = false;
  public usersDashboardActive: boolean = false;
  public costDashboardActive: boolean = false;

  public selectedEvent?: DashboardScheduledEvent;
  public loggedInAdminEmail: string;

  public rbacSuccessSessions: boolean = false;
  public rbacSuccessVms: boolean = false;

  private eventId: string;
  private eventSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private scheduledeventService: ScheduledeventService,
    private rbacService: RbacService,
  ) {}
  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  ngOnInit() {
    this.eventSubscription = this.route.params
      .pipe(
        tap((params: Params) => {
          this.eventId = params['id'] ?? '';
        }),
        switchMap(() => this.scheduledeventService.getDashboardCache()),
      )
      .subscribe((cache: Map<string, DashboardScheduledEvent>) => {
        const currentEvent = cache.get(this.eventId);
        if (currentEvent) {
          this.selectedEvent = currentEvent;
        }
      });
    // Do I need to check that?
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
      ['list', 'get'],
    ).then((rbacCheckSessions: boolean) => {
      this.rbacSuccessSessions = rbacCheckSessions;
    });

    this.setRbacCheck(
      ['scheduledevents', 'virtualmachines', 'virtualmachinesets', 'users'],
      ['list', 'get'],
    ).then((rbacCheck: boolean) => {
      this.rbacSuccessVms = rbacCheck;
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
}
