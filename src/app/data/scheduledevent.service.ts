import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
  DashboardScheduledEvent,
  ScheduledEvent,
  ScheduledEventBase,
} from './scheduledevent';
import { ServerResponse } from './serverresponse';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, from, of, throwError } from 'rxjs';
import { formatDate } from '@angular/common';
import { atou } from '../unicode';
import {
  GargantuaClientFactory,
  ListableResourceClient,
} from './gargantua.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduledeventService extends ListableResourceClient<ScheduledEvent> {
  private cachedDashboardEvents: BehaviorSubject<
    Map<string, DashboardScheduledEvent>
  > = new BehaviorSubject(new Map());

  constructor(gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/a/scheduledevent'));
  }

  public get(id: string, force = false) {
    return super.get(id, force).pipe(
      map((ses: ScheduledEvent) => {
        ses.start_time = new Date(ses.start_time);
        ses.end_time = new Date(ses.end_time);
        return ses;
      }),
    );
  }

  public list(listId: string = '', force = false) {
    return super.list(listId, force).pipe(
      map((ses: ScheduledEvent[]) => {
        ses.map((event: ScheduledEvent) => {
          event.start_time = new Date(event.start_time);
          event.end_time = new Date(event.end_time);
        });
        return ses;
      }),
    );
  }

  public create(se: ScheduledEvent) {
    var params = new HttpParams()
      .set('name', se.event_name)
      .set('description', se.description)
      .set(
        'start_time',
        formatDate(se.start_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC'),
      )
      .set(
        'end_time',
        formatDate(se.end_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC'),
      )
      .set('required_vms', JSON.stringify(se.required_vms))
      .set('access_code', se.access_code.toLowerCase()) // this needs to be lower case because of RFC-1123
      .set('disable_restriction', JSON.stringify(se.disable_restriction))
      .set('on_demand', JSON.stringify(se.on_demand))
      .set('printable', JSON.stringify(se.printable));

    if (se.scenarios != null) {
      params = params.set('scenarios', JSON.stringify(se.scenarios));
    }
    if (se.courses != null) {
      params = params.set('courses', JSON.stringify(se.courses));
    }

    return this.garg.post('/new', params).pipe(
      tap(() => {
        this.list('', true);
      }),
      switchMap((s: ServerResponse) => {
        return from(JSON.parse(atou(s.message)));
      }),
    );
  }

  public update(se: ScheduledEvent) {
    var params = new HttpParams()
      .set('name', se.event_name)
      .set('description', se.description)
      .set(
        'start_time',
        formatDate(se.start_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC'),
      )
      .set(
        'end_time',
        formatDate(se.end_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC'),
      )
      .set('required_vms', JSON.stringify(se.required_vms))
      .set('access_code', se.access_code.toLocaleLowerCase()) // this needs to be lower case because of RFC-1123
      .set('disable_restriction', JSON.stringify(se.disable_restriction))
      .set('on_demand', JSON.stringify(se.on_demand))
      .set('printable', JSON.stringify(se.printable));

    if (se.scenarios != null) {
      params = params.set('scenarios', JSON.stringify(se.scenarios));
    }
    if (se.courses != null) {
      params = params.set('courses', JSON.stringify(se.courses));
    }

    return this.garg.put(`/${se.id}`, params).pipe(
      switchMap((s: ServerResponse) => {
        return from<string>(JSON.parse(atou(s.message)));
      }),
    );
  }

  public delete(se: ScheduledEventBase) {
    return this.garg.delete(`/delete/${se.id}`).pipe(
      switchMap((s: ServerResponse) => {
        return from(s.message);
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      }),
      tap(() => {
        this.deleteAndNotify(se.id);
      }),
    );
  }

  public addOtacs(seId: string, count: number, duration: string = '') {
    var params = new HttpParams().set('max_duration', duration);

    return this.garg.post(`/${seId}/otacs/add/${count}`, params).pipe(
      switchMap((s: ServerResponse) => {
        let se = JSON.parse(atou(s.content));
        return of(se);
      }),
    );
  }

  public deleteOtac(seId: string, otacId: string) {
    return this.garg.get(`/${seId}/otacs/delete/${otacId}`);
  }

  public listOtacs(seId: string) {
    return this.garg.get(`/${seId}/otacs/list`).pipe(
      switchMap((s: ServerResponse) => {
        let se = JSON.parse(atou(s.content));
        return of(se);
      }),
    );
  }

  public setDashboardCache(map: Map<string, DashboardScheduledEvent>) {
    this.cachedDashboardEvents.next(map);
  }

  public getDashboardCache(): BehaviorSubject<
    Map<string, DashboardScheduledEvent>
  > {
    return this.cachedDashboardEvents;
  }
}
