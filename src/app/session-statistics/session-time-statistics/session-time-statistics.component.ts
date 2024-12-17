import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
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
import { BarChartData } from 'src/app/data/barchartdata';

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
  public stepDurationsArray: number[][];
  public stepCounts: number[];
  public avgDuration: number[] = [];
  public medianDurationPerStep: number[] = [];
  public totalDuration: number;
  public totalMedianDuration: number;

  public chartDetails: ChartDetailsFormGroup;
  public barChartData: BarChartData = {
    labels: [],
    datasets: [],
  };
  public barChartOptions: ChartConfiguration<'bar', number[], string>['options'] = {
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
          callback: function (value) {
            if(typeof value === 'string') {
              value = parseInt(value);
            }
            if(isNaN(value) || value < 0) {
              throw new Error("Error parsing value: Invalid duration")
            }
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
  public barChartPlugins = [
    DataLabelsPlugin,
    {
      id: 'legendMargin',
      beforeInit: function (chart: Chart<'bar', number[], string>) {
        if (chart.legend) {
          // Get the reference to the original fit function
          const originalFit = chart.legend.fit;

          // Override the fit function
          chart.legend.fit = function fit() {
            // Call original function and bind scope in order to use `this` correctly inside it
            originalFit.bind(chart.legend)();
            // Change the height
            this.height += 20;
          };
        }
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
    // Filter progresses based on the selected scenario
    const evaluatedProgressData = this.progresses.filter(
      (progress) => this.selectedScenario === progress.scenario
    );

    // Initialize step time and counts
    let stepTime: number[] = [];
    let stepTimes: number[][] = [];
    const stepProgressCount: number[] = [];

    evaluatedProgressData.forEach((progress) => {
      // Update step progress counts
      for (let i = 0; i < progress.max_step; i++) {
        stepProgressCount[i] = (stepProgressCount[i] || 0) + 1;
      }

      // Initialize temporary array to keep track of step times for this progress
      let stepTimeForThisProgress: number[] = [];

      // Iterate through each step in the progress
      for (let i = 1; i < progress.steps.length; i++) {
        const step = progress.steps[i].step;
        const stepStartTime = new Date(progress.steps[i].timestamp).getTime();
        const stepEndTime =
          i + 1 === progress.steps.length
            ? new Date(progress.last_update).getTime()
            : new Date(progress.steps[i + 1].timestamp).getTime();

        const duration = stepEndTime - stepStartTime;

        // Update total step time and current progress's step time
        stepTime[step - 1] = (stepTime[step - 1] || 0) + duration;
        stepTimeForThisProgress[step - 1] =
          (stepTimeForThisProgress[step - 1] || 0) + duration;
      }

      // Update step times for detailed duration tracking
      stepTimeForThisProgress.forEach((time, index) => {
        if (time !== undefined) {
          if (stepTimes[index]) {
            stepTimes[index].push(time);
          } else {
            stepTimes[index] = [time];
          }
        }
      });
    });

    // Sort all step times to prepare for median or other statistical analysis
    stepTimes = stepTimes.map((times) =>
      times ? times.sort((a, b) => a - b) : []
    );

    // Assign processed data to the object's properties
    this.stepCounts = stepProgressCount;
    this.stepDurations = stepTime;
    this.stepDurationsArray = stepTimes;

    // Calculate average durations and total duration
    this.avgDuration = this.stepDurations.map((duration, i) =>
      Math.round(duration / this.stepCounts[i] / 1000)
    );
    this.totalDuration = this.avgDuration.reduce(
      (acc, duration) => acc + duration,
      0
    );

    // Calculate the median duration for each step and sum them
    let totalMedianDuration = 0;
    let medianDurationPerStep = stepTimes.map((times) => {
      if (times.length === 0) return 0;
      const mid = Math.floor(times.length / 2);
      return times[mid];
    });

    // Summing the median durations for the total
    totalMedianDuration = medianDurationPerStep.reduce(
      (acc, median) => acc + median,
      0
    );

    // Convert to seconds
    this.totalMedianDuration = totalMedianDuration / 1000; // Convert to seconds

    // Store median durations per step in seconds for any further needs
    this.medianDurationPerStep = medianDurationPerStep.map(
      (median) => median / 1000
    );

    // Final processing step
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
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
  }

  private prepareBarchartDatasets() {
    this.barChartData.datasets.length = 0;
    this.barChartData.datasets.push({
      data: Array.from<number>({
        length: this.barChartData.labels.length,
      }).fill(0),
      label: 'Average',
      stack: 'a',
    });
    this.barChartData.datasets.push({
      data: Array.from<number>({
        length: this.barChartData.labels.length,
      }).fill(0),
      label: 'Median',
      stack: 'b',
    });
  }

  private updateBarchartData() {
    if (this.barChartData.datasets.length === 0) {
      // there are no scenarios selected and there is nothing to add ... so return!
      return;
    }

    this.barChartData.datasets[0].data = this.avgDuration;
    this.barChartData.datasets[1].data = this.medianDurationPerStep;

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

  public getFormattedMedianOfStep(stepIndex: number) {
    return this.formatDuration(this.medianDurationPerStep[stepIndex]);
  }
}
