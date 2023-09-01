import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map, catchError, tap } from 'rxjs/operators';
import { Course, CourseApi } from './course';
import { Scenario } from './scenario';
import { ScenarioService } from './scenario.service';
import { atou } from '../unicode';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { RbacService } from './rbac.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private cachedCourseList: Course[] = [];
  private fetchedList = false;
  private bh: BehaviorSubject<Course[]> = new BehaviorSubject(
    this.cachedCourseList
  );

  constructor(
    public http: HttpClient,
    public scenarioService: ScenarioService,
    public rbacService: RbacService
  ) {}

  public watch() {
    return this.bh.asObservable();
  }

  public list(force = false) {
    if (!force && this.fetchedList) {
      return of(this.cachedCourseList);
    } else {
      return this.http.get(environment.server + '/a/course/list').pipe(
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
                  c.scenarios.includes(s.id)
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
        })
      );
    }
  }

  public getCourseById(id: String) {
    return this.http.get(environment.server + '/course/' + id).pipe(
      map((s: ServerResponse) => {
        let response: Course = JSON.parse(atou(s.content));
        response.name = atou(response.name);
        response.description = atou(response.description);
        return response;
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      })
    );
  }

  public set(list: Course[]) {
    this.cachedCourseList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }

  public create(c: Course) {
    var params = new HttpParams()
      .set('name', btoa(c.name))
      .set('description', btoa(c.description))
      .set('keepalive_duration', c.keepalive_duration)
      .set('pause_duration', c.pause_duration)
      .set('pauseable', JSON.stringify(c.pauseable))
      .set('keep_vm', JSON.stringify(c.keep_vm));

    return this.http.post(environment.server + '/a/course/new', params);
  }

  public update(c: Course) {
    var scenarioArray: string[] = [];
    c.scenarios.forEach((s: Scenario) => {
      scenarioArray.push(s.id);
    });
    var params = new HttpParams()
      .set('name', btoa(c.name))
      .set('description', btoa(c.description))
      .set('keepalive_duration', c.keepalive_duration)
      .set('pause_duration', c.pause_duration)
      .set('pauseable', JSON.stringify(c.pauseable))
      .set('virtualmachines', JSON.stringify(c.virtualmachines))
      .set('scenarios', JSON.stringify(scenarioArray))
      .set('keep_vm', JSON.stringify(c.keep_vm))
      .set('categories', JSON.stringify(c.categories));

    return this.http.put(environment.server + '/a/course/' + c.id, params);
  }

  public delete(c: Course) {
    return this.http.delete(environment.server + '/a/course/' + c.id);
  }

  public listDynamicScenarios(categories: String[]) {
    var params = new HttpParams().set('categories', JSON.stringify(categories));
    return this.http
      .post(environment.server + '/a/course/previewDynamicScenarios', params)
      .pipe(
        map((s: ServerResponse) => {
          let obj: String[] = JSON.parse(atou(s.content));
          return obj;
        })
      );
  }
}
