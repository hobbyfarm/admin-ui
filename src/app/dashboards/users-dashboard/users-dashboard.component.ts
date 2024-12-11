import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Course } from 'src/app/data/course';
import { CourseService } from 'src/app/data/course.service';
import { OTAC } from 'src/app/data/otac.type';
import { Progress } from 'src/app/data/progress';
import { ProgressService } from 'src/app/data/progress.service';
import { ScheduledEventBase } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';
import parse from 'parse-duration';

interface dashboardUsers extends User {
  progresses?: Progress[];
  uniqueScenarios?: number;
  otac?: OTAC;
  started?: string;
  status?: string;
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
    public courseService: CourseService,
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
      this.courseService.list(),
    ]).subscribe(([users, progresses, otacs, courses]) => {
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
            status: this.getUsersStatus(
              userProgresses,
              otacMap.get(user.id) || null,
              courses,
            ),
          } as dashboardUsers;
        });

      this.loading = false; // remove spinner
    });
  }

  getUsersStatus(
    progresses: Progress[],
    otac: OTAC | null,
    courses: Course[],
  ): string {
    // Extract all available scenario IDs from the event
    const eventScenarioIds = new Set<string>(this.selectedEvent.scenarios);

    courses.forEach((course) => {
      if (this.selectedEvent.courses?.includes(course.id)) {
        course.scenarios.forEach((scenario) => {
          eventScenarioIds.add(scenario.id);
        });
      }
    });

    // Check if the user has finished all required scenarios
    const completedScenarioIds = new Set(
      progresses
        .filter((progress) => progress.total_step === progress.max_step)
        .map((progress) => progress.scenario),
    );

    const allScenariosCompleted = [...eventScenarioIds].every((scenarioId) =>
      completedScenarioIds.has(scenarioId),
    );

    // Determine user status based on progress and time
    if (allScenariosCompleted) {
      return 'completed';
    } else if (otac && !this.otacHasTimeLeft(otac)) {
      console.log(otac);
      return 'out-of-time';
    } else {
      return 'in-progress';
    }
  }

  otacHasTimeLeft(otac: OTAC) {
    if (!otac || !otac.user || !otac.redeemed_timestamp || !otac.max_duration) {
      return false;
    }

    const redeemedTimestamp = Date.parse(otac.redeemed_timestamp);
    const duration = parse(otac.max_duration);
    if (!duration) {
      return false;
    }
    if (redeemedTimestamp + duration > Date.now()) {
      return true;
    }

    return false;
  }
}
