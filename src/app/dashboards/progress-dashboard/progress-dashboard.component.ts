import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { ProgressService } from 'src/app/data/progress.service';
import { Progress } from 'src/app/data/progress';
import { UserService } from '../../data/user.service';
import { ScheduledEventBase } from '../../data/scheduledevent';
import { ScheduledeventService } from '../../data/scheduledevent.service';
import { ScenarioService } from '../../data/scenario.service';
import { CourseService } from '../../data/course.service';
import { EventUserListComponent } from './event-user-list/event-user-list.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { combineLatest, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { User } from '../../data/user';
import { Settings, SettingsService } from 'src/app/data/settings.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'progress-dashboard',
  templateUrl: './progress-dashboard.component.html',
  styleUrls: ['./progress-dashboard.component.scss'],
})
export class ProgressDashboardComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input()
  selectedEvent: ScheduledEventBase;

  public includeFinished: boolean = false;
  public currentProgress: Progress[] = [];
  public filteredProgress: Progress[] = [];
  public callInterval: any;
  public circleVisible: boolean = true;
  public users: User[] = [];
  public settingsForm: FormGroup;
  public hide_usernames_status: boolean = false;
  public progressViewModeControl = new FormControl<'cardView' | 'listView'>(
    'cardView',
  );
  private settings_service$ = new Subject<Readonly<Settings>>();

  public pauseCall: boolean = false; // Stop refreshing if we are looking at a progress
  public pause = (pause: boolean) => {
    this.pauseCall = pause;
    if (!pause) {
      this.refresh(); //refresh if unpaused
    }
  };

  public userFilter: string = '';
  public scenarioList: Set<string> = new Set<string>();
  public scenarioFilterList: Set<string> = new Set<string>();

  @ViewChild('userList') userList: EventUserListComponent;

  constructor(
    public userService: UserService,
    public scenarioService: ScenarioService,
    public courseService: CourseService,
    public progressService: ProgressService,
    public scheduledeventService: ScheduledeventService,
    public helper: JwtHelperService,
    public settingsService: SettingsService,
  ) {}

  ngOnInit() {
    this.settingsForm = this.settingsService.getForm();
    this.settingsService.settings$
      .pipe(takeUntil(this.settings_service$))
      .subscribe(
        ({
          hide_usernames_status = false,
          progress_view_mode = 'cardView',
        }) => {
          this.settingsForm.patchValue({
            hide_usernames_status,
            progress_view_mode,
          });
          this.hide_usernames_status = this.settingsForm.get(
            'hide_usernames_status',
          )?.value;
          this.progressViewModeControl.setValue(
            this.settingsForm.get('progress_view_mode')?.value,
          );
        },
      );
    this.progressViewModeControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === 'cardView') {
          this.setCardView();
        } else if (value === 'listView') {
          this.setListView();
        }
      });
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  ngOnDestroy() {
    this.settings_service$.unsubscribe();
  }

  filter() {
    if (this.userFilter != '') {
      try {
        const pattern = new RegExp(this.userFilter, 'i');
        this.filteredProgress = this.currentProgress.filter((prog) =>
          pattern.test(prog.username),
        );
      } catch (err) {
        if (!(err instanceof SyntaxError)) {
          console.log(err);
        }
      }
    } else {
      this.filteredProgress = this.currentProgress;
    }
    if (this.scenarioFilterList.size > 0) {
      this.filteredProgress = this.filteredProgress.filter((prog) =>
        this.scenarioFilterList.has(prog.scenario_name),
      );
    }
  }

  filterScenario(scenario) {
    this.scenarioFilterList.has(scenario)
      ? this.scenarioFilterList.delete(scenario)
      : this.scenarioFilterList.add(scenario);
    this.filter();
  }

  removeFilter() {
    this.scenarioFilterList.clear();
    this.userFilter = '';
    this.filter();
  }

  filterName(name) {
    this.userFilter = name;
    this.filter();
  }

  setCardView() {
    //this.progressViewModeService.setCardView();
    this.saveSettings({ progress_view_mode: 'cardView' });
  }

  setListView() {
    //this.progressViewModeService.setListView();
    this.saveSettings({ progress_view_mode: 'listView' });
  }

  openUserList() {
    this.userList.openModal();
  }

  refresh() {
    if (this.pauseCall) {
      return;
    }

    const includeFinished = this.selectedEvent.finished || this.includeFinished;

    combineLatest([
      this.progressService.listByScheduledEvent(this.selectedEvent.id, true),
      this.userService.list(),
      this.scenarioService.list(),
      this.courseService.list(),
    ]).subscribe(([progressList, users, scenarios, courses]) => {
      const usersWithProgress: String[] = progressList.map((prog) => prog.user);

      if (!includeFinished) {
        progressList = progressList.filter((prog) => !prog.finished);
      }

      // sort progress by start date, latest first
      progressList.sort((a, b) => Number(b.started) - Number(a.started));

      const userMap = new Map(users.map((u) => [u.id, u.email]));
      const courseMap = new Map(courses.map((c) => [c.id, c.name]));
      const scenarioMap = new Map(scenarios.map((s) => [s.id, s.name]));

      this.currentProgress = progressList.map((element) => ({
        ...element,
        username: userMap.get(element.user) ?? element.user,
        scenario_name: scenarioMap.get(element.scenario) ?? element.scenario,
        course_name: courseMap.get(element.course) ?? element.course,
      }));
      this.users = users.filter(
        (user) =>
          user.access_codes?.includes(this.selectedEvent.access_code) ||
          usersWithProgress.includes(user.id),
      );

      this.scenarioList = new Set(
        this.currentProgress.map((p) => p.scenario_name),
      );

      this.filter();
    });
  }

  saveSettings(update: Partial<Settings>) {
    if (this.settingsForm.value) {
      this.settingsService.update(update).subscribe({
        next: () => {},
        error: (err) => {
          console.error('Error while saving settings:', err);
        },
      });
    }
  }

  exportCSV() {
    let progressCSV = '';
    this.filteredProgress.forEach((progress) => {
      progressCSV = progressCSV.concat(
        progress.id +
          ', ' +
          progress.user +
          ', ' +
          progress.username +
          ', ' +
          progress.scenario +
          ', ' +
          progress.scenario_name +
          ', ' +
          progress.course +
          ', ' +
          progress.course_name +
          ', ' +
          progress.total_step +
          ', ' +
          progress.max_step +
          ', ' +
          progress.started +
          ', ' +
          progress.last_update +
          '\n',
      );
    });
    const filename = this.selectedEvent.event_name + '_sessions.csv';
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(progressCSV),
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
