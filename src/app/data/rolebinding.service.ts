import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { RoleBinding } from './rolebinding';
import { ServerResponse } from './serverresponse';

@Injectable({
  providedIn: 'root'
})
export class RolebindingService {

  constructor(
    public http: HttpClient
  ) { }

  public list(): Observable<RoleBinding[]> {
    return this.http.get<ServerResponse>(environment.server + "/a/rolebindings/list")
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)))
      })
    )
  }

  public get(id: string): Observable<RoleBinding> {
    return this.http.get<ServerResponse>(environment.server + "/a/rolebindings/" + id)
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atou(s.content)))
      })
    )
  }

  public create(roleBinding: RoleBinding): Observable<boolean> {
    return this.http.post<ServerResponse>(environment.server + "/a/rolebindings/create", roleBinding)
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(s.message == "created")
      })
    )
  }
  
  public update(roleBinding: RoleBinding): Observable<boolean> {
    return this.http.put<ServerResponse>(environment.server + "/a/rolebindings/" + roleBinding.name, roleBinding)
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(s.message == "updated")
      })
    )
  }

  public delete(id: string): Observable<boolean> {
    return this.http.delete<ServerResponse>(environment.server + "/a/rolebindings/" + id)
    .pipe(
      switchMap((s: ServerResponse) => of(s.message == "deleted"))
    )
  }
}
