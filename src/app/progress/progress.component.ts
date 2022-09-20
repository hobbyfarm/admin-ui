import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Progress } from '../data/progress';
import { ServerResponse } from '../data/serverresponse';
import { ProgressInfoComponent } from './progress-info/progress-info.component';
import { timeSince } from '../utils';
import { Router } from '@angular/router';

@Component({
  selector: 'progress-card',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})


export class ProgressComponent {
    @Input()
    public progress: Progress;

    @Input()
    public pause: Function;

    @Output() nameClickedEvent = new EventEmitter<string>();   

    public timeSince= timeSince;

    @ViewChild("progressInfo") progressInfo: ProgressInfoComponent;

    
  constructor(
    private http: HttpClient,
    private router: Router
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
    this.progressInfo.openModal();
  }

  openTerminalWindow() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/session', this.progress.session, 'steps', Math.max(this.progress.current_step - 1, 0),])
    );
    window.open(url, '_blank');
  }
  
  public progressFilterName() {
    this.nameClickedEvent.emit(this.progress.username)
  }

  public getProgress(){
    //If we are in the provisioning state or count of total steps is invalid
    if(this.progress.total_step == 0 || this.progress.current_step == 0){
        return 100;
    }
    //if finished display the total step reached percentage
    if(this.progress.finished){
      return Math.floor((this.progress.max_step / this.progress.total_step ) * 100);
    }

    //if currently running display the current step percentage
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
}
