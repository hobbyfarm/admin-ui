import { Component, ViewChild, OnInit } from '@angular/core';
import { TypedInput, FormGroupType } from '../../typed-form/TypedInput';
import { PreparedScope, TypedSettingsService } from 'src/app/data/typedSettings.service';
import { AlertComponent } from 'src/app/alert/alert.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings: TypedInput[] = [];
  updatedSettings: TypedInput[] = [];
  hasChanges = false;
  valid = true;
  scopes: PreparedScope[] = [];
  selectedScope?: PreparedScope;
  loading = true;
  scopesLoading = true;

  readonly FormGroupType = FormGroupType; // Reference to TypedInputTypes enum for template use

  @ViewChild('alert') alert: AlertComponent;

  private readonly ALERT_SUCCESS_DURATION = 2000;
  private readonly ALERT_ERROR_DURATION = 10000;

  constructor(
    private typedSettingsService: TypedSettingsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadScopes();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.handleRouteChange());
  }

  onFormChange(data: TypedInput[]): void {
    this.updatedSettings = data;
    this.hasChanges = true;
  }

  changeFormValidity(valid: boolean): void {
    this.valid = valid;
  }

  onSubmit(): void {
    if (!this.updatedSettings) return;

    this.typedSettingsService.updateCollection(this.updatedSettings).subscribe({
      next: () => {
        this.hasChanges = false;
        this.alert.success('Settings successfully saved', true, this.ALERT_SUCCESS_DURATION);
      },
      error: (err) => this.alert.danger(err.error.message, true, this.ALERT_ERROR_DURATION),
    });
  }

  setScope(scope: PreparedScope): void {
    this.loading = true;
    this.selectedScope = scope;

    this.typedSettingsService.list(scope.name).subscribe({
      next: (typedSettings) => {
        this.settings = typedSettings;
        this.loading = false;
      },
      error: (err) => this.alert.danger(err.error.message, true, this.ALERT_ERROR_DURATION),
    });
  }

  private loadScopes(): void {
    this.scopesLoading = true;

    this.typedSettingsService.listScopes().subscribe({
      next: (scopes) => {
        this.scopes = scopes;
        this.scopesLoading = false;
        this.handleRouteChange();
      },
      error: (err) => this.alert.danger(err.error.message, true, this.ALERT_ERROR_DURATION),
    });
  }

  private handleRouteChange(): void {
    if (this.scopes.length === 0) {
      this.alert.danger('No available scopes to select.', true, this.ALERT_ERROR_DURATION);
      this.selectedScope = undefined;
      return;
    }
  
    const scopeName = this.route.snapshot.paramMap.get('scope') || '';
    const targetScope = this.scopes.find((scope) => scope.name === scopeName) || this.scopes[0];
  
    this.setScope(targetScope);
  }
}
