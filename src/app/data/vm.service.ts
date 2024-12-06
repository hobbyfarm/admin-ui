import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of } from 'rxjs';
import { atou } from '../unicode';
import { GargantuaClientFactory } from './gargantua.service';

@Injectable({
  providedIn: 'root',
})
export class VmService {
  private garg = this.gcf.scopedClient('/vm');
  private gargAdmin = this.gcf.scopedClient('/a/vm');

  constructor(private gcf: GargantuaClientFactory) {}

  public list() {
    return this.gargAdmin.get('/list').pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      }),
    );
  }
  public listByScheduledEvent(id: String) {
    return this.gargAdmin.get(`/a/vm/scheduledevent/${id}`).pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      }),
    );
  }

  public getVmById(id: number) {
    return this.garg.get(`?${id}`).pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      }),
    );
  }

  public count() {
    return this.gargAdmin.get('/count').pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      }),
    );
  }
}
