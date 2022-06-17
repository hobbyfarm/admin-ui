import { Component, OnDestroy, OnInit} from '@angular/core';
import { ScheduledEvent } from '../data/scheduledevent';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScheduledeventService } from '../data/scheduledevent.service';
import { UserService } from '../data/user.service';
import { ProgressService } from 'src/app/data/progress.service';
import { ProgressCount } from 'src/app/data/progress';

interface DashboardScheduledEvent extends ScheduledEvent {
  creatorEmail?: String;
}


@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit, OnDestroy{
  public sessionDashboardActive: boolean = true;
  public vmDashboardActive: boolean = false;
  public selectedEvent: DashboardScheduledEvent;
  public loggedInAdminEmail: string;

  public scheduledEvents: DashboardScheduledEvent[] = [];
  public activeEvents: DashboardScheduledEvent[] = [];
  public finishedEvents: DashboardScheduledEvent[] = [];
  public updateInterval: any;

  constructor(    
    public scheduledeventService: ScheduledeventService,
    public helper: JwtHelperService,
    public userService: UserService,
    public progressService: ProgressService,
  ) { }

  ngOnInit() {
   this.scheduledeventService.list().subscribe(
      (s: DashboardScheduledEvent[]) => {          
        this.scheduledEvents = s;
        this.activeEvents = s.filter(se => !se.finished);
        this.finishedEvents = s.filter(se => se.finished);
        if(this.activeEvents.length > 0){
          this.selectedEvent = this.activeEvents[0];
          
        }          
        this.sortEventLists()
        this.updateInterval = setInterval(() => {
          this.setActiveSessionsCount() 
         } , 10 * 1000); 
        
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
}

setActiveSessionsCount(){
  this.progressService.count().subscribe((c: ProgressCount) => {
      this.scheduledEvents.forEach((se) => {
        se.activeSessions = c[se.id] || 0;
      });
    });
}

ngOnDestroy(): void {    
  clearInterval(this.updateInterval)
}

}
