import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {
  GargantuaClientFactory,
  ListableResourceClient,
} from './gargantua.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ListableResourceClient<User> {
  constructor(gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/a/user'));
  }

  public saveUser(
    id: string,
    email: string = '',
    password: string = '',
    accesscodes?: string[],
  ) {
    var params = new HttpParams()
      .set('id', id)
      .set('email', email)
      .set('password', password);

    if (accesscodes) {
      params = params.set('accesscodes', JSON.stringify(accesscodes));
    }

    return this.garg.put('', params).pipe(
      catchError((e: HttpErrorResponse) => {
        return of(e.error);
      }),
    );
  }

  public deleteUser(id: string) {
    return this.garg.delete(`/${id}`).pipe(
      tap(() => {
        this.deleteAndNotify(id);
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.error);
      }),
    );
  }
}
