import { Component, OnInit, ViewChild } from '@angular/core';
import { ClarityIcons } from '@clr/icons';
import { ClrModal } from '@clr/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppConfigService } from '../app-config.service';
import { RbacService } from '../data/rbac.service';

@Component({
  selector: '[app-header]',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public logoutModalOpened: boolean = false;
  public aboutModalOpened: boolean = false;
  public version = environment.version;
  public email: string = "";
  public configurationRbac: boolean = false;

  private config = this.configService.getConfig();
  public title = this.config.title || "HobbyFarm Administration";
  public logo = this.config.logo || '/assets/default/logo.svg';

  constructor(
    public router: Router,
    public helper: JwtHelperService,
    public configService: AppConfigService,
    private rbacService: RbacService
  ) {
    this.configService.getLogo(this.logo)
      .then((obj: string) => {
        ClarityIcons.add({
          "logo": obj
        })
      })
      if (this.config.favicon) {
        let fi = <HTMLLinkElement>document.querySelector("#favicon")
        fi.href = this.config.favicon;
      }
  }

  ngOnInit() {
    if (this.rbacService.Grants('environments', 'list') || this.rbacService.Grants('vmtemplates', 'list') || 
    this.rbacService.Grants('roles', 'list')) {
      this.configurationRbac = true;
    }

    var tok = this.helper.decodeToken(this.helper.tokenGetter());
    this.email = tok.email;
  }

  @ViewChild("logoutmodal", { static: true }) logoutModal: ClrModal;
  @ViewChild("aboutmodal", { static: true }) aboutModal: ClrModal;

  public logout() {
    this.logoutModal.open();
  }

  public about() {
    this.aboutModal.open();
  }

  public doLogout() {
    localStorage.removeItem("hobbyfarm_admin_token");
    this.router.navigateByUrl("/login");
  }
}
