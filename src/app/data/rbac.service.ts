import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { AccessSet } from './accessset';
import {
  ApiGroup,
  hobbyfarmApiGroup,
  rbacApiGroup,
  Resource,
  Verb,
} from './rbac';
import { ServerResponse } from './serverresponse';

@Injectable({
  providedIn: 'root',
})
export class RbacService {
  private static all: string = '*';

  private userAccess: Promise<AccessSet>;

  constructor(public http: HttpClient) {
    // only load an access set if the hobbyfarm token is in place
    // otherwise we would be loading an empty access set
    if (localStorage.getItem('hobbyfarm_admin_token')?.length > 0) {
      this.LoadAccessSet();
    } else {
      this.userAccess = new Promise<AccessSet>((resolve) => {
        resolve(null);
      });
    }
  }

  // async because we want to ensure that callers of this method
  // can wait for its completion. This is especially important in
  // login.component, because we don't want to navigate the user to
  // the home page before we have completed setting up rbac.
  public LoadAccessSet(): Promise<AccessSet> {
    this.userAccess = lastValueFrom(
      this.http.get(environment.server + '/auth/access').pipe(
        map((s: ServerResponse) => {
          const accessSet: AccessSet = JSON.parse(atou(s.content));
          return accessSet;
        })
      )
    );
    return this.userAccess;
  }

  public async Grants(resource: Resource, verb: Verb): Promise<boolean> {
    let apiGroup: ApiGroup;
    if (resource == 'roles' || resource == 'rolebindings') {
      apiGroup = rbacApiGroup;
    } else {
      apiGroup = hobbyfarmApiGroup;
    }

    let allowed = false;
    return this.userAccess.then((accessSet: AccessSet) => {
      if (accessSet) {
        [RbacService.all, apiGroup].forEach((a) => {
          [RbacService.all, resource].forEach((r) => {
            [RbacService.all, verb].forEach((v) => {
              const key = '/' + a + '/' + r + '/' + v;
              // this.userAccess.pipe(filter(object => object != null)).subscribe(object => {
              //   if(object && object.access[key]) {
              //     allowed = true;
              //   }
              // })
              if (accessSet.access[key]) {
                allowed = true;
              }
            });
          });
        });
      }
      return allowed;
    });
  }
}
