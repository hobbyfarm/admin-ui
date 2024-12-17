import { Injectable } from '@angular/core';
import { ResourceClient, GargantuaClientFactory } from '../data/gargantua.service';
import { VirtualMachine as VM } from '../data/virtualmachine';
import { catchError, map, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class VMService extends ResourceClient<VM> {
  constructor(gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/vm'));
  }

  get(id: string) {
    // Do not use cached responses
    this.cache.clear();
    return super.get(id);
  }

  getWebinterfaces(id: string) {
    return this.garg.get('/getwebinterfaces/' + id).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
    );
  }

  getSharedVMs(acc: string) {
    return this.garg.get('/shared/' + acc).pipe(
      map(
        (res) =>
          [...JSON.parse(atob(res.content))] as unknown as VM[],
      ),
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
    );
  }
}
