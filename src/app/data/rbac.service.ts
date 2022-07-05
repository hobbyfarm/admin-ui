import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { AccessSet } from './accessset';
import { hobbyfarmApiGroup, rbacApiGroup } from './rbac';
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
    // only load an access set if the hobbyfarm token is in place
    // otherwise we would be loading an empty access set
    if (localStorage.getItem("hobbyfarm_admin_token")?.length > 0) {
      this.LoadAccessSet(); 
    }
  }

  // async because we want to ensure that callers of this method
  // can wait for its completion. This is especially important in 
  // login.component, because we don't want to navigate the user to
  // the home page before we have completed setting up rbac.
  public async LoadAccessSet(): Promise<boolean> {
    await this.http.get(environment.server + "/auth/access")
    .pipe(
      map((s: ServerResponse) => JSON.parse(atou(s.content)))
    ).toPromise().then(
      (as: AccessSet) => this.userAccess = as
    )

    return true
  }

  public Grants(resource: string, verb: string): boolean {
    var apiGroup
    if (resource == "roles" || resource == "rolebindings") {
      apiGroup = rbacApiGroup
    } else {
      apiGroup = hobbyfarmApiGroup
    }

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
