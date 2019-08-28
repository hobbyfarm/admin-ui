import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap } from 'rxjs/operators';
import { Scenario } from './scenario';
import { from } from 'rxjs';
import { Step } from './step';
import { deepCopy } from '../deepcopy';

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
      }),
      map((sList: Scenario[]) => {
        sList.forEach((s: Scenario) => {
          s.name = atob(s.name);
          s.description = atob(s.description);
        });
        return sList;
      })
    )
  }

  public get(id: string) {
    return this.http.get("https://" + environment.server + "/a/scenario/" + id)
    .pipe(
      map((s: ServerResponse) => {
        return JSON.parse(atob(s.content))
      }),
      map((s: Scenario) => {
        // atob all the relevant fields
        s.name = atob(s.name);
        s.description = atob(s.description);
        s.steps.forEach((st: Step) => {
          st.content = atob(st.content);
          st.title = atob(st.title);
        });
        return s;
      })
    )
  }

  public update(iScenario: Scenario) {
    var s = <Scenario>deepCopy(iScenario);
    // step by step, re-encode to b64
    s.steps.forEach((st: Step) => {
      st.title = btoa(st.title);
      st.content = btoa(st.content);
    });
    
    var params = new HttpParams()
    .set("name", btoa(s.name))
    .set("description", btoa(s.description))
    .set("steps", JSON.stringify(s.steps))
    .set("virtualmachines", JSON.stringify(s.virtualmachines));

    return this.http.put("https://" + environment.server + "/a/scenario/" + s.id, params)
  }
}
