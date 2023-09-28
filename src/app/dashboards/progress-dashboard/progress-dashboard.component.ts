import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { ProgressService } from 'src/app/data/progress.service';
import { Progress, ProgressCount } from 'src/app/data/progress';
import { UserService } from '../../data/user.service';
import { ScheduledEvent } from '../../data/scheduledevent';
import { ScheduledeventService } from '../../data/scheduledevent.service';
import { ScenarioService } from '../../data/scenario.service';
import { CourseService } from '../../data/course.service';
import { EventUserListComponent } from './event-user-list/event-user-list.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { combineLatest } from 'rxjs';
import { User } from '../../data/user';


@Component({
  selector: 'progress-dashboard',
  templateUrl: './progress-dashboard.component.html',
  styleUrls: ['./progress-dashboard.component.scss']
})
export class ProgressDashboardComponent implements OnInit {

  @Input()
  selectedEvent: ScheduledEvent;

  public includeFinished: boolean = false;  
  public currentProgress: Progress[] = [];
  public filteredProgress: Progress[] = [];
  public callInterval: any;
  public circleVisible: boolean = true;  
  public users: User[];
 

  public pauseCall: boolean = false; // Stop refreshing if we are looking at a progress
  public pause = (pause: boolean) => {
    this.pauseCall = pause;
    if(!pause){
      this.refresh(); //refresh if unpaused
    }
  }
  
  public userFilter: string = "";
  public scenarioList: Set<string> = new Set<string>();
  public scenarioFilterList: Set<string> = new Set<string>();

  @ViewChild("userList") userList: EventUserListComponent;
  
  constructor(
    public userService: UserService,
    public scenarioService: ScenarioService,
    public courseService: CourseService,
    public progressService: ProgressService,
    public scheduledeventService: ScheduledeventService,
    public helper: JwtHelperService,
  ) { }


  ngOnInit() {
    this.refresh()      
  }

  ngOnChanges() {
    this.refresh()
  }


  filter() {
    if (this.userFilter != "") {
      try {
        const pattern = new RegExp(this.userFilter, 'i');
        this.filteredProgress = this.currentProgress.filter(prog =>  pattern.test(prog.username)) 
        
      }
      catch (err) {
        if (!(err instanceof SyntaxError)) {
          console.log(err)
        }
      }
    } else {
      this.filteredProgress = this.currentProgress;
    }
    if (this.scenarioFilterList.size > 0) {
      this.filteredProgress = this.filteredProgress.filter(prog => this.scenarioFilterList.has(prog.scenario_name))
    } 
  }

  filterScenario(scenario) {
    this.scenarioFilterList.has(scenario) ? this.scenarioFilterList.delete(scenario) : this.scenarioFilterList.add(scenario);
    this.filter()    
  }

  removeFilter() {
    this.scenarioFilterList.clear()
    this.userFilter = "";
    this.filter()
  }

  filterName(name) {
    this.userFilter = name;
    this.filter()
  }

  openUserList() {    
    this.userList.openModal();
  }

  refresh() {
    if(this.pauseCall){
      return;
    }
    if(!this.selectedEvent){
      return
    }

    const includeFinished = this.selectedEvent.finished || this.includeFinished;

    combineLatest([
      this.progressService.listByScheduledEvent(this.selectedEvent.id, true),
      this.userService.list(),
      this.scenarioService.list(),
      this.courseService.list(),
    ]).subscribe(([progressList, users, scenarios, courses]) => {

      const usersWithProgress: String[] = progressList.map(prog => prog.user)
      
      if (!includeFinished) {
        progressList = progressList.filter(prog => !prog.finished)
      }
      
      // sort progress by start date, latest first
      progressList.sort((a, b) => Number(b.started) - Number(a.started));
      

      const userMap = new Map(users.map(u => [u.id, u.email]));
      const courseMap = new Map(courses.map(c => [c.id, c.name]));
      const scenarioMap = new Map(scenarios.map(s => [s.id, s.name]));
      
      this.currentProgress = progressList.map((element) => ({
        ...element,
        username: userMap.get(element.user) ?? "none",
        scenario_name: scenarioMap.get(element.scenario) ?? "none",
        course_name: courseMap.get(element.course) ?? '',
      }));
      this.users = users.filter(
        user => user.access_codes?.includes(this.selectedEvent.access_code) || usersWithProgress.includes(user.id)
        ) ;     
      
      this.scenarioList = new Set(this.currentProgress.map(p => p.scenario_name));

      this.filter()
    });
  }

}
