import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin, { Context } from 'chartjs-plugin-datalabels';
import { Progress } from '../../data/progress';
import { ProgressService } from '../../data/progress.service';
import { durationFormatter } from '../../utils';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { deepCopy } from 'src/app/deepcopy';

type ChartDetailsFormGroup = FormGroup<{
  scenario: FormControl<string>;
}>;

@Component({
  selector: 'app-session-time-statistics',
  templateUrl: './session-time-statistics.component.html',
  styleUrls: ['./session-time-statistics.component.scss'],
})
export class SessionTimeStatisticsComponent implements OnInit {
  // If no scheduledEvent is given, we display statistics about all progresses for a given time range
  // If a scheduledEvent is given, we display statistics about all progresses from this scheduledEvent
  @Input()
  public progresses: Progress[];

  @Input()
  public scenariosWithSessionMap: Map<string, string>; //Maps the scenario id to the name

  public selectedScenario: string;

  public stepDurations: number[];
  public stepCounts: number[];
  public avgDuration: number[];
  public totalDuration: number;

  public chartDetails: ChartDetailsFormGroup;
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        ticks: {
          precision: 0,
          stepSize: 60,
          maxTicksLimit: 10,
          callback: function (value: number, index, ticks) {
            // Format y-axis labels to time string
            return durationFormatter(value);
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        // only display datalabels if != 0
        display: (context: Context) => {
          return context.dataset.data[context.dataIndex] != 0;
        },
        anchor: 'end',
        align: 'end',
        formatter: function (duration: number, context) {
          return durationFormatter(duration);
        },
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin,
    {
      id: 'legendMargin',
      // chart is of type Chart<'bar'>. However, we are forced to use chart.js version 3.4.0 because it is used by ng2-charts as peer dependency.
      // And the "legend" property is not defined in the type definitions of this version.

      // We can not upgrade ng2-charts (and so its peer dependency) yet because it requires Angular 14.
      beforeInit: function (chart: any) {
        // Get the reference to the original fit function
        const originalFit = (chart.legend as any).fit;

        // Override the fit function
        (chart.legend as any).fit = function fit() {
          // Call original function and bind scope in order to use `this` correctly inside it
          originalFit.bind(chart.legend)();
          // Change the height
          this.height += 20;
        };
      },
    },
  ];

  constructor(
    public progressService: ProgressService,
    private _fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    const firstScenario =
      this.scenariosWithSessionMap?.keys().next().value ?? '';
    this.chartDetails = this._fb.group({
      scenario: this._fb.control<string>(firstScenario, [
        Validators.required,
        Validators.minLength(1),
      ]),
    });

    this.selectedScenario = firstScenario;
    this.updateData();

    this.chartDetails.controls.scenario.valueChanges.subscribe(
      (scenario: string) => {
        this.chartDetails.controls.scenario.setValue(scenario, {
          emitEvent: false,
        });
        this.selectedScenario = scenario;
        this.updateData();
      }
    );
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public clearScenarios(): void {
    this.chartDetails.controls.scenario.reset();
  }

  private updateData() {
    const evaluatedProgressData = this.progresses.filter(
      (progress: Progress) => this.selectedScenario == progress.scenario
    );

    // TODO calculate data
    let stepTime = [];
    let stepProgressCount = [];

    evaluatedProgressData.forEach((p) => {
      // Increase the count of progresses that have been to this step
      for (let i = 0; i < p.max_step; i++) {
        if (stepProgressCount[i]) {
          stepProgressCount[i]++;
        } else {
          stepProgressCount[i] = 1;
        }
      }

      for (let i = 1; i < p.steps.length; i++) {
        const step = p.steps[i].step;
        let step_end_time;
        if (i + 1 == p.steps.length) {
          // This is the last step entry, we take the last update time to calculate the duration
          step_end_time = p.last_update;
        } else {
          // Normal case is to take the next step entry
          step_end_time = p.steps[i + 1].timestamp;
        }

        let duration =
          new Date(step_end_time).getTime() -
          new Date(p.steps[i].timestamp).getTime();

        if (stepTime[step - 1]) {
          stepTime[step - 1] += duration;
        } else {
          stepTime[step - 1] = duration;
        }
      }
    });

    this.stepCounts = stepProgressCount;
    this.stepDurations = stepTime;
    this.avgDuration = [];
    this.totalDuration = 0;

    for (let i = 0; i < this.stepDurations.length; i++) {
      const avgStepDurationInSeconds = Math.round(
        this.stepDurations[i] / this.stepCounts[i] / 1000
      );
      this.avgDuration.push(avgStepDurationInSeconds);
      this.totalDuration += avgStepDurationInSeconds;
    }

    this.processData();
  }

  private processData() {
    this.prepareBarchartDatasets();
    this.updateBarchartData();
    this.chart?.update();
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    // console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    // console.log(event, active);
  }

  private prepareBarchartDatasets() {
    this.barChartData.datasets.length = 0;
    this.barChartData.datasets.push({
      data: Array.from<number>({
        length: this.barChartData.labels.length,
      }).fill(0),
      label: this.scenariosWithSessionMap.get(this.selectedScenario),
      stack: 'a',
    });
  }

  private updateBarchartData() {
    if (this.barChartData.datasets.length === 0) {
      // there are no scenarios selected and there is nothing to add ... so return!
      return;
    }

    this.barChartData.datasets[0].data = this.avgDuration;

    this.updateLabels();
  }

  // Info: Labels are not getting updated before calling this.chart.update()
  private updateLabels() {
    // We need to keep the same reference for our label array, otherwise label data is not updated correctly -> hence set length to 0
    this.barChartData.labels.length = 0;
    for (let i = 0; i < this.avgDuration.length; i++) {
      this.barChartData.labels.push('Step ' + (i + 1));
    }
  }

  public formatDuration(duration: number) {
    return durationFormatter(duration);
  }

  public getNumberOfSessionsForStep(stepIndex: number) {
    return this.stepCounts[stepIndex] ?? '-';
  }
}
