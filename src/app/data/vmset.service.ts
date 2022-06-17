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
  export class VmSetService {
  
    constructor(
      public http: HttpClient
    ) { }
  
    public list() {
      return this.http.get(environment.server + '/a/vmset')
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)))
        })
      )
    }
    public getVMSetByScheduledEvent(id: String) {        
        return this.http.get(environment.server + '/a/vmset/' + id )
        .pipe(
          switchMap((s: ServerResponse) => {
            return of(JSON.parse(atou(s.content)))
          })
        )
      }  
}