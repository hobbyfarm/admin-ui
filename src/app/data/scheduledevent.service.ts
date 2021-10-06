import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ScheduledEvent } from './scheduledevent';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap, combineAll, tap } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';
import { formatDate } from '@angular/common';
import { atou } from '../unicode';

@Injectable({
  providedIn: 'root'
})
export class ScheduledeventService {

  private cachedSEList: ScheduledEvent[] = []
  private bh: BehaviorSubject<ScheduledEvent[]> = new BehaviorSubject(this.cachedSEList);
  private fetchedList = false;

  constructor(
    public http: HttpClient
  ) { }

  public watch() {
    return this.bh.asObservable();
  }

  public list(force=false) {
    if (!force && this.fetchedList)  {
      return of(this.cachedSEList);
  } else {
      return this.http.get(environment.server + "/a/scheduledevent/list")
        .pipe(
          switchMap((s: ServerResponse) => {
            return from(JSON.parse(atou(s.content)))
          }),
          map((se: ScheduledEvent) => {
            se.start_time = new Date(se.start_time);
            se.end_time = new Date(se.end_time);
            return of(se);
          }),
          combineAll(),
          tap((ses: ScheduledEvent[]) => {
              this.set(ses);
            }
          ),
        )
    }
  }

  public set(list: ScheduledEvent[]){
    this.cachedSEList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }

  public create(se: ScheduledEvent) {
    var params = new HttpParams()
      .set("name", se.event_name)
      .set("description", se.description)
      .set("start_time", formatDate(se.start_time, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC"))
      .set("end_time", formatDate(se.end_time, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC"))
      .set("required_vms", JSON.stringify(se.required_vms))
      .set("access_code", se.access_code.toLowerCase()) // this needs to be lower case because of RFC-1123
      .set("disable_restriction", JSON.stringify(se.disable_restriction))
      .set("on_demand", JSON.stringify(se.on_demand));

      if (se.scenarios != null) {
         params = params.set("scenarios", JSON.stringify(se.scenarios))
      }
      if (se.courses != null) {
         params = params.set("courses", JSON.stringify(se.courses))
      }

    return this.http.post(environment.server + "/a/scheduledevent/new", params)
      .pipe(
        switchMap((s: ServerResponse) => {
          return from(JSON.parse(atou(s.message)))
        })
      )
  }

  public update(se: ScheduledEvent) {
    var params = new HttpParams()
      .set("name", se.event_name)
      .set("description", se.description)
      .set("start_time", formatDate(se.start_time, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC"))
      .set("end_time", formatDate(se.end_time, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC"))
      .set("required_vms", JSON.stringify(se.required_vms))
      .set("access_code", se.access_code);

      if (se.scenarios != null) {
         params = params.set("scenarios", JSON.stringify(se.scenarios))
      }
      if (se.courses != null) {
         params = params.set("courses", JSON.stringify(se.courses))
      }

    return this.http.put(environment.server + "/a/scheduledevent/" + se.id, params)
      .pipe(
        switchMap((s: ServerResponse) => {
          return from(JSON.parse(atou(s.message)))
        })
      )
  }

  public delete(se: ScheduledEvent) {
    return this.http.delete(environment.server + "/a/scheduledevent/delete/" + se.id)
      .pipe(
        switchMap((s: ServerResponse) => {
          return from(s.message)
        })
      )
  }

  public get(id: string) {
    return this.http.get(environment.server + "/a/scheduledevent/" + id)
    .pipe(
      switchMap((s: ServerResponse) => {
        let se = JSON.parse(atou(s.content));
        se.start_time = new Date(se.start_time);
        se.end_time = new Date(se.end_time);
        return of(se);
      })
    )
  }
}
