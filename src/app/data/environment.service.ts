import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { formatDate } from '@angular/common';
import { EnvironmentAvailability } from './environmentavailability';
import { Environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get(environment.server + "/a/environment/list")
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

    return this.http.post(environment.server + "/a/environment/" + env + "/available", params)
    .pipe(
      map((s: ServerResponse) => JSON.parse(atob(s.content))),
      map((ea: EnvironmentAvailability) => {
        ea.environment = env;
        return ea;
      })
    )
  }

  public add(env: Environment) {
    let params = new HttpParams()
    .set("display_name", env.display_name)
    .set("dnssuffix", env.dnssuffix)
    .set("provider", env.provider)
    .set("template_mapping", JSON.stringify(env.template_mapping))
    .set("environment_specifics", JSON.stringify(env.environment_specifics))
    .set("ip_translation_map", JSON.stringify(env.ip_translation_map))
    .set("ws_endpoint", env.ws_endpoint)
    .set("capacity_mode", env.capacity_mode)
    .set("burst_capable", JSON.stringify(env.burst_capable));

    return this.http.post(environment.server + "/a/environment/create", params)
  }

  public update(env: Environment) {
    let params = new HttpParams()
    .set("display_name", env.display_name)
    .set("dnssuffix", env.dnssuffix)
    .set("provider", env.provider)
    .set("template_mapping", JSON.stringify(env.template_mapping))
    .set("environment_specifics", JSON.stringify(env.environment_specifics))
    .set("ip_translation_map", JSON.stringify(env.ip_translation_map))
    .set("ws_endpoint", env.ws_endpoint)
    .set("capacity_mode", env.capacity_mode)
    .set("burst_capable", JSON.stringify(env.burst_capable));

    return this.http.put(environment.server + "/a/environment/" + env.name + "/update", params);
  }
}
