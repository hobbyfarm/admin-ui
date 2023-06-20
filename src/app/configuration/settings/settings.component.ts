import { Component, ViewChild } from '@angular/core';
import { TypedInput, FormGroupType } from '../../typed-form/TypedInput';
import {
  PreparedScope,
  TypedSettingsService,
} from 'src/app/data/typedSettings.service';
import { AlertComponent } from 'src/app/alert/alert.component';

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

  constructor(public typedSettingsService: TypedSettingsService) {
    this.getScopes();
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
    console.log(this.updatedSettings);
    this.typedSettingsService.updateCollection(this.updatedSettings).subscribe(
      (resp) => {
        console.log(resp);
        this.hasChanges = false;
        this.alert.success(
          'Settings successfully saved',
          false,
          this.alertTime
        );
      },
      (err) => {
        this.alert.danger(err.error.message, true, this.alertErrorTime);
      }
    );
  }

  setScope(scope: PreparedScope) {
    this.loading = true;
    this.selectedScope = scope;
    this.typedSettingsService.list(this.selectedScope.name).subscribe(
      (typedSettings) => {
        this.settings = typedSettings;
        this.loading = false;
      },
      (err) => {
        this.alert.danger(err.error.message, true, this.alertErrorTime);
      }
    );
  }

  getScopes() {
    this.scopes = [];
    this.typedSettingsService.listScopes().subscribe(
      (scopes) => {
        this.scopes = scopes;
        this.scopesLoading = false;
        this.setScope(this.scopes[0]);
      },
      (err) => {
        this.alert.danger(err.error.message, true, this.alertErrorTime);
      }
    );
  }
}
