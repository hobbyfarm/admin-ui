import { Injectable } from '@angular/core';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ServerResponse } from './serverresponse';
import {
  map,
  catchError,
  tap,
  switchMap,
  filter,
  take,
  retry,
  mergeMap,
  toArray,
} from 'rxjs/operators';
import { Course, CourseApi } from './course';
import { Scenario } from './scenario';
import { ScenarioService } from './scenario.service';
import { atou, utoa } from '../unicode';
import {
  BehaviorSubject,
  firstValueFrom,
  from,
  Observable,
  of,
  throwError,
} from 'rxjs';
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

  public list(force = false): Observable<Course[]> {
    if (!force && this.fetchedList) {
      return of(this.cachedCourseList); // Return cached list
    } else {
      return this.gargAdmin.get<ServerResponse>('/list').pipe(
        switchMap((s: ServerResponse): Observable<Course[]> => {
          const obj: CourseApi[] = JSON.parse(atou(s.content));
          if (!obj) return of([] as Course[]);

          return from(obj).pipe(
            mergeMap(
              (c: CourseApi): Observable<Course> =>
                from(this.createCourseWithScenarios(c)), // Create each course
            ),
            toArray(), // Collect all courses into an array
          );
        }),
        tap((courses: Course[]) => {
          this.set(courses); // Cache the courses
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
    return this.gargAdmin.post('/previewDynamicScenarios', params).pipe(
      map((s: ServerResponse) => {
        let obj: String[] = JSON.parse(atou(s.content));
        return obj;
      }),
    );
  }

  // Helper function to create a Course with Scenarios
  private async createCourseWithScenarios(c: CourseApi): Promise<Course> {
    const tempCourse: Course = new Course();

    tempCourse.id = c.id;
    tempCourse.description = atou(c.description);
    tempCourse.categories = c.categories ?? [];
    tempCourse.keep_vm = c.keep_vm;
    tempCourse.keepalive_duration = c.keepalive_duration;
    tempCourse.name = atou(c.name);
    tempCourse.pause_duration = c.pause_duration;
    tempCourse.pauseable = c.pauseable;

    tempCourse.virtualmachines = c.virtualmachines.map(
      (v: Object) =>
        Object.fromEntries(Object.entries(v)) as Record<string, string>,
    );

    if (await this.rbacService.Grants('scenarios', 'list')) {
      const scenarios = await firstValueFrom(
        this.scenarioService.list().pipe(
          switchMap((sc: Scenario[]) => {
            if (sc.length === 0) {
              return throwError(() => new Error('Empty list, retrying...'));
            }
            return of(sc);
          }),
          retry({ count: 5, delay: 1000 }),
          filter((sc: Scenario[]) => sc.length > 0),
          take(1),
        ),
      );

      tempCourse.scenarios = scenarios.filter((s: Scenario) =>
        c.scenarios?.includes(s.id),
      );

      tempCourse.scenarios.sort((a, b) =>
        a.id > b.id ? 1 : b.id > a.id ? -1 : 0,
      );
    }

    return tempCourse;
  }
}
