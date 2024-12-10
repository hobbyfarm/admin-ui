import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { OTAC } from 'src/app/data/otac.type';
import { Progress } from 'src/app/data/progress';
import { ProgressService } from 'src/app/data/progress.service';
import { ScheduledEventBase } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';

interface dashboardUsers extends User {
  progresses?: Progress[];
  uniqueScenarios?: number;
  otac?: OTAC;
  started?: string;
}

@Component({
  selector: 'users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss'],
})
export class UsersDashboardComponent implements OnInit {
  @Input()
  selectedEvent: ScheduledEventBase;

  constructor(
    public userService: UserService,
    public progressService: ProgressService,
    public scheduledEventService: ScheduledeventService,
  ) {}

  public dashboardUsers: dashboardUsers[] = [];
  public loading: boolean = false;

  ngOnInit(): void {
    this.getList();
  }

  ngOnChanges() {
    this.getList();
  }

  downloadCSV(): void {
    // To be implemented
  }

  getList(): void {
    this.loading = true;
    combineLatest([
      this.userService.list(), // List of users
      this.progressService.listByScheduledEvent(this.selectedEvent.id, true), // List of progresses
      this.scheduledEventService.listOtacs(this.selectedEvent.id), // List of OTACs
    ]).subscribe(([users, progresses, otacs]) => {
      const safeOtacs = otacs || []; // Default to empty array if null
      // Map OTACs to users
      const otacMap = new Map<string, OTAC>(
        safeOtacs.map((otac) => [otac.user, otac]),
      );

      // Group progresses by user ID
      const progressMap = new Map<string, Progress[]>();
      progresses.forEach((progress) => {
        if (!progressMap.has(progress.user)) {
          progressMap.set(progress.user, []);
        }
        progressMap.get(progress.user)?.push(progress);
      });

      // List of users with OTACs (those linked to OTACs)
      const usersWithOtacs = new Set(safeOtacs.map((otac) => otac.user));

      // Filter and enrich users
      this.dashboardUsers = users
        .filter(
          (user) =>
            user.access_codes?.includes(this.selectedEvent.access_code) || // Check for event access code
            usersWithOtacs.has(user.id), // Users linked to OTACs
        )
        .map((user) => {
          // Enrich user object with progresses, unique scenario count, and OTAC
          const userProgresses = progressMap.get(user.id) || [];
          // Calculate the earliest progress started timestamp

          const firstProgressStarted = userProgresses.reduce(
            (earliest, progress) =>
              !earliest ||
              new Date(progress.started) < new Date(earliest.started)
                ? progress
                : earliest,
            null as Progress | null,
          );

          let started = firstProgressStarted?.started;
          if (otacMap.get(user.id)) {
            started = new Date(otacMap.get(user.id)?.redeemed_timestamp ?? '');
          }

          const uniqueScenarios = new Set(userProgresses.map((p) => p.scenario))
            .size;

          return {
            ...user, // Spread original user properties
            progresses: userProgresses,
            uniqueScenarios,
            otac: otacMap.get(user.id) || null, // Add OTAC if applicable
            started: started,
          } as dashboardUsers;
        });

      this.loading = false; // remove spinner
    });
  }
}
