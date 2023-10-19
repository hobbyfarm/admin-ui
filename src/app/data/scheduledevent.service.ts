import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { ScheduledEvent } from './scheduledevent';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of, throwError } from 'rxjs';
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
  constructor(public http: HttpClient, gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/a/scheduledevent'));
  }

  public get(id: string, force = false) {
    return super.get(id, force).pipe(
      map((ses: ScheduledEvent) => {
        ses.start_time = new Date(ses.start_time);
        ses.end_time = new Date(ses.end_time);
        return ses;
      })
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
      })
    );
  }

  public create(se: ScheduledEvent) {
    var params = new HttpParams()
      .set('name', se.event_name)
      .set('description', se.description)
      .set(
        'start_time',
        formatDate(se.start_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC')
      )
      .set(
        'end_time',
        formatDate(se.end_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC')
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

    return this.http
      .post(environment.server + '/a/scheduledevent/new', params)
      .pipe(
        tap(() => {
          this.list('', true);
        }),
        switchMap((s: ServerResponse) => {
          return from(JSON.parse(atou(s.message)));
        })
      );
  }

  public update(se: ScheduledEvent) {
    var params = new HttpParams()
      .set('name', se.event_name)
      .set('description', se.description)
      .set(
        'start_time',
        formatDate(se.start_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC')
      )
      .set(
        'end_time',
        formatDate(se.end_time, 'E LLL dd HH:mm:ss UTC yyyy', 'en-US', 'UTC')
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

    return this.http
      .put(environment.server + '/a/scheduledevent/' + se.id, params)
      .pipe(
        switchMap((s: ServerResponse) => {
          return from(JSON.parse(atou(s.message)));
        })
      );
  }

  public delete(se: ScheduledEvent) {
    return this.http
      .delete(environment.server + '/a/scheduledevent/delete/' + se.id)
      .pipe(
        switchMap((s: ServerResponse) => {
          return from(s.message);
        }),
        catchError((e: HttpErrorResponse) => {
          return throwError(e.error);
        }),
        tap(() => {
          this.deleteAndNotify(se.id);
        })
      );
  }

  public addOtacs(seId: string, count: number) {
    return this.http
      .get(
        environment.server + '/a/scheduledevent/' + seId + '/otacs/add/' + count
      )
      .pipe(
        switchMap((s: ServerResponse) => {
          let se = JSON.parse(atou(s.content));
          return of(se);
        })
      );
  }

  public deleteOtac(seId: string, otacId: string) {
    return this.http.get(
      environment.server +
        '/a/scheduledevent/' +
        seId +
        '/otacs/delete/' +
        otacId
    );
  }

  public listOtacs(seId: string) {
    return this.http
      .get(environment.server + '/a/scheduledevent/' + seId + '/otacs/list')
      .pipe(
        switchMap((s: ServerResponse) => {
          let se = JSON.parse(atou(s.content));
          return of(se);
        })
      );
  }
}
