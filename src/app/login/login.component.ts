import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ServerResponse } from '../data/serverresponse';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public email: string = "";
  public password: string = "";
  public error: string = "";
  public success: string = "";
  public accesscode: string = "";

  public loginactive: boolean = false;

  private config = this.configService.getConfig();
  public logo;
  public background;

  constructor(
    public http: HttpClient,
    public router: Router,
    public configService: AppConfigService
  ) {
    if (this.config.login && this.config.login.logo) {
      this.logo = this.config.login.logo
    }
    if (this.config.login && this.config.login.background) {
      this.background = "url(" + this.config.login.background + ")";
    }
    if (this.config.favicon) {
      let fi = <HTMLLinkElement>document.querySelector("#favicon")
      fi.href = this.config.favicon;
    }
  }

  public register() {
    this.error = "";
    let body = new HttpParams()
      .set("email", this.email)
      .set("password", this.password)
      .set("access_code", this.accesscode);

    this.http.post(environment.server + "/auth/registerwithaccesscode", body)
      .subscribe(
        (s: ServerResponse) => {
          this.success = "Success! User created. Please login.";
          this.loginactive = true;
        },
        (e: HttpErrorResponse) => {
          if (e.error instanceof ErrorEvent) {
            // frontend, maybe network?
            this.error = e.error.error;
          } else {
            // backend
            this.error = e.error.message;
          }
        }
      )
  }

  public login() {
    this.error = "";
    let body = new HttpParams()
      .set("email", this.email)
      .set("password", this.password);

    this.http.post(environment.server + "/auth/authenticate", body)
      .subscribe(
        (s: ServerResponse) => {
          // should have a token here
          // persist it
          localStorage.setItem("hobbyfarm_admin_token", s.message) // not b64 from authenticate

          // redirect to the scenarios page
          this.router.navigateByUrl("/home")
        },
        (e: HttpErrorResponse) => {
          if (e.error instanceof ErrorEvent) {
            // frontend, maybe network?
            this.error = e.error.error;
          } else {
            // backend
            this.error = e.error.message;
          }
        }
      )
  }
}
