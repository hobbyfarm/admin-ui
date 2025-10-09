import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';

@Component({
  selector: 'scenario-detail',
  templateUrl: './scenario-detail.component.html',
  styleUrls: ['./scenario-detail.component.scss'],
})
export class ScenarioDetailComponent implements OnInit {
  @Input()
  scenario: Scenario;

  constructor(public scenarioService: ScenarioService) {}

  ngOnInit(): void {
    this.scenarioService.get(this.scenario.id).subscribe({
      next: (S: Scenario) => {
        this.scenario = S;
      },
      error: (e: HttpErrorResponse) => {
        console.log(e);
      },
    });
  }
}
