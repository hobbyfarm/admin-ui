import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvironmentService } from 'src/app/data/environment.service';
import { Environment } from 'src/app/data/environment';
import { NewEnvironmentComponent } from './new-environment/new-environment.component';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {
  public environments: Environment[] = [];

  constructor(
    public environmentService: EnvironmentService
  ) { }

  @ViewChild("newEnvironmentWizard", {static: true}) newWizard: NewEnvironmentComponent;

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
    this.newWizard.open();
  }
}
