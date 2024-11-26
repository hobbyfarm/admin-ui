import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of, throwError } from 'rxjs';
import { atou } from '../unicode';
import { ResourceClient, GargantuaClientFactory } from './gargantua.service';
import { VirtualMachine } from './virtualmachine';

@Injectable({
  providedIn: 'root',
})
export class AdminVmService extends ResourceClient<VirtualMachine> {
  constructor(gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/a/vm'));
  }

  public list() {
    return this.garg.get('/list').pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      })
    );
  }
  public listByScheduledEvent(id: String) {
    return this.garg
      .get('/scheduledevent/' + id)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          return throwError(() => e.error);
        }),
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)));
        })
      );
  }

  public count() {
    return this.garg.get('/count').pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      })
    );
  }
}
