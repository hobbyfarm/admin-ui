import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { ScenarioService } from '../data/scenario.service';

@Component({
  selector: 'app-printable',
  templateUrl: './printable.component.html',
})
export class PrintableComponent implements OnInit {
  public scenario: string = '';

  constructor(
    public route: ActivatedRoute,
    public scenarioService: ScenarioService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        take(1),
        switchMap((p: ParamMap) => {
          const scenarioId = p.get('scenario');
          if (scenarioId) {
            return this.scenarioService.printable(scenarioId);
          } else {
            throw new Error('Error: Scenario id not defined!');
          }
        }),
      )
      .subscribe({
        next: (content: string) => {
          this.scenario = content;
        },
        error: (error: HttpErrorResponse) => {
          this.scenario =
            'There was an error rendering printable scenario content: ' +
            error.message;
        },
      });
  }
}
