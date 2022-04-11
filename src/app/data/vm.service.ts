import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of } from 'rxjs';
import { atou } from '../unicode';
import { ScheduledEvent } from './scheduledevent';




@Injectable({
    providedIn: 'root'
  })
  export class VmService {
  
    constructor(
      public http: HttpClient
    ) { }
  
    public list() {
      return this.http.get(environment.server + '/a/vm')
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)))
        })
      )
    }
    public listByScheduledEvent(id: String) {
        
        return this.http.get(environment.server + '/a/vm/' + id )
        .pipe(
          switchMap((s: ServerResponse) => {
            return of(JSON.parse(atou(s.content)))
          })
        )
      }

    public getVmById(id: number) {
        return this.http.get(environment.server + '/vm?' + id )
        .pipe(
          switchMap((s: ServerResponse) => {
            return of(JSON.parse(atou(s.content)))
          })
        )
    }
}