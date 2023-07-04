import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { atou } from '../unicode';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private cachedUserList: User[] = [];
  private fetchedList = false;
  private bh: BehaviorSubject<User[]> = new BehaviorSubject(
    this.cachedUserList
  );

  public watch() {
    return this.bh.asObservable();
  }

  constructor(public http: HttpClient) {}

  public getUsers(force: boolean = false) {
    if (!force && this.fetchedList) {
      return of(this.cachedUserList);
    } else {
      return this.http.get(environment.server + '/a/user/list').pipe(
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)));
        }),
        tap((u: User[]) => {
          this.set(u);
        }),
        catchError((e: HttpErrorResponse) => {
          return throwError(e.error);
        })
      );
    }
  }

  public getUserByID(id: String) {
    return this.http.get(environment.server + '/a/user/' + id).pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)));
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      })
    );
  }

  public set(list: User[]) {
    this.cachedUserList = list;
    this.fetchedList = true;
    this.bh.next(this.cachedUserList);
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
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      }),
      tap(() => {
        this.cachedUserList = this.cachedUserList.filter(
          (user) => user.id != id
        );
        this.set(this.cachedUserList);
      })
    );
  }
}
