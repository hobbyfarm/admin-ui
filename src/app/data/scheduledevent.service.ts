import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ScheduledEvent } from './scheduledevent';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap, concatAll, combineAll } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScheduledeventService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get("https://" + environment.server + "/a/scheduledevent/list")
    .pipe(
      switchMap((s: ServerResponse) => {
        return from(JSON.parse(atob(s.content)))
      }),
      map((se: ScheduledEvent) => {
        se.start_time = new Date(se.start_time);
        se.end_time = new Date(se.end_time);
        return of(se);
      }),
      combineAll()
    )
  }

  private strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      if (typeof v == "object") {
        obj[k] = this.strMapToObj(v);
      } else {
        obj[k] = v;
      }
    }
    return obj;
  }

  public create(se: ScheduledEvent) {
    var params = new HttpParams()
    .set("name", se.event_name)
    .set("description", se.description)
    .set("start_time", formatDate(se.start_time, "E LLL dd hh:mm:ss UTC yyyy", "en-US", "UTC"))
    .set("end_time", formatDate(se.end_time, "E LLL dd hh:mm:ss UTC yyyy", "en-US", "UTC"))
    .set("required_vms", JSON.stringify(this.strMapToObj(se.required_vms)))
    .set("access_code", se.access_code)
    .set("scenarios", JSON.stringify(se.scenarios));


    return this.http.post("https://" + environment.server + "/a/scheduledevent/new", params)
    .pipe(
      switchMap((s: ServerResponse) => {
        return from(JSON.parse(atob(s.message)))
      })
    )
  }
}
