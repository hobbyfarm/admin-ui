import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Progress } from '../data/progress';
import { ServerResponse } from '../data/serverresponse';
//import { ProgressInfoComponent } from './progress-info/progress-info.component';

@Component({
  selector: 'progress-card',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})


export class ProgressComponent {
    @Input()
    public progress: Progress;

    //@ViewChild("progressInfo") progressInfo: ProgressInfoComponent;
    
  constructor(
    private http: HttpClient
  ) {
     
  }

  public terminateSession(){
    this.http.put(environment.server + "/session/" + this.progress.session + "/finished", {})
                .subscribe(
                    (s: ServerResponse) => {
                        this.progress.finished = true;
                    }
                )
  }

  openInfo() {
    //this.progressInfo.open();
  }

  public getProgress(){
    //If we are in the provisioning state or count of total steps is invalid
    if(this.progress.total_step == 0 || this.progress.current_step == 0){
        return 100;
    }
    return Math.floor((this.progress.current_step / this.progress.total_step ) * 100);
  }

  public getProgressColorClass(){
    if(this.progress.finished){
        return "status-finished"
    }
    if(this.progress.current_step == 0){
        return "status-provisioning";
    }
    if(this.progress.current_step == this.progress.total_step){
        return "status-success";
    }
    return "status-running";
  }

  public timeSince(date: Date, end: Date = new Date()) {

    var seconds: number = Math.floor((end.getTime() - date.getTime()) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " year(s)";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " month(s)";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " day(s)";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hour(s)";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minute(s)";
    }
    return Math.floor(seconds) + " second(s)";
  }
}
