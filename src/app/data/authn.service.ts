import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GargantuaClientFactory } from '../data/gargantua.service';
import { ServerResponse } from './serverresponse';
import { RbacService } from './rbac.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

/**
 * SettingsService is used to handle Settings saved by a user.
 * For Global Settings see TypedSettingsService
 */
@Injectable()
export class AuthnService {
  constructor(
    private gcf: GargantuaClientFactory,
    private rbacService: RbacService,
    private router: Router,
    public helper: JwtHelperService,
  ) {
    // we always expect our token to be a string since we load it syncronously from local storage
    this.tokenSubject.subscribe((token) => {
      // On token changes we always need to remove existing timeouts.
      // Case A - The user logs into our application:
      // Usually there should not exist any timeout if we properly cleaned up everything.
      // However, if for some reason a timeout exists, we clear it up and replace it with a new one.
      // This way, we ensure to always reflect the current token expiration time until automatic logout.
      // Case B - The user manually logs out from our application:
      // Dangling timeouts need to be removed. Automatic logout is not needed if we are not logged in anymore.
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      if (token) {
        this.isLoggedInSubject.next(true);

        const decodedToken = this.helper.decodeToken(token);

        // Automatically logout the user after token expiration
        const timeout = decodedToken.exp * 1000 - Date.now();
        this.timeoutId = setTimeout(() => this.logout(), timeout);
      }
    });

    // Initialize this service with the according authentication token if any exists
    const token = this.helper.tokenGetter();
    if (typeof token === 'string') {
      this.tokenSubject.next(token);
    }
  }
  private garg = this.gcf.scopedClient('/auth');
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string>('');
  private timeoutId: any;

  login(email: string, password: string) {
    let body = new HttpParams().set('email', email).set('password', password);
    return this.garg.post('/authenticate', body).pipe(
      tap((s: ServerResponse) => {
        // should have a token here
        // persist it
        localStorage.setItem('hobbyfarm_admin_token', s.message); // not b64 from authenticate
        this.tokenSubject.next(s.message);
        // load the access set in rbac
        this.rbacService.LoadAccessSet().then(() => {
          this.router.navigateByUrl('/home');
        });
      }),
    );
  }

  logout() {
    localStorage.removeItem('hobbyfarm_admin_token');
    this.tokenSubject.next('');
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl('/login');
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}
