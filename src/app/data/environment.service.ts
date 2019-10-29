import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { formatDate } from '@angular/common';
import { EnvironmentAvailability } from './environmentavailability';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get("https://" + environment.server + "/a/environment/list")
    .pipe(
      map((s: ServerResponse) => JSON.parse(atob(s.content)))
    )
  }

  public available(env: string, start: Date, end: Date) {
    var startString = formatDate(start, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC");
    var endString = formatDate(end, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC");

    let params = new HttpParams()
    .set("start", startString)
    .set("end", endString);

    return this.http.post("https://" + environment.server + "/a/environment/" + env + "/available", params)
    .pipe(
      map((s: ServerResponse) => JSON.parse(atob(s.content))),
      map((ea: EnvironmentAvailability) => {
        ea.environment = env;
        return ea;
      })
    )
  }
}
