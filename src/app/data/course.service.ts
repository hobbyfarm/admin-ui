import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Course } from './course';
import { Scenario } from './scenario';
import { ScenarioService } from './scenario.service';
import { atou } from '../unicode';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(
    public http: HttpClient,
    public scenarioService: ScenarioService
  ) { }

  public list() {
    return this.http.get(environment.server + "/a/course/list")
    .pipe(
      map((s: ServerResponse) => {
        let obj: Course[] = JSON.parse(atou(s.content)); // this doesn't encode a map though
        // so now we need to go vmset-by-vmset and build maps
        if (obj == null) { return []; }
        obj.forEach((c: Course) => {
          c.virtualmachines.forEach((v: Object) => {
            v = new Map(Object.entries(v))
          })
          c.scenarios.forEach((s) => {
            this.scenarioService.get(<any>s).subscribe((sc: Scenario) => { c.scenarios.push(sc) })
          });
          c.categories = c.categories ?? [];
          c.scenarios = c.scenarios.filter(x => typeof x != 'string');
          c.scenarios.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
        });
        return obj;
      }),
      map((cList: Course[]) => {
        cList.forEach((c: Course) => {
          c.name = atou(c.name);
          c.description = atou(c.description);
        });
        return cList;
      })
    )
  }

  public create(c: Course) {
    var params = new HttpParams()
    .set("name", btoa(c.name))
    .set("description", btoa(c.description))
    .set("keepalive_duration", c.keepalive_duration)
    .set("pause_duration", JSON.stringify(c.pause_duration))
    .set("pauseable", JSON.stringify(c.pauseable))
    .set("keep_vm", JSON.stringify(c.keep_vm))
    
    return this.http.post(environment.server + "/a/course/new", params)
  }

  public update(c: Course) {
    var scenarioArray: string[] = [];
    c.scenarios.forEach((s: Scenario) => {
      scenarioArray.push(s.id);
    });
    var params = new HttpParams()
    .set("name", btoa(c.name))
    .set("description", btoa(c.description))
    .set("keepalive_duration", c.keepalive_duration)
    .set("pause_duration", JSON.stringify(c.pause_duration))
    .set("pauseable", JSON.stringify(c.pauseable))
    .set("virtualmachines", JSON.stringify(c.virtualmachines))
    .set("scenarios", JSON.stringify(scenarioArray))
    .set("keep_vm", JSON.stringify(c.keep_vm))
    .set("categories", JSON.stringify(c.categories));

    return this.http.put(environment.server + "/a/course/" + c.id, params)
  }

  public delete(c: Course) {
    return this.http.delete(environment.server + "/a/course/" + c.id)
  }

}
