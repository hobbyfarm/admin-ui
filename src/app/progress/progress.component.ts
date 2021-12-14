import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Progress } from '../data/progress';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ServerResponse } from '../data/serverresponse';
import { User } from '../data/user';
import { UserService } from '../data/user.service';
//import { ProgressInfoComponent } from './progress-info/progress-info.component';

@Component({
  selector: 'progress-card',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})


export class ProgressComponent implements OnInit {
    @Input()
    public progress: Progress;
    public username: string = "none";
    public scenario: string = "none";

    //@ViewChild("progressInfo") progressInfo: ProgressInfoComponent;
    
  constructor(
    public userService: UserService,
    public scenarioService: ScenarioService,
    private http: HttpClient
  ) {
     
  }

  ngOnInit() {
    this.getUsername();
    this.getScenarioName();
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

  public getUsername(){
      this.username = this.progress.user; //fallback to saved user id if user is unkown.
      this.userService.getUsers().subscribe(
          (users: User[]) => {
              users.forEach(user => {
                  if(user.id == this.progress.user){
                      this.username = user.email
                  }
              });
          }
      )
  }

  public getScenarioName(){
    this.scenario = this.progress.scenario; //fallback to saved scenario id if scenario is unkown.
    this.scenarioService.list().subscribe(
        (scenarios: Scenario[]) => {
            scenarios.forEach(s => {
                if(s.id == this.progress.scenario){
                    this.scenario = s.name
                }
            });
        }
    )
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
