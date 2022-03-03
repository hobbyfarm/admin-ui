import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgressService } from 'src/app/data/progress.service';
import { Progress, ProgressCount } from 'src/app/data/progress';
import { UserService } from '../data/user.service';
import { ScheduledEvent } from '../data/scheduledevent';
import { ScheduledeventService } from '../data/scheduledevent.service';
import { User } from '../data/user';
import { ScenarioService } from '../data/scenario.service';
import { Scenario } from '../data/scenario';
import { Course } from '../data/course';
import { CourseService } from '../data/course.service';
import { EventUserListComponent } from './event-user-list/event-user-list.component';
import { JwtHelperService } from '@auth0/angular-jwt';

interface DashboardScheduledEvent extends ScheduledEvent {
  creatorEmail?: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public includeFinished: boolean = false;
  public selectedEvent: DashboardScheduledEvent;
  public currentProgress: Progress[] = [];
  public filteredProgress: Progress[] = [];
  public callInterval: any;
  public circleVisible: boolean = true; 
  public loggedInAdminEmail: string;
  public users: User[];
 

  public pauseCall: boolean = false; // Stop refreshing if we are looking at a progress
  public pause = (pause: boolean) => {
    this.pauseCall = pause;
    if(!pause){
      this.refresh(); //refresh if unpaused
    }
  }

  public scheduledEvents: DashboardScheduledEvent[] = [];
  public activeEvents: DashboardScheduledEvent[] = [];
  public finishedEvents: DashboardScheduledEvent[] = [];

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
      //Fill cache
      this.courseService.list().subscribe();
      this.userService.getUsers().subscribe();
      this.scenarioService.list().subscribe();

     this.scheduledeventService.list().subscribe(
        (s: DashboardScheduledEvent[]) => {          
          this.scheduledEvents = s;
          this.activeEvents = s.filter(se => !se.finished);
          this.finishedEvents = s.filter(se => se.finished);
          if(this.activeEvents.length > 0){
            this.selectedEvent = this.activeEvents[0];
            this.refresh();
          }          
          this.sortEventLists() 
        }
     )
  }

  async sortEventLists() { 
    this.loggedInAdminEmail = this.helper.decodeToken(this.helper.tokenGetter()).email;   
    let users = await this.userService.getUsers().toPromise()      
    this.scheduledEvents.forEach((sEvent) => {
      sEvent.creatorEmail = users.find(user => user.id == sEvent.creator)?.email 
    })    
      this.sortByLoggedInAdminUser(this.scheduledEvents)
      this.sortByLoggedInAdminUser(this.activeEvents)
      this.sortByLoggedInAdminUser(this.finishedEvents)       
  }

  sortByLoggedInAdminUser(eventArray: DashboardScheduledEvent[]) {    
    const isCreatedByMe = (e: DashboardScheduledEvent) => Number(e.creatorEmail === this.loggedInAdminEmail);
    return eventArray.sort((a, b) => isCreatedByMe(b) - isCreatedByMe(a));
  }

  setScheduledEvent(ev: DashboardScheduledEvent){
    this.selectedEvent = ev;
    this.scenarioFilterList.clear()
    this.refresh();
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
    this.progressService.list(this.selectedEvent.id, this.selectedEvent?.finished ? true : this.includeFinished).subscribe(
      (p: Progress[]) =>
        {
          p.sort(function(a, b) {
            var keyA = a.started,
              keyB = b.started;
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          this.currentProgress = p;
          this.scenarioList.clear();

          this.userService.getUsers().subscribe((users: User[]) => {
            this.users = users.filter(user => user.access_codes.includes(this.selectedEvent.access_code))
          })      
          

          this.currentProgress.forEach(element => {            
            element.username = this.users.find(u => u.id === element.user)?.email || "none"
            element.scenario_name = "none"
            this.scenarioService.list().subscribe(
              (scenarios: Scenario[]) => {
                  scenarios.forEach(s => {
                      if(s.id == element.scenario){
                          element.scenario_name = s.name
                          this.scenarioList.add(s.name)
                      }
                  });
              }
            )
            if(element.course && element.course != ""){
              this.courseService.list().subscribe(
                (courses: Course[]) => {
                    courses.forEach(c => {
                        if(c.id == element.course){
                            element.course_name = c.name
                        }
                    });
                }
              )
            }
          });
          this.filter()
        }
      );   

      this.progressService.count().subscribe(
        (c: ProgressCount) => {
          this.scheduledEvents.forEach(se => {
            if(c[se.id]){
              se.activeSessions = c[se.id];
            }else{
              se.activeSessions = 0;
            }
          })
        }
      )
  }
}
