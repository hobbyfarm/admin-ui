import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of } from 'rxjs';
import { atou } from '../unicode';





@Injectable({
    providedIn: 'root'
  })
  export class VmService {
  
    constructor(
      public http: HttpClient
    ) { }
  
    public list() {
      return this.http.get(environment.server + '/a/vm/list')
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)))
        })
      )
    }
    public listByScheduledEvent(id: String) {
        
        return this.http.get(environment.server + '/a/vm/scheduledevent/' + id )
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

    public count() {
      return this.http.get(environment.server + "/a/vm/count")
      .pipe(
        switchMap((s : ServerResponse) => {
          return of(JSON.parse(atou(s.content)))
        })
      )
    }
}