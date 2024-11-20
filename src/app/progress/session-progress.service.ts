import { Injectable } from '@angular/core';
import { Progress } from '../data/progress';
import { environment } from 'src/environments/environment';
import { ServerResponse } from '../data/serverresponse';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionProgressService {
  constructor(
    private http: HttpClient, 
    private router: Router, 
  ) {}

  public getProgressColorClass(progress: Progress): string {
    if (progress.finished) {
      return 'status-finished';
    }
    if (progress.current_step === 0) {
      return 'status-provisioning';
    }
    if (progress.current_step === progress.total_step) {
      return 'status-success';
    }
    return 'status-running';
  }

  public getProgress(p: Progress) {
    //If we are in the provisioning state or count of total steps is invalid
    if (p.total_step == 0 || p.current_step == 0) {
      return 100;
    }
    //if finished display the total step reached percentage
    if (p.finished) {
      return Math.floor(
        (p.max_step / p.total_step) * 100
      );
    }

    //if currently running display the current step percentage
    return Math.floor(
      (p.current_step / p.total_step) * 100
    );
  }

  public terminateSession(p: Progress) {
    this.http
      .put(
        environment.server + '/session/' + p.session + '/finished',
        {}
      )
      .subscribe((_s: ServerResponse) => {
        p.finished = true;
      });
  }

  openTerminalWindow(p: Progress) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/session',
        p.session,
        'steps',
        Math.max(p.current_step - 1, 0),
      ])
    );
    window.open(url, '_blank');
  }
}