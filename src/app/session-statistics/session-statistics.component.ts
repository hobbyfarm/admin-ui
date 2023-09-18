import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartType,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin, { Context } from 'chartjs-plugin-datalabels';
import { Progress } from '../data/progress';
import { ProgressService } from '../data/progress.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  UntypedFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';
import { ClrDatagridSortOrder, ClrSignpostContent } from '@clr/angular';
import '../date.extension';

type ChartDetailsFormGroup = FormGroup<{
  observationPeriod: FormControl<'daily' | 'weekly' | 'monthly'>;
  scenarios: FormControl<string[]>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
}>;

// The number of milliseconds in one day
const ONE_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-session-statistics',
  templateUrl: './session-statistics.component.html',
  styleUrls: ['./session-statistics.component.scss'],
})
export class SessionStatisticsComponent implements OnInit {
  public startView: 'minute' | 'day' | 'month' | 'year' = 'day';
  public minView: 'minute' | 'day' | 'month' | 'year' = 'day';
  public options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  public startDate = new Date(Date.now() - 7 * ONE_DAY);
  public endDate: Date;
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
        align: 'start',
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
  public scenariosWithSession: string[] = [];
  public totalSessionsPerScenario: Map<string, number> = new Map();
  public descSort = ClrDatagridSortOrder.DESC;

  constructor(
    public progressService: ProgressService,
    private _fb: UntypedFormBuilder,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    const currentDate = new Date();
    // Set default start date to beginning of the day
    this.startDate = new Date(
      this.startDate.getFullYear(),
      this.startDate.getMonth(),
      this.startDate.getDate()
    );
    // Set default end date to end of the day
    this.endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
      999
    );

    this.chartDetails = this.fb.group(
      {
        observationPeriod: this.fb.control<'daily' | 'weekly' | 'monthly'>(
          'daily',
          Validators.required
        ),
        scenarios: this.fb.control<string[]>(
          [],
          [Validators.required, Validators.minLength(1)]
        ),
        startDate: this.fb.control<string>(
          this.startDate.toLocaleDateString('en-US', this.options),
          [Validators.required, this.validateStartDate()]
        ),
        endDate: this.fb.control<string>(
          this.endDate.toLocaleDateString('en-US', this.options),
          Validators.required
        ),
      },
      {
        validators: [this.validateForm()],
      }
    );

    this.updateLabels('daily');
    this.updateData('daily');

    this.chartDetails.controls.observationPeriod.valueChanges.subscribe(
      (obsPeriod: 'daily' | 'weekly' | 'monthly') => {
        this.updateOnObservationChange(obsPeriod);
        this.updateLabels(obsPeriod);
        this.updateData(obsPeriod);
      }
    );
    this.chartDetails.controls.scenarios.valueChanges.subscribe(
      (scenarios: string[]) => {
        const observationPeriod =
          this.chartDetails.controls.observationPeriod.value;
        let updatedScenarios: string[] = scenarios;
        if (scenarios && scenarios.length >= 2) {
          updatedScenarios = scenarios.filter(
            (scenario: string) => scenario !== '*'
          );
        }
        this.chartDetails.controls.scenarios.setValue(updatedScenarios, {
          emitEvent: false,
        });
        this.updateData(observationPeriod);
      }
    );
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('startDateSignpost') startDateSignpost: ClrSignpostContent;
  @ViewChild('endDateSignpost') endDateSignpost: ClrSignpostContent;

  public addAllScenarios(): void {
    this.chartDetails.controls.scenarios.setValue(['*']);
  }

  public clearScenarios(): void {
    this.chartDetails.controls.scenarios.reset();
  }

  private validateStartDate(): ValidatorFn {
    return (control: FormControl<string>) => {
      // Check if Date is in the past
      const dateString = control.value;
      const startDate = new Date(dateString);
      const currentDate = new Date();
      if (currentDate < startDate) {
        return {
          startDateIsInFuture: true,
        };
      }
      return null;
    };
  }

  private validateForm(): ValidatorFn {
    return (fg: ChartDetailsFormGroup) => {
      // Check if Date is in the past
      const startDateString = fg.controls.startDate.value;
      const startDate = new Date(startDateString);
      const endDateString = fg.controls.endDate.value;
      const endDate = new Date(endDateString);
      if (endDate < startDate) {
        return {
          endDateLowerThanStartDate: true,
        };
      }
      return null;
    };
  }

  private updateData(observationPeriod: 'daily' | 'weekly' | 'monthly') {
    this.progressService
      .listByRange(this.startDate, this.endDate)
      .subscribe((progress: Progress[]) => {
        this.setupScenariosWithSessions(progress);
        this.prepareBarchartDatasets();
        if (observationPeriod == 'weekly') {
          this.updateBarchartData(progress, this.getWeekDataIndex);
        } else {
          this.updateBarchartData(progress, this.getDayOrMonthDataIndex);
        }
        this.updateTotalSessions(progress);
        this.chart?.update();
      });
  }

  private updateLabels(observationPeriod: 'daily' | 'weekly' | 'monthly') {
    switch (observationPeriod) {
      case 'daily':
        this.updateDayLabels();
        break;
      case 'weekly':
        this.updateWeekLabels();
        break;
      case 'monthly':
        this.updateMonthLabels();
        break;
    }
  }

  private updateOnObservationChange(
    observationPeriod: 'daily' | 'weekly' | 'monthly'
  ) {
    if (observationPeriod != 'monthly') {
      this.options = { year: 'numeric', month: 'long', day: 'numeric' };
      this.chartDetails.controls.startDate.setValue(
        this.startDate.toLocaleDateString('en-US', this.options)
      );
      this.chartDetails.controls.endDate.setValue(
        this.endDate.toLocaleDateString('en-US', this.options)
      );
      this.startView = 'day';
      this.minView = 'day';
    } else {
      this.options = { year: 'numeric', month: 'long' };
      this.startDate = new Date(
        this.startDate.getFullYear(),
        this.startDate.getMonth(),
        1
      );
      this.endDate = new Date(
        this.endDate.getFullYear(),
        this.endDate.getMonth() + 1,
        0
      );
      this.chartDetails.controls.startDate.setValue(
        this.startDate.toLocaleDateString('en-US', this.options)
      );
      this.chartDetails.controls.endDate.setValue(
        this.endDate.toLocaleDateString('en-US', this.options)
      );
      this.startView = 'month';
      this.minView = 'month';
    }
  }

  public setStartDate(d: DlDateTimePickerChange<Date>) {
    this.startDate = d.value;
    this.chartDetails.controls.startDate.setValue(
      this.startDate.toLocaleDateString('en-US', this.options)
    );
    const observationPeriod: 'daily' | 'weekly' | 'monthly' =
      this.chartDetails.controls.observationPeriod.value;
    this.updateLabels(observationPeriod);
    this.updateData(observationPeriod);
    this.startDateSignpost.close();
  }

  public setEndDate(d: DlDateTimePickerChange<Date>) {
    const observationPeriod: 'daily' | 'weekly' | 'monthly' =
      this.chartDetails.controls.observationPeriod.value;
    if (observationPeriod != 'monthly') {
      this.endDate = d.value;
    } else {
      this.endDate = new Date(d.value.getFullYear(), d.value.getMonth() + 1, 0);
    }
    this.endDate.setHours(23, 59, 59, 999);
    this.updateLabels(observationPeriod);
    this.updateData(observationPeriod);
    this.chartDetails.controls.endDate.setValue(
      this.endDate.toLocaleDateString('en-US', this.options)
    );
    this.endDateSignpost.close();
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

  private setupScenariosWithSessions(progressData: Progress[]) {
    this.scenariosWithSession = [];
    progressData.forEach((prog: Progress) => {
      if (!this.scenariosWithSession.includes(prog.scenario_name)) {
        this.scenariosWithSession.push(prog.scenario_name);
      }
    });
  }

  private allScenariosSelected(): boolean {
    const selectedScenarios = this.chartDetails.controls.scenarios.value;
    return selectedScenarios.length === 1 && selectedScenarios[0] === '*';
  }

  private prepareBarchartDatasets() {
    this.barChartData.datasets.length = 0;
    const selectedScenarios = this.chartDetails.controls.scenarios.value;
    if (this.allScenariosSelected()) {
      this.scenariosWithSession.forEach((sWithSession: string) => {
        this.barChartData.datasets.push({
          data: Array.from<number>({
            length: this.barChartData.labels.length,
          }).fill(0),
          label: sWithSession,
          stack: 'a',
        });
      });
    } else if (selectedScenarios.length >= 1) {
      selectedScenarios.forEach((sWithSession: string) => {
        this.barChartData.datasets.push({
          data: Array.from<number>({
            length: this.barChartData.labels.length,
          }).fill(0),
          label: sWithSession,
          stack: 'a',
        });
      });
    }
  }

  // Info: We need to use an arrow function here to access class variables defined in the parent's scope (with "this")
  // ... because this function is used as a parameter within another function
  private getWeekDataIndex = (prog: Progress) => {
    const startDate = new Date(prog.started);
    const index = this.barChartData.labels.indexOf(
      `W${startDate.getWeek()}-${startDate.getWeekYear()}`
    );
    return index;
  };

  // Info: We need to use an arrow function here to access class variables defined in the parent's scope (with "this")
  // ... because this function is used as a parameter within another function
  private getDayOrMonthDataIndex = (prog: Progress) => {
    const startDateString = new Date(prog.started).toLocaleDateString(
      'en-US',
      this.options
    );
    const index = this.barChartData.labels.indexOf(startDateString);
    return index;
  };

  private updateBarchartData(
    progressData: Progress[],
    getIndex: (prog: Progress) => number
  ) {
    if (this.barChartData.datasets.length === 0) {
      // there are no scenarios selected and there is nothing to add ... so return!
      return;
    }
    let evaluatedProgressData: Progress[] = progressData;
    let selectedScenarios: string[] = this.scenariosWithSession;
    if (!this.allScenariosSelected()) {
      selectedScenarios = this.chartDetails.controls.scenarios.value;
      evaluatedProgressData = progressData.filter((progress: Progress) =>
        selectedScenarios.includes(progress.scenario_name)
      );
    }
    evaluatedProgressData.forEach((prog: Progress) => {
      const index = getIndex(prog);
      (this.barChartData.datasets[selectedScenarios.indexOf(prog.scenario_name)]
        .data[index] as number) += 1;
    });
  }

  private updateTotalSessions(progressData: Progress[]) {
    this.totalSessionsPerScenario.clear();
    this.totalSessionsPerScenario = progressData.reduce(
      (totalSessions, progress) => {
        const partialSum = totalSessions.get(progress.scenario_name) ?? 0;
        totalSessions.set(progress.scenario_name, partialSum + 1);
        return totalSessions;
      },
      new Map<string, number>()
    );
  }

  // Info: Labels are not getting updated before calling this.chart.update()
  private updateDayLabels() {
    // We need to keep the same reference for our label array, otherwise label data is not updated correctly -> hence set length to 0
    this.barChartData.labels.length = 0;
    for (
      let labelDate = new Date(this.startDate);
      labelDate <= this.endDate;
      labelDate.setDate(labelDate.getDate() + 1)
    ) {
      const labelDateString = labelDate.toLocaleDateString(
        'en-US',
        this.options
      );
      this.barChartData.labels.push(labelDateString);
    }
  }

  // Info: Labels are not getting updated before calling this.chart.update()
  private updateWeekLabels() {
    // We need to keep the same reference for our label array, otherwise label data is not updated correctly -> hence set length to 0
    this.barChartData.labels.length = 0;
    this.barChartData.labels.push(
      `W${this.startDate.getWeek()}-${this.startDate.getWeekYear()}`
    );
    for (
      let nextMonday = this.startDate.getNextMonday();
      nextMonday <= this.endDate;
      nextMonday.setDate(nextMonday.getDate() + 7)
    ) {
      this.barChartData.labels.push(
        `W${nextMonday.getWeek()}-${nextMonday.getWeekYear()}`
      );
    }
  }

  // Info: Labels are not getting updated before calling this.chart.update()
  private updateMonthLabels() {
    // We need to keep the same reference for our label array, otherwise label data is not updated correctly -> hence set length to 0
    this.barChartData.labels.length = 0;
    for (
      let labelDate = new Date(this.startDate);
      labelDate <= this.endDate;
      labelDate.setMonth(labelDate.getMonth() + 1)
    ) {
      const labelDateString = labelDate.toLocaleDateString(
        'en-US',
        this.options
      );
      this.barChartData.labels.push(labelDateString);
    }
  }
}
