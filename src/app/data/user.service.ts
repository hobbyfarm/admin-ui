import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of, throwError } from 'rxjs';
import { atou } from '../unicode';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private cachedUserList: User[] = []
  private fetchedList = false;

  constructor(
    public http: HttpClient
  ) { }

  public getUsers(force : boolean = false) {
    if (!force && this.fetchedList)  {
      return of(this.cachedUserList);
    } else{
      return this.http.get(environment.server + "/a/user/list")
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)));
        }),
        tap((u: User[]) => {
          this.set(u);
          }
        ),
        catchError((e: HttpErrorResponse) => {
          return throwError(e.error);
        })
      )
    }
  }

  public set(list: User[]){
    this.cachedUserList = list;
    this.fetchedList = true;
  }

  public saveUser(id: string, email: string = "", password: string = "", admin: boolean = null, accesscodes: string[] = null)  {
    var params = new HttpParams()
    .set("id", id)
    .set("email", email)
    .set("password", password);
    
    if (admin != null) {
      params = params.set("admin", JSON.stringify(admin));
    }

    if (accesscodes != null) {
      params = params.set("accesscodes", JSON.stringify(accesscodes));
    }

    return this.http.put(environment.server + "/a/user", params)
    .pipe(
      catchError((e: HttpErrorResponse) => {
        return of(e.error);
      })
    )
  }

  public deleteUser(id: string) {
    return this.http.delete(environment.server + "/a/user/" + id)
    .pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error)
      })
    )
  }
}
