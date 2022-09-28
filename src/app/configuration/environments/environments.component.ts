import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvironmentService } from 'src/app/data/environment.service';
import { Environment } from 'src/app/data/environment';
import { EditEnvironmentComponent } from './edit-environment/edit-environment.component';
import { RbacService } from 'src/app/data/rbac.service';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
})
export class EnvironmentsComponent implements OnInit {
  public environments: Environment[] = [];
  public updateEnv: Environment;
  public showActionOverflow: boolean = false;

  constructor(
    public environmentService: EnvironmentService,
    public rbacService: RbacService
  ) { }

  @ViewChild("editEnvironmentWizard", {static: true}) editWizard: EditEnvironmentComponent;

  ngOnInit() {
    const authorizationRequests = Promise.all([
      this.rbacService.Grants("environments", "get"),
      this.rbacService.Grants("environments", "update"),
      this.rbacService.Grants("environments", "delete")
    ])

    authorizationRequests.then((permissions: [boolean, boolean, boolean]) => {
      const allowGet: boolean = permissions[0];
      const allowUpdate: boolean = permissions[1];
      const allowDelete: boolean = permissions[2];
      this.showActionOverflow = allowDelete || (allowGet && allowUpdate);
    });
    this.refresh();
  }


  public refresh() {
    this.environmentService.list()
    .subscribe(
      (e: Environment[]) => this.environments = e
    )
  }

  public openNew() {
    this.updateEnv = undefined;
    this.editWizard.open();
  }

  public openUpdate(index: number) {
    // "this.environments[index]"" is only a partial environment, we need to get the full
    this.environmentService.get(this.environments[index].name).subscribe((e: Environment) => {
      this.updateEnv = e;
      this.editWizard.open();
    });
  }
}
