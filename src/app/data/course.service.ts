import { Injectable } from '@angular/core';
import {
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { ServerResponse } from './serverresponse';
import { map, catchError, tap } from 'rxjs/operators';
import { Course, CourseApi } from './course';
import { Scenario } from './scenario';
import { ScenarioService } from './scenario.service';
import { atou, utoa } from '../unicode';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { RbacService } from './rbac.service';
import { GargantuaClientFactory } from './gargantua.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private cachedCourseList: Course[] = [];
  private fetchedList = false;
  private bh: BehaviorSubject<Course[]> = new BehaviorSubject(
    this.cachedCourseList,
  );
  private gargAdmin = this.gcf.scopedClient('/a/course');
  private garg = this.gcf.scopedClient('/course');

  constructor(
    private gcf: GargantuaClientFactory,
    public scenarioService: ScenarioService,
    public rbacService: RbacService,
  ) {}

  public watch() {
    return this.bh.asObservable();
  }

  public list(force = false) {
    if (!force && this.fetchedList) {
      return of(this.cachedCourseList);
    } else {
      return this.gargAdmin.get('/list').pipe(
        map((s: ServerResponse) => {
          let obj: CourseApi[] = JSON.parse(atou(s.content)); // this doesn't encode a map though
          let courses: Course[] = [];
          // so now we need to go vmset-by-vmset and build maps
          if (obj == null) {
            return [];
          }
          obj.forEach(async (c: CourseApi) => {
            c.virtualmachines.forEach((v: Object) => {
              v = new Map(Object.entries(v));
            });
            const tempCourse: Course = new Course();
            if (await this.rbacService.Grants('scenarios', 'list')) {
              this.scenarioService.list().subscribe((sc: Scenario[]) => {
                tempCourse.scenarios = sc.filter((s: Scenario) =>
                  c.scenarios.includes(s.id),
                );
              });
            }
            tempCourse.id = c.id;
            tempCourse.description = atou(c.description);
            tempCourse.categories = c.categories ?? [];
            tempCourse.keep_vm = c.keep_vm;
            tempCourse.keepalive_duration = c.keepalive_duration;
            tempCourse.name = atou(c.name);
            tempCourse.pause_duration = c.pause_duration;
            tempCourse.pauseable = c.pauseable;
            tempCourse.virtualmachines = c.virtualmachines;
            tempCourse.scenarios.sort((a, b) => {
              return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
            });
            courses.push(tempCourse);
          });
          return courses;
        }),
        tap((c: Course[]) => {
          this.set(c);
        }),
      );
    }
  }

  public getCourseById(id: String) {
    return this.garg.get(`/${id}`).pipe(
      map((s: ServerResponse) => {
        let response: Course = JSON.parse(atou(s.content));
        response.name = atou(response.name);
        response.description = atou(response.description);
        return response;
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
    );
  }

  public set(list: Course[]) {
    this.cachedCourseList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }

  public create(c: Course) {
    var scenarioArray: string[] = [];
    c.scenarios.forEach((s: Scenario) => {
      scenarioArray.push(s.id);
    });
    var params = new HttpParams()
      .set('name', utoa(c.name))
      .set('description', utoa(c.description))
      .set('keepalive_duration', c.keepalive_duration ?? '')
      .set('pause_duration', c.pause_duration ?? '')
      .set('pauseable', JSON.stringify(c.pauseable))
      .set('keep_vm', JSON.stringify(c.keep_vm))
      .set('virtualmachines', JSON.stringify(c.virtualmachines))
      .set('scenarios', JSON.stringify(scenarioArray));
    return this.gargAdmin.post('/new', params);
  }

  public update(c: Course) {
    var scenarioArray: string[] = [];
    c.scenarios.forEach((s: Scenario) => {
      scenarioArray.push(s.id);
    });
    var params = new HttpParams()
      .set('name', utoa(c.name))
      .set('description', utoa(c.description))
      .set('keepalive_duration', c.keepalive_duration ?? '')
      .set('pause_duration', c.pause_duration ?? '')
      .set('pauseable', JSON.stringify(c.pauseable))
      .set('virtualmachines', JSON.stringify(c.virtualmachines))
      .set('scenarios', JSON.stringify(scenarioArray))
      .set('keep_vm', JSON.stringify(c.keep_vm))
      .set('categories', JSON.stringify(c.categories));

    return this.gargAdmin.put(`/${c.id}`, params);
  }

  public delete(c: Course) {
    return this.gargAdmin.delete(`/${c.id}`);
  }

  public listDynamicScenarios(categories: String[]) {
    var params = new HttpParams().set('categories', JSON.stringify(categories));
    return this.gargAdmin
      .post('/previewDynamicScenarios', params)
      .pipe(
        map((s: ServerResponse) => {
          let obj: String[] = JSON.parse(atou(s.content));
          return obj;
        }),
      );
  }
}
