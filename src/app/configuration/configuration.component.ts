import { Component, OnInit } from '@angular/core';
import { RbacService } from '../data/rbac.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent {

  public rolesRbac: boolean = false;

  constructor(
  ) { }

  ngOnInit() {
  }

}
