import { Component, OnInit } from '@angular/core';
import { RbacService } from '../data/rbac.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit {
  public showSettings = false;
  public listEnvironments = false;
  public listVMTemplates = false;
  public listRoles = false;

  constructor(private rbacService: RbacService, private router: Router) {}

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
          this.router.navigateByUrl(`/configuration/settings`);
        } else if (this.listEnvironments) {
          this.router.navigateByUrl(`/configuration/environments`);
        } else if (this.listVMTemplates) {
          this.router.navigateByUrl(`/configuration/vmtemplates`);
        } else if (this.listRoles) {
          this.router.navigateByUrl(`/configuration/roles`);
        }
      }
    );
  }
}
