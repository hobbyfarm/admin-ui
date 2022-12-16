import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin, { Context } from 'chartjs-plugin-datalabels';
import { Progress } from '../data/progress';
import { ProgressService } from '../data/progress.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';
import { ClrDatagridSortOrder, ClrForm, ClrSignpostContent } from '@clr/angular';
import '../date.extension';

// The number of milliseconds in one day
const ONE_DAY = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public startView: 'minute' | 'day' | 'month' | 'year' = 'day';
  public minView: 'minute' | 'day' | 'month' | 'year' = 'day';
  public options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  public startDate = new Date(Date.now() - 7 * ONE_DAY);
  public endDate: Date;
  public chartDetails: FormGroup;
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
      beforeInit: function (chart) {
        // Get reference to the original fit function
        const originalFit = chart.legend.fit;

        // Override the fit function
        chart.legend.fit = function fit() {
          // Call original function and bind scope in order to use `this` correctly inside it
          originalFit.bind(chart.legend)();
          // Change the height as suggested in another answers
          this.height += 20;
        };
      },
    },
  ];
  public scenariosWithSession: string[] = [];
  public totalSessionsPerScenario: Map<string, number> = new Map();
  public ascSort = ClrDatagridSortOrder.ASC;

  constructor(
    public progressService: ProgressService,
    private _fb: FormBuilder
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

    this.chartDetails = this._fb.group(
      {
        observationPeriod: ['daily', [Validators.required]],
        startDate: [
          this.startDate.toLocaleDateString('en-US', this.options),
          [Validators.required, this.validateStartDate()],
        ],
        endDate: [
          this.endDate.toLocaleDateString('en-US', this.options),
          [Validators.required],
        ],
      },
      {
        validators: [this.validateForm()],
      }
    );

    this.updateLabels('daily');
    this.updateData('daily');

    this.chartDetails
      .get('observationPeriod')
      .valueChanges.subscribe((obsPeriod: 'daily' | 'weekly' | 'monthly') => {
        this.updateOnObservationChange(obsPeriod);
        this.updateLabels(obsPeriod);
        this.updateData(obsPeriod);
      });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('startDateSignpost') startDateSignpost: ClrSignpostContent;
  @ViewChild('endDateSignpost') endDateSignpost: ClrSignpostContent;
  @ViewChild(ClrForm, { static: true }) clrForm: ClrForm;

  // TODO: Validate start time
  private validateStartDate(): ValidatorFn {
    return (control: AbstractControl) => {
      // Check if Date is in the past
      const dateString = control.value;
      const startDate = new Date(dateString);
      console.log('This is the created startDate: ', startDate);
      const currentDate = new Date();
      if (currentDate < startDate) {
        console.log('validation failed!!!');
        return {
          startDateIsInFuture: true,
        };
      }
      return null;
    };
  }

  private validateForm(): ValidatorFn {
    return (fg: AbstractControl) => {
      // Check if Date is in the past
      const startDateString = fg.get('startDate').value;
      const startDate = new Date(startDateString);
      const endDateString = fg.get('endDate').value;
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
        this.updateTotalSessions();
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
      this.chartDetails
        .get('startDate')
        .setValue(this.startDate.toLocaleDateString('en-US', this.options));
      this.chartDetails
        .get('endDate')
        .setValue(this.endDate.toLocaleDateString('en-US', this.options));
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
      this.chartDetails
        .get('startDate')
        .setValue(this.startDate.toLocaleDateString('en-US', this.options));
      this.chartDetails
        .get('endDate')
        .setValue(this.endDate.toLocaleDateString('en-US', this.options));
      this.startView = 'month';
      this.minView = 'month';
    }
  }

  public setStartDate(d: DlDateTimePickerChange<Date>) {
    this.startDate = d.value;
    this.chartDetails
      .get('startDate')
      .setValue(this.startDate.toLocaleDateString('en-US', this.options));
    this.clrForm.markAsTouched();
    const observationPeriod: 'daily' | 'weekly' | 'monthly' =
      this.chartDetails.get('observationPeriod').value;
    this.updateLabels(observationPeriod);
    this.updateData(observationPeriod);
    this.startDateSignpost.close();
  }

  public setEndDate(d: DlDateTimePickerChange<Date>) {
    const observationPeriod: 'daily' | 'weekly' | 'monthly' =
      this.chartDetails.get('observationPeriod').value;
    if (observationPeriod != 'monthly') {
      this.endDate = d.value;
    } else {
      this.endDate = new Date(d.value.getFullYear(), d.value.getMonth() + 1, 0);
    }
    this.endDate.setHours(23, 59, 59, 999);
    this.updateLabels(observationPeriod);
    this.updateData(observationPeriod);
    this.chartDetails
      .get('endDate')
      .setValue(this.endDate.toLocaleDateString('en-US', this.options));
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

  private prepareBarchartDatasets() {
    this.barChartData.datasets.length = 0;
    this.scenariosWithSession.forEach((sWithSession: string) => {
      this.barChartData.datasets.push({
        data: Array.from<number>({
          length: this.barChartData.labels.length,
        }).fill(0),
        label: sWithSession,
        stack: 'a',
      });
    });
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
    progressData.forEach((prog: Progress) => {
      const index = getIndex(prog);
      (this.barChartData.datasets[
        this.scenariosWithSession.indexOf(prog.scenario_name)
      ].data[index] as number) += 1;
    });
  }

  private updateTotalSessions() {
    this.totalSessionsPerScenario.clear();
    this.barChartData.datasets.forEach((dataSet) => {
      const tempTotalSessions = (dataSet.data as number[]).reduce(
        (partialSum, i) => partialSum + i,
        0
      );
      this.totalSessionsPerScenario.set(dataSet.label, tempTotalSessions);
    });
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
