import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { AccessSet } from './accessset';
import { ServerResponse } from './serverresponse';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  private static all: string = "*"

  private userAccess: AccessSet

  constructor(
    public http: HttpClient
  ) {
    // when the service is built, get the rbac access for the user
    this.http.get(environment.server + "/auth/access")
    .pipe(
      map((s: ServerResponse) => JSON.parse(atou(s.content)))
    ).subscribe(
      (as: AccessSet) => this.userAccess = as
    )
  }

  public Grants(resource: string, verb: string, apiGroup: string = "hobbyfarm.io"): boolean {
    let allowed = false;
    [RbacService.all, apiGroup].forEach((a) => {
      [RbacService.all, resource].forEach((r) => {
        [RbacService.all, verb].forEach((v) => {
          let key = "/" + a + "/" + r + "/" + v
          if (this.userAccess.access[key]) {
            allowed = true
          }
        })
      })
    })
    return allowed
  }
  
}
