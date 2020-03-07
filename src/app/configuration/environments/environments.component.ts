import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvironmentService } from 'src/app/data/environment.service';
import { Environment } from 'src/app/data/environment';
import { EditEnvironmentComponent } from './edit-environment/edit-environment.component';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {
  public environments: Environment[] = [];
  public updateEnv: Environment;

  constructor(
    public environmentService: EnvironmentService
  ) { }

  @ViewChild("editEnvironmentWizard", {static: true}) editWizard: EditEnvironmentComponent;

  ngOnInit() {
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
    this.updateEnv = this.environments[index];
    this.editWizard.open();
  }
}
