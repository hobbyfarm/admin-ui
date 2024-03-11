import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
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
    let scenarioObservable: Observable<Scenario>;
    scenarioObservable = this.scenarioService.get(this.scenario.id);
    scenarioObservable.subscribe({
      next: (S: Scenario) => {
        this.scenario = S;
      },
      error: (e: HttpErrorResponse) => {
        console.log(e);
      },
    });
  }
}
