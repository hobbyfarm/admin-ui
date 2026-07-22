import { Component, Input, OnChanges } from '@angular/core';
import { combineLatest, forkJoin, of, retry, switchMap, take } from 'rxjs';
import { CourseService } from 'src/app/data/course.service';
import { OTAC } from 'src/app/data/otac.type';
import { Progress } from 'src/app/data/progress';
import { ProgressService } from 'src/app/data/progress.service';
import { ScheduledEventBase } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';
import parse from 'parse-duration';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import {
  Quiz,
  QuizEvaluation,
  QuizEvaluationAttempt,
  QuizService,
} from 'src/app/data/quiz.service';

interface EventQuiz {
  key: string;
  id: string;
  title: string;
  scenarioId: string;
  scenarioName: string;
  maxAttempts: number;
}

interface QuizResult extends EventQuiz {
  score?: number;
  passed: boolean;
  started: boolean;
  attemptsExhausted: boolean;
}

type QuizResultStatus =
  | 'not-applicable'
  | 'not-started'
  | 'in-progress'
  | 'passed'
  | 'failed';

interface dashboardUsers extends User {
  progresses?: Progress[];
  uniqueScenarios?: number;
  otac?: OTAC | null;
  started?: Date;
  status?: string;
  quizResults: QuizResult[];
  passedQuizzes: number;
  totalQuizzes: number;
  quizResultStatus: QuizResultStatus;
  quizResultLabel: string;
}

@Component({
  selector: 'users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss'],
})
export class UsersDashboardComponent implements OnChanges {
  @Input()
  selectedEvent: ScheduledEventBase;

  constructor(
    public userService: UserService,
    public progressService: ProgressService,
    public scheduledEventService: ScheduledeventService,
    public courseService: CourseService,
    public scenarioService: ScenarioService,
    public quizService: QuizService,
  ) {}

  public dashboardUsers: dashboardUsers[] = [];
  public loading: boolean = false;

  ngOnChanges() {
    this.getList();
  }

  downloadCSV(): void {
    const header = [
      'ID',
      'Email',
      'OTAC',
      'Started',
      'Session Count',
      'Unique Scenarios',
      'Quiz Names',
      'Scores (%)',
      'Quiz Result',
      'Status',
    ];
    const rows = this.dashboardUsers.map((userData) => [
      userData.id || '',
      userData.email || '',
      userData.otac?.name || '',
      userData.started?.toISOString() || '',
      userData.progresses?.length || 0,
      userData.uniqueScenarios || 0,
      userData.quizResults.map((result) => result.title).join('; '),
      userData.quizResults
        .map((result) =>
          result.score === undefined ? '-' : `${result.score}/100`,
        )
        .join('; '),
      userData.quizResultLabel,
      userData.status || '',
    ]);
    const userCSV = [header, ...rows]
      .map((row) => row.map((value) => this.escapeCSV(value)).join(','))
      .join('\n');
    const filename = this.selectedEvent.event_name + '_users.csv';
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(userCSV),
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  getList(): void {
    if (!this.selectedEvent) {
      return;
    }

    this.loading = true;
    combineLatest([
      this.userService.list(), // List of users
      this.progressService.listByScheduledEvent(this.selectedEvent.id, true), // List of progresses
      this.scheduledEventService.listOtacs(this.selectedEvent.id), // List of OTACs
      this.courseService.list(),
      this.quizService.list(),
      this.quizService.listEvaluations(),
    ])
      .pipe(
        switchMap(
          ([users, progresses, otacs, courses, quizzes, quizEvaluations]) => {
            const eventScenarioIds = new Set<string>(
              this.selectedEvent.scenarios,
            );
            const categories: string[] = [];

            // Add scenarios from courses
            courses.forEach((course) => {
              if (this.selectedEvent.courses?.includes(course.id)) {
                course.scenarios.forEach((s) => eventScenarioIds.add(s.id));
                categories.push(...(course.categories || []));
              }
            });

            // Fetch dynamic scenarios if categories exist
            return forkJoin({
              users: of(users),
              progresses: of(progresses),
              otacs: of(otacs),
              dynamicScenarios: this.listDynamicScenarios(categories),
              eventScenarioIds: of(eventScenarioIds),
              quizzes: of(quizzes),
              quizEvaluations: of(quizEvaluations),
            });
          },
        ),
        switchMap(
          ({
            users,
            progresses,
            otacs,
            dynamicScenarios,
            eventScenarioIds,
            quizzes,
            quizEvaluations,
          }) => {
            dynamicScenarios?.forEach((scenarioId) => {
              eventScenarioIds.add(scenarioId.toString());
            });

            const scenarioRequests = [...eventScenarioIds].map((scenarioId) =>
              this.scenarioService.get(scenarioId),
            );

            return forkJoin({
              users: of(users),
              progresses: of(progresses),
              otacs: of(otacs),
              eventScenarioIds: of(eventScenarioIds),
              scenarios:
                scenarioRequests.length > 0
                  ? forkJoin(scenarioRequests)
                  : of([] as Scenario[]),
              quizzes: of(quizzes),
              quizEvaluations: of(quizEvaluations),
            });
          },
        ),
      )
      .subscribe(
        ({
          users,
          progresses,
          otacs,
          eventScenarioIds,
          scenarios,
          quizzes,
          quizEvaluations,
        }) => {
          const safeOtacs = otacs || []; // Default to empty array if null
          // Map OTACs to users
          const otacMap = new Map<string, OTAC>(
            safeOtacs
              .filter((o): o is OTAC & { user: string } => !!o.user)
              .map((o) => [o.user, o]),
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

          const eventQuizzes = this.getEventQuizzes(
            eventScenarioIds,
            scenarios,
            quizzes,
          );

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
                started = new Date(
                  otacMap.get(user.id)?.redeemed_timestamp ?? '',
                );
              }

              const uniqueScenarios = new Set(
                userProgresses.map((p) => p.scenario),
              ).size;
              const quizResults = this.getQuizResults(
                user.id,
                eventQuizzes,
                quizEvaluations,
              );
              const passedQuizzes = quizResults.filter(
                (result) => result.passed,
              ).length;
              const quizResultStatus = this.getQuizResultStatus(quizResults);

              return {
                ...user, // Spread original user properties
                progresses: userProgresses,
                uniqueScenarios,
                otac: otacMap.get(user.id) || null, // Add OTAC if applicable
                started: started,
                status: this.getUsersStatus(
                  userProgresses,
                  otacMap.get(user.id) || null,
                  eventScenarioIds,
                ),
                quizResults,
                passedQuizzes,
                totalQuizzes: eventQuizzes.length,
                quizResultStatus,
                quizResultLabel: this.getQuizResultLabel(
                  quizResultStatus,
                  passedQuizzes,
                  eventQuizzes.length,
                ),
              } as dashboardUsers;
            });

          this.loading = false; // remove spinner
        },
      );
  }

  private getEventQuizzes(
    eventScenarioIds: Set<string>,
    scenarios: Scenario[],
    quizzes: Quiz[],
  ): EventQuiz[] {
    const quizzesById = new Map(
      quizzes
        .filter((quiz): quiz is Quiz & { id: string } => !!quiz.id)
        .map((quiz) => [quiz.id, quiz]),
    );
    const eventQuizzes = new Map<string, EventQuiz>();

    scenarios
      .filter((scenario) => eventScenarioIds.has(scenario.id))
      .forEach((scenario) => {
        (scenario.steps || []).forEach((step) => {
          if (!step.quiz) {
            return;
          }

          const key = this.quizEvaluationKey(scenario.id, step.quiz);
          if (!eventQuizzes.has(key)) {
            const quiz = quizzesById.get(step.quiz);
            eventQuizzes.set(key, {
              key,
              id: step.quiz,
              title: quiz?.title || step.quiz,
              scenarioId: scenario.id,
              scenarioName: scenario.name,
              maxAttempts: Math.max(quiz?.max_attempts || 1, 1),
            });
          }
        });
      });

    return [...eventQuizzes.values()];
  }

  private getQuizResults(
    userId: string,
    eventQuizzes: EventQuiz[],
    quizEvaluations: QuizEvaluation[],
  ): QuizResult[] {
    const evaluations = new Map(
      quizEvaluations
        .filter((evaluation) => evaluation.user === userId)
        .map((evaluation) => [
          this.quizEvaluationKey(evaluation.scenario, evaluation.quiz),
          evaluation,
        ]),
    );

    return eventQuizzes.map((eventQuiz) => {
      const evaluation = evaluations.get(eventQuiz.key);
      const completedAttempts = (evaluation?.attempts || []).filter(
        (attempt) => !!attempt.timestamp,
      );
      const bestAttempt = completedAttempts.reduce<
        QuizEvaluationAttempt | undefined
      >(
        (best, attempt) =>
          !best || attempt.score > best.score ? attempt : best,
        undefined,
      );

      const passed = completedAttempts.some((attempt) => attempt.pass);

      return {
        ...eventQuiz,
        score: bestAttempt?.score,
        passed,
        started: !!evaluation,
        attemptsExhausted:
          !passed && completedAttempts.length >= eventQuiz.maxAttempts,
      };
    });
  }

  private getQuizResultStatus(quizResults: QuizResult[]): QuizResultStatus {
    if (quizResults.length === 0) {
      return 'not-applicable';
    }
    if (!quizResults.some((result) => result.started)) {
      return 'not-started';
    }
    if (quizResults.some((result) => result.attemptsExhausted)) {
      return 'failed';
    }
    if (quizResults.every((result) => result.passed)) {
      return 'passed';
    }
    return 'in-progress';
  }

  private getQuizResultLabel(
    status: QuizResultStatus,
    passedQuizzes: number,
    totalQuizzes: number,
  ): string {
    switch (status) {
      case 'not-applicable':
        return '-';
      case 'not-started':
        return 'Not Started';
      case 'passed':
        return 'Pass';
      case 'failed':
        return 'No Pass';
      case 'in-progress':
        return `${passedQuizzes}/${totalQuizzes}`;
    }
  }

  private quizEvaluationKey(scenarioId: string, quizId: string): string {
    return `${scenarioId}\u0000${quizId}`;
  }

  private escapeCSV(value: string | number): string {
    return `"${String(value).replace(/"/g, '""')}"`;
  }

  getUsersStatus(
    progresses: Progress[],
    otac: OTAC | null,
    eventScenarioIds: Set<string>,
  ): string {
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
      return 'out-of-time';
    } else {
      return 'in-progress';
    }
  }

  otacHasTimeLeft(otac: OTAC) {
    if (!otac || !otac.user || !otac.redeemed_timestamp || !otac.max_duration) {
      return false;
    }

    const redeemedTimestamp = otac.redeemed_timestamp.getTime();
    const duration = parse(otac.max_duration);
    if (!duration) {
      return false;
    }
    if (redeemedTimestamp + duration > Date.now()) {
      return true;
    }

    return false;
  }

  private listDynamicScenarios(categories: string[]) {
    return this.courseService
      .listDynamicScenarios(categories)
      .pipe(retry({ count: 5, delay: 250 }), take(1));
  }
}
