import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Progress, ProgressStep } from './progress';
import { BehaviorSubject, of } from 'rxjs';
import {
  extractResponseContent,
  GargantuaClientFactory,
} from './gargantua.service';

@Injectable()
export class ProgressService {
  constructor(private gcf: GargantuaClientFactory) { }
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

  public update(session: string, step: number) {
    const body = new HttpParams().set('step', step.toString());

    return this.garg.post('/update/' + session, body);
  }
}
