import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { TypedInput, FormGroupType } from '../../typed-form/TypedInput';
import {
  PreparedScope,
  TypedSettingsService,
} from 'src/app/data/typedSettings.service';
import { AlertComponent } from 'src/app/alert/alert.component';
import { ServerResponse } from 'src/app/step/ServerResponse';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public settings: TypedInput[] = [];
  public updatedSettings: TypedInput[] = [];
  public hasChanges: boolean = false;
  public valid: boolean = true;
  public scopes: PreparedScope[] = [];
  public selectedScope: PreparedScope;
  public loading: boolean = true;
  public scopesLoading: boolean = true;
  readonly FormGroupType = FormGroupType; // Reference to TypedInputTypes enum for template use

  @ViewChild('alert') alert: AlertComponent;

  private alertTime = 2000;
  private alertErrorTime = 10000;
  public alertClosed: boolean = true;

  constructor(
    public typedSettingsService: TypedSettingsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getScopes();
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        console.log('router event ended');
        this.testPath();
      }
    });
  }

  onFormChange(data: TypedInput[]) {
    this.updatedSettings = data;
    this.hasChanges = true;
  }

  changeFormValidity(valid: boolean) {
    this.valid = valid;
  }

  onSubmit() {
    if (!this.updatedSettings) {
      return;
    }
    this.typedSettingsService.updateCollection(this.updatedSettings).subscribe({
      next: (resp: ServerResponse) => {
        console.log(resp);
        this.hasChanges = false;
        this.alert.success(
          'Settings successfully saved',
          false,
          this.alertTime
        );
      },
      error: (err) => {
        this.alert.danger(err.error.message, true, this.alertErrorTime);
      },
    });
  }

  setScope(scope: PreparedScope) {
    this.loading = true;
    this.selectedScope = scope;
    this.typedSettingsService.list(this.selectedScope.name).subscribe({
      next: (typedSettings: TypedInput[]) => {
        this.settings = typedSettings;
        this.loading = false;
      },
      error: (err) => {
        this.alert.danger(err.error.message, true, this.alertErrorTime);
      },
    });
  }

  getScopes() {
    this.scopes = [];
    this.typedSettingsService.listScopes().subscribe({
      next: (scopes: PreparedScope[]) => {
        this.scopes = scopes;
        this.scopesLoading = false;
        this.testPath();
      },
      error: (err) => {
        this.alert.danger(err.error.message, true, this.alertErrorTime);
      },
    });
  }

  testPath() {
    const { paramMap } = this.route.snapshot;
    const scope = paramMap.get('scope')!;
    if (this.scopes.length < 1) {
      return;
    }

    if (scope != '') {
      const findScope = this.scopes.filter((a) => {
        return a.name == scope;
      });

      if (findScope && findScope[0]) {
        this.setScope(findScope[0]);
      }
    } else {
      this.setScope(this.scopes[0]);
    }
  }
}
