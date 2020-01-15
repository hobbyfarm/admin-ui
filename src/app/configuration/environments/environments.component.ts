import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from 'src/app/data/environment.service';
import { Environment } from 'src/app/data/environment';

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

  ngOnInit() {
    this.refresh();
  }


  public refresh() {
    this.environmentService.list()
    .subscribe(
      (e: Environment[]) => this.environments = e
    )
  }
}
