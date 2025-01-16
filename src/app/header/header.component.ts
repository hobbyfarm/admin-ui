import { Component, OnInit, ViewChild } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons } from '@cds/core/icon';
import { ClrModal } from '@clr/angular';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppConfigService } from '../app-config.service';
import { RbacService } from '../data/rbac.service';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { SettingsService } from '../data/settings.service';
import { SettingFormGroup } from '../data/forms';
import { AuthnService } from '../data/authn.service';
import { ProgressViewMode } from '../data/ProgressViewMode';

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
  public settingsForm: SettingFormGroup;
  public hide_usernames_status: boolean;
  public progress_view_mode: ProgressViewMode;
  public isButtonDisabled: boolean = false;

  private config = this.configService.getConfig();
  public title = this.config.title || 'HobbyFarm Administration';
  public logo = this.config.logo || '/assets/default/logo.svg';

  constructor(
    public helper: JwtHelperService,
    public configService: AppConfigService,
    private rbacService: RbacService,
    private settingsService: SettingsService,
    private titleService: Title,
    private authenticationService: AuthnService,
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
    }
    this.settingsForm = this.settingsService.getForm();
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
    this.authenticationService.logout();
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
          theme = 'system',
          progress_view_mode = 'cardView',
          currency_symbol = '$',
        }) => {
          this.settingsForm.setValue({
            terminal_theme,
            hide_usernames_status,
            theme,
            progress_view_mode,
            currency_symbol,
          });

          this.fetchingSettings = false;
        },
      );
    this.settingsModal.open();
    this.hide_usernames_status =
      this.settingsForm.controls.hide_usernames_status.value;
    this.progress_view_mode =
      this.settingsForm.controls.progress_view_mode.value;
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
