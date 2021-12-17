import { Component, OnInit } from '@angular/core';
import { ProgressService } from 'src/app/data/progress.service';
import { Progress, ProgressCount } from 'src/app/data/progress';
import { UserService } from '../data/user.service';
import { ScheduledEvent } from '../data/scheduledevent';
import { ScheduledeventService } from '../data/scheduledevent.service';
import { User } from '../data/user';
import { ScenarioService } from '../data/scenario.service';
import { Scenario } from '../data/scenario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public includeFinished: boolean = false;
  public selectedEvent: string = "";
  public currentProgress: Progress[] = [];
  public filteredProgress: Progress[] = [];

  public callDelay: number = 10
  public pauseCall: boolean = false; // Stop refreshing if we are looking at a progress
  public pause = (pause: boolean) => {
    this.pauseCall = pause;
    if(!pause){
      this.refresh(); //refresh if unpaused
    }
  }

  public scheduledEvents: ScheduledEvent[] = [];

  public userFilter: string = "";
  public scenarioList: Set<string> = new Set<string>();
  public scenarioFilterList: Set<string> = new Set<string>();
  
  constructor(
    public userService: UserService,
    public scenarioService: ScenarioService,
    public progressService: ProgressService,
    public scheduledeventService: ScheduledeventService,
  ) { }


  ngOnInit() {
    setInterval(() => {
      this.refresh();
     } , this.callDelay * 1000);

     this.scheduledeventService.list().subscribe(
        (s: ScheduledEvent[]) => {
          this.scheduledEvents = s;
          if(s.length > 0){
            this.selectedEvent = s[0].id;
            this.refresh();
          }
        }
     )
     console.log("init");
  }

  setScheduledEvent(id: string){
    this.selectedEvent = id;
    this.scenarioFilterList.clear()
    this.refresh();
  }

  filter() {
    if (this.userFilter != "") {
      this.filteredProgress = this.currentProgress.filter(prog => prog.username.match(this.userFilter))
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

  refresh() {
    if(this.pauseCall){
      return;
    }
    if(this.selectedEvent == ""){
      return
    }
    this.progressService.list(this.selectedEvent, this.includeFinished).subscribe(
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
          this.currentProgress.forEach(element => {
            element.username = "none"
            element.scenario_name = "none"            
            this.userService.getUsers().subscribe(
              (users: User[]) => {
                  users.forEach(user => {
                      if(user.id == element.user){
                          element.username = user.email
                      }
                  });
              }
            )
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
          });
          this.filter()
        }
      );   

      this.progressService.count().subscribe(
        (c: ProgressCount) => {
          this.scheduledEvents.forEach(se => {
            if(c[se.id]){
              se.activeSessions = c[se.id];
            }
          })
        }
      )
  }
}
