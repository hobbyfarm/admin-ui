import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { switchMap, catchError } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { of, throwError } from 'rxjs';
import { parseTemplate } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http: HttpClient
  ) { }

  public getUsers() {
    return this.http.get(environment.server + "/a/user/list")
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atob(s.content)));
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      })
    )
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
}
