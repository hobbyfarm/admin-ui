import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ServerResponse } from '../data/serverresponse';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../app-config.service';
import { RbacService } from '../data/rbac.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public showPassword = false;
  public email: string = "";
  public password: string = "";
  public error: string = "";

  private config = this.configService.getConfig();
  public logo;
  public background;

  constructor(
    public http: HttpClient,
    public router: Router,
    public configService: AppConfigService,
    private rbacService: RbacService
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
          // load the access set in rbac
          this.rbacService.LoadAccessSet().then(
            () => this.router.navigateByUrl("/home")
          )
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
