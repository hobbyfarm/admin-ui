import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private router: Router, private helper: JwtHelperService) {}

  canActivate() {
    const token = this.helper.tokenGetter();
    const hasValidToken =
      typeof token === 'string' && token && !this.helper.isTokenExpired(token);
    return hasValidToken || this.router.createUrlTree(['/login']);
  }
}
