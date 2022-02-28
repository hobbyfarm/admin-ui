import { Component, OnInit } from '@angular/core';
import { RbacService } from '../data/rbac.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  public rolesRbac: boolean = false;

  constructor(
    private rbacService: RbacService
  ) { }

  ngOnInit() {
    this.rolesRbac = this.rbacService.Grants('roles', 'list', 'rbac.authorization.k8s.io')
  }

}
