import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { Role } from './role';
import { ServerResponse } from './serverresponse';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(public http: HttpClient) {}

  public list(): Observable<Role[]> {
    return this.http
      .get<ServerResponse>(environment.server + '/a/roles/list')
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)));
        }),
      );
  }

  public get(id: string): Observable<Role> {
    return this.http
      .get<ServerResponse>(environment.server + '/a/roles/' + id)
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(JSON.parse(atou(s.content)));
        }),
      );
  }

  public create(role: Role): Observable<boolean> {
    return this.http
      .post<ServerResponse>(environment.server + '/a/roles/create', role)
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(s.message == 'created');
        }),
      );
  }

  public update(role: Role): Observable<boolean> {
    return this.http
      .put<ServerResponse>(environment.server + '/a/roles/' + role.name, role)
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(s.message == 'updated');
        }),
      );
  }

  public delete(id: string): Observable<boolean> {
    return this.http
      .delete<ServerResponse>(environment.server + '/a/roles/' + id)
      .pipe(
        switchMap((s: ServerResponse) => {
          return of(s.message == 'deleted');
        }),
      );
  }
}
