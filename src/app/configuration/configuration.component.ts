import { Component, OnInit } from '@angular/core';
import { RbacService } from '../data/rbac.service';
import { Router } from '@angular/router';
import {
  PreparedScope,
  TypedSettingsService,
} from '../data/typedSettings.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit {
  public showSettings = false;
  public listEnvironments = false;
  public listVMTemplates = false;
  public listRoles = false;

  public scopes: PreparedScope[] = [];
  public scopesLoading: boolean = true;
  public expandedSettingsGroup = true;

  constructor(
    private rbacService: RbacService,
    private router: Router,
    private typedSettingsService: TypedSettingsService
  ) {}

  ngOnInit() {
    const authorizationRequests = Promise.all([
      this.rbacService.Grants('scopes', 'list'),
      this.rbacService.Grants('settings', 'list'),
      this.rbacService.Grants('environments', 'list'),
      this.rbacService.Grants('virtualmachinetemplates', 'list'),
      this.rbacService.Grants('roles', 'list'),
    ]);

    authorizationRequests.then(
      (permissions: [boolean, boolean, boolean, boolean, boolean]) => {
        this.showSettings = permissions[0] && permissions[1];
        this.listEnvironments = permissions[2];
        this.listVMTemplates = permissions[3];
        this.listRoles = permissions[4];

        if (this.showSettings) {
          this.getScopes();
        }
      }
    );
  }

  getScopes() {
    this.scopes = [];
    this.typedSettingsService.listScopes().subscribe({
      next: (scopes: PreparedScope[]) => {
        this.scopes = scopes;
        this.scopesLoading = false;
      },
    });
  }
}
