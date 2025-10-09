import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
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
import { GargantuaClientFactory } from './gargantua.service';

@Injectable({
  providedIn: 'root',
})
export class RbacService {
  private static all: string = '*';
  private userAccess: Promise<AccessSet | null>;
  private garg = this.gcf.scopedClient('/auth');

  constructor(private gcf: GargantuaClientFactory) {
    // only load an access set if the hobbyfarm token is in place
    // otherwise we would be loading an empty access set
    const hfToken = localStorage.getItem('hobbyfarm_admin_token');
    if (hfToken && hfToken.length > 0) {
      this.LoadAccessSet();
    } else {
      this.userAccess = new Promise<AccessSet | null>((resolve) => {
        resolve(null);
      });
    }
  }

  // async because we want to ensure that callers of this method
  // can wait for its completion. This is especially important in
  // login.component, because we don't want to navigate the user to
  // the home page before we have completed setting up rbac.
  public LoadAccessSet(): Promise<AccessSet | null> {
    this.userAccess = lastValueFrom(
      this.garg.get('/access').pipe(
        map((s: ServerResponse) => {
          const accessSet: AccessSet = JSON.parse(
            atou(s.content).toLowerCase(),
          ); // toLowerCase() needed. See https://github.com/hobbyfarm/hobbyfarm/issues/477
          return accessSet;
        }),
      ),
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
    return this.userAccess.then((accessSet: AccessSet | null) => {
      if (accessSet) {
        [RbacService.all, apiGroup].forEach((a) => {
          [RbacService.all, resource].forEach((r) => {
            [RbacService.all, verb].forEach((v) => {
              const key = '/' + a + '/' + r + '/' + v;
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
