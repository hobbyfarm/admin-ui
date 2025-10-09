import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from '../app-config.service';
import { AuthnService } from '../data/authn.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';
  public error: string = '';

  private config = this.configService.getConfig();
  public logo;
  public background;

  constructor(
    public http: HttpClient,
    public configService: AppConfigService,
    private authenticationService: AuthnService,
  ) {
    if (this.config.login && this.config.login.logo) {
      this.logo = this.config.login.logo;
    }
    if (this.config.login && this.config.login.background) {
      this.background = 'url(' + this.config.login.background + ')';
    }
    if (this.config.favicon) {
      const fi = <HTMLLinkElement>document.querySelector('#favicon');
      fi.href = this.config.favicon;
    }
  }

  public login() {
    this.error = '';

    this.authenticationService.login(this.email, this.password).subscribe({
      error: (e: HttpErrorResponse) => {
        if (e.error instanceof ErrorEvent) {
          // frontend, maybe network?
          this.error = e.error.error;
        } else {
          // backend
          this.error = e.error.message;
        }
      },
    });
  }
}
