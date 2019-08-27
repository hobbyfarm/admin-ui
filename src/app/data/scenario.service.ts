import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap } from 'rxjs/operators';
import { Scenario } from './scenario';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get("https://" + environment.server + "/a/scenario/list")
    .pipe(
      map((s: ServerResponse) => {
        return JSON.parse(atob(s.content));
      })
    )
  }

  public get(id: string) {
    return this.http.get("https://" + environment.server + "/a/scenario/" + id)
    .pipe(
      map((s: ServerResponse) => {
        return JSON.parse(atob(s.content))
      })
    )
  }

  public update(s: Scenario) {
    var params = new HttpParams()
    .set("name", s.name)
    .set("description", s.description)
    .set("steps", JSON.stringify(s.steps))
    .set("virtualmachines", JSON.stringify(s.virtualmachines));

    return this.http.put("https://" + environment.server + "/a/scenario/" + s.id, params)
  }
}
