import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { GargantuaClientFactory, ListableResourceClient } from './gargantua.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ListableResourceClient<User>{
  constructor(public http: HttpClient, gcf: GargantuaClientFactory) {
    super(gcf.scopedClient('/a/user'));
  }
  
  public saveUser(
    id: string,
    email: string = '',
    password: string = '',
    accesscodes: string[] = null
  ) {
    var params = new HttpParams()
      .set('id', id)
      .set('email', email)
      .set('password', password);

    if (accesscodes != null) {
      params = params.set('accesscodes', JSON.stringify(accesscodes));
    }

    return this.http.put(environment.server + '/a/user', params).pipe(
      catchError((e: HttpErrorResponse) => {
        return of(e.error);
      })
    );
  }

  public deleteUser(id: string) {
    return this.http.delete(environment.server + '/a/user/' + id).pipe(
      tap(() => {
        this.deleteAndNotify(id);
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      }),
    );
  }
}
