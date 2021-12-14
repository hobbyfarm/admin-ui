import { Component, OnInit } from '@angular/core';
import { ProgressService } from 'src/app/data/progress.service';
import { Progress } from 'src/app/data/progress';
import { UserService } from '../data/user.service';
import { ScheduledEvent } from '../data/scheduledevent';
import { ScheduledeventService } from '../data/scheduledevent.service';

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

  public scheduledEvents: ScheduledEvent[] = [];
  
  constructor(
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
  }

  setScheduledEvent(id: string){
    this.selectedEvent = id;
    this.refresh();
  }

  refresh() {
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
          this.filteredProgress = p;
          console.log(p);
        }
      );   
  }
}
