import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map } from 'rxjs/operators';
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
    return this.http.get(environment.server + "/course/list")
    .pipe(
      map((s: ServerResponse) => {
        let obj: Course[] = JSON.parse(atou(s.content)); // this doesn't encode a map though
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
          c.name = atou(c.name);
          c.description = atou(c.description);
        });
        return cList;
      })
    )
  }

}
