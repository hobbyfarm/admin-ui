import { Component, OnInit, ViewChild } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons } from '@cds/core/icon';
import { ClrModal } from '@clr/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppConfigService } from '../app-config.service';
import { RbacService } from '../data/rbac.service';
import { Title } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { themes } from '../step/terminal-themes/themes';
import { first } from 'rxjs/operators';
import { SettingsService } from '../data/settings.service';

@Component({
  selector: '[app-header]',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public logoutModalOpened: boolean = false;
  public settingsModalOpened: boolean = false;
  public aboutModalOpened: boolean = false;
  public version = environment.version;
  public email: string = '';
  public configurationRbac: boolean = false;

  public fetchingSettings = false;
  public settingsForm: FormGroup;
  public hide_usernames_status: boolean;
  public isButtonDisabled: boolean = false;

  private config = this.configService.getConfig();
  public title = this.config.title || 'HobbyFarm Administration';
  public logo = this.config.logo || '/assets/default/logo.svg';

  constructor(
    public router: Router,
    public helper: JwtHelperService,
    public configService: AppConfigService,
    private rbacService: RbacService,
    private settingsService: SettingsService,
    private titleService: Title
  ) {
    this.configService.getLogo(this.logo).then((obj: string) => {
      ClarityIcons.addIcons(['logo', obj]);
    });
    if (this.config.favicon) {
      let fi = <HTMLLinkElement>document.querySelector('#favicon');
      fi.href = this.config.favicon;
    }
    this.titleService.setTitle(this.title);
  }

  ngOnInit() {
    const authorizationRequests = Promise.all([
      this.rbacService.Grants('environments', 'list'),
      this.rbacService.Grants('virtualmachinetemplates', 'list'),
      this.rbacService.Grants('roles', 'list'),
    ]);

    authorizationRequests.then((permissions: [boolean, boolean, boolean]) => {
      const listEnvironments: boolean = permissions[0];
      const listVmTemplates: boolean = permissions[1];
      const listRoles: boolean = permissions[2];
      this.configurationRbac = listEnvironments || listVmTemplates || listRoles;
    });

    // we always expect our token to be a string since we load it syncronously from local storage
    const token = this.helper.tokenGetter();
    if (typeof token === 'string') {
      const decodedToken = this.helper.decodeToken(token);
      this.email = decodedToken.email;

      // Automatically logout the user after token expiration
      const timeout = decodedToken.exp * 1000 - Date.now();
      setTimeout(() => this.doLogout(), timeout);
    } else {
      // ... however if for some reason it is not the case, this means that the token could not be loaded from local storage
      // hence we automatically logout the user
      this.doLogout();
    }
    this.settingsForm = this.settingsService.getForm()
  }

  @ViewChild('settingsmodal', { static: true }) settingsModal: ClrModal;
  @ViewChild('logoutmodal', { static: true }) logoutModal: ClrModal;
  @ViewChild('aboutmodal', { static: true }) aboutModal: ClrModal;
  
  public logout() {
    this.logoutModal.open();
  }

  public about() {
    this.aboutModal.open();
  }

  public doLogout() {
    localStorage.removeItem('hobbyfarm_admin_token');
    this.router.navigateByUrl('/login');
  }

  public openSettings() {
    this.settingsForm.reset();
    this.fetchingSettings = true;
    this.settingsService.settings$
      .pipe(first())
      .subscribe(
        ({
          terminal_theme = 'default',
          hide_usernames_status = false,
        }) => {
          this.settingsForm.setValue({
            terminal_theme,
            hide_usernames_status
          });

          this.fetchingSettings = false;
        },
      );
    this.settingsModal.open();
    this.hide_usernames_status = this.settingsForm.get('hide_usernames_status')?.value
  }

  public doSaveSettings() {
    this.isButtonDisabled = true;
    this.settingsService.update(this.settingsForm.value).subscribe({
      next: () => {
        this.settingsModalOpened = false;
        this.isButtonDisabled = false;

      },
      error: () => {
        setTimeout(() => (this.settingsModalOpened = false), 2000);
      },
    });
  }
}
