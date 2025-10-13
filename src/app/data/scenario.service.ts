import { Injectable } from '@angular/core';
import {
  HttpParams,
  HttpParameterCodec,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { ServerResponse } from './serverresponse';
import { catchError, map, take, tap } from 'rxjs/operators';
import { Scenario } from './scenario';
import { Step } from './step';
import { atou, utoa } from '../unicode';
import { BehaviorSubject, throwError } from 'rxjs';
import { GargantuaClientFactory } from './gargantua.service';
import { environment } from 'src/environments/environment';

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
  providedIn: 'root',
})
export class ScenarioService {
  private cachedScenarioList: Scenario[] = [];
  private fetchedList = false;
  private startedFetchedList = false;
  private bh: BehaviorSubject<Scenario[]> = new BehaviorSubject(
    this.cachedScenarioList,
  );
  private gargAdmin = this.gcf.scopedClient('/a/scenario');

  constructor(
    private gcf: GargantuaClientFactory,
    private http: HttpClient,
  ) {}

  public watch() {
    return this.bh.asObservable();
  }

  public list(force = false) {
    if (!force && (this.fetchedList || this.startedFetchedList)) {
      return this.bh.pipe(take(1));
    } else {
      this.startedFetchedList = true;
      return this.gargAdmin.get('/list').pipe(
        map((s: ServerResponse) => {
          const obj: Scenario[] = JSON.parse(atou(s.content)); // this doesn't encode a map though
          // so now we need to go vmset-by-vmset and build maps
          obj.forEach((s: Scenario) => {
            s.virtualmachines = s.virtualmachines.map(
              (v) =>
                new Map<string, string>(
                  Object.entries(v as Record<string, string>),
                ),
            ) as unknown as typeof s.virtualmachines;
          });
          return obj;
        }),

        map((sList: Scenario[]) => {
          sList.forEach((s: Scenario) => {
            s.name = atou(s.name);
            s.description = atou(s.description);
            s.categories = s.categories ?? [];
            s.tags = s.tags ?? [];
          });
          return sList;
        }),
        tap((s: Scenario[]) => {
          this.set(s);
        }),
      );
    }
  }

  public set(list: Scenario[]) {
    this.cachedScenarioList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }

  public get(id: string) {
    return this.gargAdmin.get(`/${id}`).pipe(
      map((s: ServerResponse) => {
        return JSON.parse(atou(s.content));
      }),
      map((s: Scenario) => {
        // atou all the relevant fields
        s.name = atou(s.name);
        s.description = atou(s.description);
        s.steps.forEach((st: Step) => {
          st.content = atou(st.content);
          st.title = atou(st.title);
        });
        s.categories = s.categories ?? [];
        s.tags = s.tags ?? [];
        //Admin Route in Garg ("/a/scenario") returns Scenarios without StepCount
        s.stepcount = s.steps.length;
        return s;
      }),
    );
  }

  public clone(scenarioId: string) {
    return this.gargAdmin.post(`/copy/${scenarioId}`, null).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
    );
  }

  public update(s: Scenario) {
    const steps = structuredClone(s.steps);
    // step by step, re-encode to b64
    steps.forEach((st: Step) => {
      st.title = utoa(st.title);
      st.content = utoa(st.content);
    });

    const normalizedVmTasks = (s.vm_tasks ?? []).map((vmTaskGroup) => ({
      ...vmTaskGroup,
      tasks: (vmTaskGroup.tasks ?? []).map((task) => {
        const rawExpectedReturnCode = (
          task as { expected_return_code?: unknown }
        ).expected_return_code;
        let expectedReturnCode: number | null | undefined = undefined;
        if (
          rawExpectedReturnCode === '' ||
          rawExpectedReturnCode === undefined ||
          rawExpectedReturnCode === null
        ) {
          expectedReturnCode = null;
        } else if (typeof rawExpectedReturnCode === 'number') {
          expectedReturnCode = rawExpectedReturnCode;
        } else {
          const parsedReturnCode = parseInt(String(rawExpectedReturnCode), 10);
          expectedReturnCode = Number.isNaN(parsedReturnCode)
            ? null
            : parsedReturnCode;
        }
        return { ...task, expected_return_code: expectedReturnCode };
      }),
    }));

    const params = new HttpParams({ encoder: new CustomEncoder() })
      .set('name', utoa(s.name))
      .set('description', utoa(s.description))
      .set('steps', JSON.stringify(steps))
      .set('categories', JSON.stringify(s.categories))
      .set('tags', JSON.stringify(s.tags))
      .set('virtualmachines', JSON.stringify(s.virtualmachines))
      .set('pause_duration', s.pause_duration)
      .set('keepalive_duration', s.keepalive_duration)
      .set('vm_tasks', JSON.stringify(normalizedVmTasks));

    return this.gargAdmin.put(`/${s.id}`, params).pipe(
      tap(() => {
        // Find the index of the scenario in the cached list
        const index = this.cachedScenarioList.findIndex(
          (scenario) => scenario.id === s.id,
        );
        if (index !== -1) {
          // Replace the old scenario with the updated one
          this.cachedScenarioList[index] = s;
        }
        // Update the cache with the new list
        this.set(this.cachedScenarioList);
      }),
    );
  }

  public create(s: Scenario) {
    s.steps.forEach((st: Step) => {
      st.title = utoa(st.title);
      st.content = utoa(st.content);
    });

    const params = new HttpParams()
      .set('name', utoa(s.name))
      .set('description', utoa(s.description))
      .set('virtualmachines', JSON.stringify(s.virtualmachines))
      .set('steps', JSON.stringify(s.steps))
      .set('pause_duration', s.pause_duration)
      .set('categories', JSON.stringify(s.categories))
      .set('tags', JSON.stringify(s.tags))
      .set('keepalive_duration', s.keepalive_duration)
      .set('vm_tasks', JSON.stringify(s.vm_tasks));

    return this.gargAdmin.post('/new', params).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
      map((s: ServerResponse) => {
        return s.message;
      }),
      map((scenarioID: string) => {
        s.id = scenarioID;
        s.categories = [];
        s.tags = [];
        return s;
      }),
      tap((scenario: Scenario) => {
        this.cachedScenarioList.push(scenario);
        this.set(this.cachedScenarioList);
      }),
    );
  }

  public printable(id: string) {
    return this.http.get(`${environment.server}/a/scenario/${id}/printable`, {
      responseType: 'text',
    });
  }

  public delete(id: string) {
    return this.gargAdmin.delete(`/${id}`);
  }
}
