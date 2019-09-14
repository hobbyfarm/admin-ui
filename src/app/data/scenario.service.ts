import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map } from 'rxjs/operators';
import { Scenario } from './scenario';
import { Step } from './step';
import { deepCopy } from '../deepcopy';

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

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
        let obj: Scenario[] = JSON.parse(atob(s.content)); // this doesn't encode a map though
        // so now we need to go vmset-by-vmset and build maps
        obj.forEach((s: Scenario) => {
          s.virtualmachines.forEach((v: Object) => {
            v = new Map(Object.entries(v))
          })
        });
        return obj;
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
    
    var params = new HttpParams({encoder: new CustomEncoder()})
    .set("name", btoa(s.name))
    .set("description", btoa(s.description))
    .set("steps", JSON.stringify(s.steps))
    .set("virtualmachines", JSON.stringify(s.virtualmachines));

    return this.http.put("https://" + environment.server + "/a/scenario/" + s.id, params)
  }

  public create(s: Scenario) {
    var params = new HttpParams()
    .set("name", btoa(s.name))
    .set("description", btoa(s.description));

    return this.http.post("https://" + environment.server + "/a/scenario/new", params)
  }
}
