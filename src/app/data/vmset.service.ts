import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of } from 'rxjs';
import { atou } from '../unicode';
import { GargantuaClientFactory } from './gargantua.service';

@Injectable({
  providedIn: 'root',
})
export class VmSetService {
  private gargAdmin = this.gcf.scopedClient('/a/vmset');

  constructor(private gcf: GargantuaClientFactory) {}

  public list() {
    return this.gargAdmin.get('').pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      }),
    );
  }
  public getVMSetByScheduledEvent(id: String) {
    return this.gargAdmin.get(`/${id}`).pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      }),
    );
  }
}
