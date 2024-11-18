import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartEvent,
  ChartType,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin, { Context } from 'chartjs-plugin-datalabels';
import { Progress } from '../data/progress';
import { ProgressService } from '../data/progress.service';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';
import { ClrDatagridSortOrder, ClrSignpostContent } from '@clr/angular';
import '../date.extension';
import { ScheduledEvent } from '../data/scheduledevent';
import { ChartDetailsFormGroup, isChartDetailsFormGroup } from '../data/forms';
import { BarChartData } from '../data/barchartdata';

// The number of milliseconds in one day
const ONE_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-session-statistics',
  templateUrl: './session-statistics.component.html',
  styleUrls: ['./session-statistics.component.scss'],
})
export class SessionStatisticsComponent implements OnInit, OnChanges {
  // If no scheduledEvent is given, we display statistics about all progresses for a given time range
  // If a scheduledEvent is given, we display statistics about all progresses from this scheduledEvent
  @Input()
  public scheduledEvent: ScheduledEvent;

  public currentScheduledEvent: ScheduledEvent;

  public progressesCache: Progress[] | null;

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
  public scenariosWithSessionMap: Map<string, string> = new Map(); // Maps the id to the name
  public totalSessionsPerScenario: Map<string, number> = new Map();
  public descSort = ClrDatagridSortOrder.DESC;

  constructor(
    public progressService: ProgressService,
    private _fb: NonNullableFormBuilder,
  ) {}

  ngOnChanges(): void {
    if (
      this.scheduledEvent != this.currentScheduledEvent &&
      this.currentScheduledEvent
    ) {
      this.currentScheduledEvent = this.scheduledEvent;
      this.progressesCache = null; // Reset cache so data from the changed SE can be retreived
      this.scenariosWithSessionMap = new Map();
      this.totalSessionsPerScenario = new Map();
      this.chartDetails.controls.scenarios.setValue(['*']);
      this.setDatesToScheduledEvent(
        this.scheduledEvent,
        this.chartDetails.controls.observationPeriod.value,
      );
      this.updateData(this.chartDetails.controls.observationPeriod.value);
    }
  }

  ngOnInit(): void {
    this.currentScheduledEvent = this.scheduledEvent;

    const currentDate = new Date();
    // Set default start date to beginning of the day
    this.startDate = new Date(
      this.startDate.getFullYear(),
      this.startDate.getMonth(),
      this.startDate.getDate(),
    );
    // Set default end date to end of the day
    this.endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
      999,
    );

    this.chartDetails = this._fb.group(
      {
        observationPeriod: this._fb.control<'daily' | 'weekly' | 'monthly'>(
          'daily',
          Validators.required,
        ),
        scenarios: this._fb.control<string[]>(
          ['*'],
          [Validators.required, Validators.minLength(1)],
        ),
        startDate: this._fb.control<string>(
          this.startDate.toLocaleDateString('en-US', this.options),
          [Validators.required, this.validateStartDate()],
        ),
        endDate: this._fb.control<string>(
          this.endDate.toLocaleDateString('en-US', this.options),
          Validators.required,
        ),
      },
      {
        validators: this.validateForm,
      },
    );

    if (this.scheduledEvent) {
      this.setDatesToScheduledEvent(this.scheduledEvent, 'daily');
    }

    this.updateLabels('daily');
    this.updateData('daily');

    this.chartDetails.controls.observationPeriod.valueChanges.subscribe(
      (obsPeriod: 'daily' | 'weekly' | 'monthly') => {
        this.updateOnObservationChange(obsPeriod);
        this.updateLabels(obsPeriod);
        this.updateData(obsPeriod);
      },
    );
    this.chartDetails.controls.scenarios.valueChanges.subscribe(
      (scenarios: string[]) => {
        const observationPeriod =
          this.chartDetails.controls.observationPeriod.value;
        let updatedScenarios: string[] = scenarios;
        if (scenarios && scenarios.length >= 2) {
          updatedScenarios = scenarios.filter(
            (scenario: string) => scenario !== '*',
          );
        }
        this.chartDetails.controls.scenarios.setValue(updatedScenarios, {
          emitEvent: false,
        });
        this.updateData(observationPeriod);
      },
    );
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('startDateSignpost') startDateSignpost: ClrSignpostContent;
  @ViewChild('endDateSignpost') endDateSignpost: ClrSignpostContent;

  public addAllScenarios(): void {
    this.chartDetails.controls.scenarios.setValue(['*']);
  }

  public clearScenarios(): void {
    this.chartDetails.controls.scenarios.setValue(['*']);
  }

  private validateStartDate(): ValidatorFn {
    return (control: AbstractControl<string>) => {
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

  private validateForm(fg: AbstractControl): {
    controlTypeMismatch?: string;
    endDateLowerThanStartDate?: boolean;
  } | null {
    if (!isChartDetailsFormGroup(fg)) {
      return {
        controlTypeMismatch: 'Expected ChartDetailsFormGroup',
      };
    }
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
  }

  private setDatesToScheduledEvent(
    se: ScheduledEvent,
    observationPeriod: 'daily' | 'weekly' | 'monthly',
  ) {
    const currentDate = new Date();

    // Set default start date to beginning of the scheduledEvent
    this.startDate = se.start_time;

    // Set default end date to scheduled event end date OR the current date if it is before the SE end date
    if (se.end_time < currentDate) {
      this.endDate = se.end_time;
    } else {
      this.endDate = currentDate;
    }

    this.chartDetails.controls.endDate.setValue(
      this.endDate.toLocaleDateString('en-US', this.options),
    );
    this.chartDetails.controls.startDate.setValue(
      this.startDate.toLocaleDateString('en-US', this.options),
    );
    this.updateLabels(observationPeriod);
  }

  private updateData(observationPeriod: 'daily' | 'weekly' | 'monthly') {
    if (this.scheduledEvent) {
      this.updateDataByScheduledEvent(observationPeriod);
    } else {
      this.updateDataByRange(observationPeriod);
    }
  }

  private updateDataByRange(observationPeriod: 'daily' | 'weekly' | 'monthly') {
    this.progressService
      .listByRange(this.startDate, this.endDate)
      .subscribe((progresses: Progress[]) => {
        this.progressesCache = progresses;
        this.processData(progresses, observationPeriod);
      });
  }

  private updateDataByScheduledEvent(
    observationPeriod: 'daily' | 'weekly' | 'monthly',
  ) {
    if (this.progressesCache) {
      this.processData(this.progressesCache, observationPeriod);
    } else {
      this.progressService
        .listByScheduledEvent(this.scheduledEvent.id, true)
        .subscribe((progresses: Progress[]) => {
          this.progressesCache = progresses;
          this.processData(this.progressesCache, observationPeriod);
        });
    }
  }

  private processData(
    progresses: Progress[],
    observationPeriod: 'daily' | 'weekly' | 'monthly',
  ) {
    this.setupScenariosWithSessions(progresses);
    this.prepareBarchartDatasets();
    if (observationPeriod == 'weekly') {
      this.updateBarchartData(progresses, this.getWeekDataIndex);
    } else {
      this.updateBarchartData(progresses, this.getDayOrMonthDataIndex);
    }
    this.updateTotalSessions(progresses);
    this.chart?.update();
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
    observationPeriod: 'daily' | 'weekly' | 'monthly',
  ) {
    if (observationPeriod != 'monthly') {
      this.options = { year: 'numeric', month: 'long', day: 'numeric' };
      this.chartDetails.controls.startDate.setValue(
        this.startDate.toLocaleDateString('en-US', this.options),
      );
      this.chartDetails.controls.endDate.setValue(
        this.endDate.toLocaleDateString('en-US', this.options),
      );
      this.startView = 'day';
      this.minView = 'day';
    } else {
      this.options = { year: 'numeric', month: 'long' };
      this.startDate = new Date(
        this.startDate.getFullYear(),
        this.startDate.getMonth(),
        1,
      );
      this.endDate = new Date(
        this.endDate.getFullYear(),
        this.endDate.getMonth() + 1,
        0,
      );
      this.chartDetails.controls.startDate.setValue(
        this.startDate.toLocaleDateString('en-US', this.options),
      );
      this.chartDetails.controls.endDate.setValue(
        this.endDate.toLocaleDateString('en-US', this.options),
      );
      this.startView = 'month';
      this.minView = 'month';
    }
  }

  private updateStartDate(d: Date) {
    this.startDate = d;
    this.chartDetails.controls.startDate.setValue(
      this.startDate.toLocaleDateString('en-US', this.options),
    );
    const observationPeriod: 'daily' | 'weekly' | 'monthly' =
      this.chartDetails.controls.observationPeriod.value;
    this.updateLabels(observationPeriod);
    this.updateData(observationPeriod);
  }

  public setStartDate(d: DlDateTimePickerChange<Date>) {
    this.updateStartDate(d.value);
    if (this.startDateSignpost) {
      this.startDateSignpost.close();
    }
  }

  private updateEndDate(d: Date) {
    const observationPeriod: 'daily' | 'weekly' | 'monthly' =
      this.chartDetails.controls.observationPeriod.value;
    if (observationPeriod != 'monthly') {
      this.endDate = d;
    } else {
      this.endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }
    this.endDate.setHours(23, 59, 59, 999);
    this.updateLabels(observationPeriod);
    this.updateData(observationPeriod);
    this.chartDetails.controls.endDate.setValue(
      this.endDate.toLocaleDateString('en-US', this.options),
    );
  }

  public setEndDate(d: DlDateTimePickerChange<Date>) {
    this.updateEndDate(d.value);
    if (this.endDateSignpost) {
      this.endDateSignpost.close();
    }
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
    this.scenariosWithSessionMap = new Map();
    progressData.forEach((prog: Progress) => {
      this.scenariosWithSessionMap.set(prog.scenario, prog.scenario_name);
    });
  }

  private allScenariosSelected(): boolean {
    const selectedScenarios = this.chartDetails.controls.scenarios.value;
    return (
      !selectedScenarios ||
      (selectedScenarios.length === 1 && selectedScenarios[0] === '*')
    );
  }

  private prepareBarchartDatasets() {
    this.barChartData.datasets.length = 0;
    const selectedScenarios = this.chartDetails.controls.scenarios.value;
    if (this.allScenariosSelected()) {
      this.scenariosWithSessionMap.forEach((sWithSession: string) => {
        this.barChartData.datasets.push({
          data: Array.from<number>({
            length: this.barChartData.labels.length,
          }).fill(0),
          label: this.getScenarioName(sWithSession),
          stack: 'a',
        });
      });
    } else if (selectedScenarios.length >= 1) {
      selectedScenarios.forEach((sWithSession: string) => {
        this.barChartData.datasets.push({
          data: Array.from<number>({
            length: this.barChartData.labels.length,
          }).fill(0),
          label: this.getScenarioName(sWithSession),
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
      `W${startDate.getWeek()}-${startDate.getWeekYear()}`,
    );
    return index;
  };

  // Info: We need to use an arrow function here to access class variables defined in the parent's scope (with "this")
  // ... because this function is used as a parameter within another function
  private getDayOrMonthDataIndex = (prog: Progress) => {
    const startDateString = new Date(prog.started).toLocaleDateString(
      'en-US',
      this.options,
    );
    const index = this.barChartData.labels.indexOf(startDateString);
    return index;
  };

  private updateBarchartData(
    progressData: Progress[],
    getIndex: (prog: Progress) => number,
  ) {
    if (this.barChartData.datasets.length === 0) {
      // there are no scenarios selected and there is nothing to add ... so return!
      return;
    }
    let evaluatedProgressData: Progress[] = progressData;
    let selectedScenarios: string[] = Array.from(
      this.scenariosWithSessionMap.keys(),
    );
    if (!this.allScenariosSelected()) {
      selectedScenarios = this.chartDetails.controls.scenarios.value;
      evaluatedProgressData = progressData.filter((progress: Progress) =>
        selectedScenarios.includes(progress.scenario),
      );
    }
    evaluatedProgressData.forEach((prog: Progress) => {
      const index = getIndex(prog);
      (this.barChartData.datasets[selectedScenarios.indexOf(prog.scenario)]
        .data[index] as number) += 1;
    });
  }

  private updateTotalSessions(progressData: Progress[]) {
    this.totalSessionsPerScenario.clear();
    progressData = progressData.filter(
      (progress: Progress) =>
        progress.started >= this.startDate &&
        progress.last_update < this.endDate,
    );
    this.totalSessionsPerScenario = progressData.reduce(
      (totalSessions, progress) => {
        const partialSum = totalSessions.get(progress.scenario) ?? 0;
        totalSessions.set(progress.scenario, partialSum + 1);
        return totalSessions;
      },
      new Map<string, number>(),
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
        this.options,
      );
      this.barChartData.labels.push(labelDateString);
    }
  }

  // Info: Labels are not getting updated before calling this.chart.update()
  private updateWeekLabels() {
    // We need to keep the same reference for our label array, otherwise label data is not updated correctly -> hence set length to 0
    this.barChartData.labels.length = 0;
    this.barChartData.labels.push(
      `W${this.startDate.getWeek()}-${this.startDate.getWeekYear()}`,
    );
    for (
      let nextMonday = this.startDate.getNextMonday();
      nextMonday <= this.endDate;
      nextMonday.setDate(nextMonday.getDate() + 7)
    ) {
      this.barChartData.labels.push(
        `W${nextMonday.getWeek()}-${nextMonday.getWeekYear()}`,
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
        this.options,
      );
      this.barChartData.labels.push(labelDateString);
    }
  }

  public getScenarioName(scenarioId: string) {
    return this.scenariosWithSessionMap.get(scenarioId) ?? scenarioId;
  }
}
