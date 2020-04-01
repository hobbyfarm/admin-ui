import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, switchMap } from 'rxjs/operators';
import { Course } from './course';
import { Scenario } from './scenario';
import { ScenarioService } from './scenario.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(
    public http: HttpClient,
    public scenarioService: ScenarioService
  ) { }

  public list() {
    return this.http.get(environment.server + "/course/list")
    .pipe(
      map((s: ServerResponse) => {
        let obj: Course[] = JSON.parse(atob(s.content)); // this doesn't encode a map though
        // so now we need to go vmset-by-vmset and build maps
        obj.forEach((c: Course) => {
          c.virtualmachines.forEach((v: Object) => {
            v = new Map(Object.entries(v))
          })
          c.scenarios.forEach((s) => {
            this.scenarioService.get(<any>s).subscribe((sc: Scenario) => { c.scenarios.push(sc) })
          });
          c.scenarios = c.scenarios.filter(x => typeof x != 'string');
          c.scenarios.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
        });
        return obj;
      }),
      map((cList: Course[]) => {
        cList.forEach((c: Course) => {
          c.name = atob(c.name);
          c.description = atob(c.description);
        });
        return cList;
      })
    )
  }

  public create(c: Course) {
    var params = new HttpParams()
    .set("name", c.name)
    .set("description", c.description)
    .set("virtualmachines", JSON.stringify(c.virtualmachines))
    .set("scenarios", JSON.stringify(c.scenarios.map((s: Scenario) => s.id)))
    .set("keepalive_duration", c.keepalive_duration)
    .set("pauseable", JSON.stringify(c.pause_duration))

    return this.http.post(environment.server + "/a/course/new", params)
    .pipe(
      switchMap((s: ServerResponse) => {
        return from(JSON.parse(atob(s.message)))
      })
    )
  }

}
