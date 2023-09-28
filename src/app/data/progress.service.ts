import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { Progress, ProgressStep } from './progress';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import {
  extractResponseContent,
  GargantuaClientFactory,
} from './gargantua.service';
import { formatDate } from '@angular/common';
import { ScenarioService } from './scenario.service';
import { Scenario } from './scenario';

@Injectable()
export class ProgressService {

  constructor(
    private gcf: GargantuaClientFactory,
    public scenarioService: ScenarioService
  ) { }
  private garg = this.gcf.scopedClient('/progress');
  private gargAdmin = this.gcf.scopedClient('/a/progress')

  private cachedProgressList: Progress[] = [];
  private bh: BehaviorSubject<Progress[]> = new BehaviorSubject(
    this.cachedProgressList,
  );
  private fetchedList = false;

  public watch() {
    return this.bh.asObservable();
  }

  public list(force = false) {
    if (!force && this.fetchedList) {
      return of(this.cachedProgressList);
    } else {
      return this.garg.get('/list').pipe(
        map(extractResponseContent),
        map((pList: Progress[]) => {
          return this.buildProgressList(pList)
        }),
        tap((p: Progress[]) => {
          this.set(p);
        }),
      );
    }
  }

  public listByRange(from: Date, to: Date) {
    const fromDateString: string = formatDate(from, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC");
    const toDateString: string = formatDate(to, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC");
    const params = new HttpParams()
      .set("from", formatDate(fromDateString, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC"))
      .set("to", formatDate(toDateString, "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC"))
    return this.gargAdmin.get('/range', {
      params: params
    }).pipe(
      map(extractResponseContent),
      map((pList: Progress[]) => {
        return this.buildProgressList(pList)
      }),
      switchMap((progress: Progress[]) => {
        return forkJoin([
          of(progress),
          this.scenarioService.list()
        ]);
      }),
      map(([progress, scenarios]: [Progress[], Scenario[]]) => {
        const scenarioMap = {};
        scenarios.forEach(s => scenarioMap[s.id] = s.name);
        progress.forEach(p => p.scenario_name = scenarioMap[p.scenario]);
        return progress;
      })
    );
  }

  public listByScheduledEvent(seId: string, includeFinished: boolean = false) {
    return this.gargAdmin.get('/scheduledevent/' + seId + '?includeFinished=' + includeFinished)
      .pipe(
        map(extractResponseContent),
        map((pList: Progress[]) => {
          return this.buildProgressList(pList)
        })
      )
  }

  public count() {
    return this.gargAdmin.get('/count').pipe(
      map(extractResponseContent)
    )
  }

  private buildProgressList(pList: Progress[]) {
    pList.forEach((p: Progress) => {
      p.last_update = new Date(p.last_update);
      p.started = new Date(p.started);
      p.finished = JSON.parse(String(p.finished))
      p.steps.forEach((s: ProgressStep) => {
        s.timestamp = new Date(s.timestamp);
      })
    });
    return pList;
  }
  
  public set(list: Progress[]) {
    this.cachedProgressList = list;
    this.fetchedList = true;
    this.bh.next(list);
  }
}
