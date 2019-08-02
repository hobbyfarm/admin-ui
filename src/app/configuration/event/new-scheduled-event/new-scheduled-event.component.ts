import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import { EnvironmentService } from 'src/app/data/environment.service';
import { switchMap, combineAll, concatMap, tap, map, filter } from 'rxjs/operators';
import { Environment } from 'src/app/data/environment';
import { from, of } from 'rxjs';
import { EnvironmentAvailability } from 'src/app/data/environmentavailability';
import { forEach } from '@angular/router/src/utils/collection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';

@Component({
  selector: 'new-scheduled-event',
  templateUrl: './new-scheduled-event.component.html',
  styleUrls: ['./new-scheduled-event.component.scss']
})
export class NewScheduledEventComponent implements OnInit {
  public wzOpen: boolean = false;
  public se: ScheduledEvent = new ScheduledEvent();
  public scenarios: Scenario[] = [];

  public saving: boolean = false;

  public tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  public times: string[] = [];

  public availableEnvironments: EnvironmentAvailability[] = [];
  public checkingEnvironments: boolean = true;
  public environments: Environment[] = [];
  public keyedEnvironments: Map<string, Environment> = new Map();
  public selectedEnvironments: EnvironmentAvailability[] = [];

  public startDate: string;
  public endDate: string;
  public startTime: string;
  public endTime: string;

  public vmtotals: Map<string, number> = new Map();

  public selectedscenarios: Scenario[] = [];

  constructor(
    public ss: ScenarioService,
    public ses: ScheduledeventService,
    public es: EnvironmentService
  ) { }

  @ViewChild("wizard") wizard: ClrWizard;

  public scenariosSelected(s: Scenario[]) {
    this.se.scenarios = [];
    s.forEach(
      (sc: Scenario) => this.se.scenarios.push(sc.id)
    )
  }

  public getTemplates(env: string) {
    return Object.keys(this.keyedEnvironments.get(env).template_mapping);
  }

  public getTotals() {
    return Object.entries(this.vmtotals);
  }

  public setVMCount(env: string, template: string, count: number) {
    count == null ? 0 : count; // handle zeroes
    this.se.required_vms.set(env, new Map().set(template, count));
  }

  public logse() {
    console.log(this.se);
  }

  ngOnInit() {
    this.se = new ScheduledEvent();
    this.se.required_vms = new Map();

    this.ss.list()
      .subscribe(
        (s: Scenario[]) => this.scenarios = s
      );

    // setup the times
    ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"].forEach(
      (hr: string) => {
        ["00", "30"].forEach(
          (min: string) => {
            this.times.push(hr + ":" + min);
          }
        )
      }
    )
  }

  // get all environments
  // for each environment, ask for available resources between start and end time
  // display those results
  public checkEnvironments() {
    this.checkingEnvironments = true;
    var templates: Map<string, boolean> = new Map();

    // add all chosen templates to the list
    this.selectedscenarios.forEach(
      (s: Scenario) => {
        s.virtualmachines.forEach(
          (se: Map<string, string>) => {
            Object.entries(se).forEach(
              (ee: string[]) => templates.set(ee[1], true)
            )
          }
        )
      }
    )

    this.es.list()
      .pipe(
        concatMap((e: Environment[]) => {
          this.environments = e;
          return from(e);
        }),
        filter((e: Environment) => {
          // first add to keyed environment, regardless of if we use it or not
          this.keyedEnvironments.set(e.display_name, e);
          let pass = false;
          Object.keys(e.template_mapping).forEach(
            (s: string) => {
              if (templates.has(s)) {
                pass = true;
              } else {
                pass = pass;
              }
            }
          )
          return pass;
        }),
        concatMap((e: Environment) => {
          return this.es.available(e.display_name, this.se.start_time, this.se.end_time);
        }),
        map(
          (ea: EnvironmentAvailability) => {
            return of(ea);
          }
        ),
        combineAll()
      ).subscribe(
        (ea: EnvironmentAvailability[]) => {
          this.availableEnvironments = ea;
          this.checkingEnvironments = false;
        }
      )
  }

  public prepareEnvironments() {
    // get a list of environments we are using
    // from that list, we will n eed to ask the user how many of each associated VM type they would like
  }


  public setStartDate(d: string) {
    this.se.start_time = new Date();
    this.se.start_time.setFullYear(+d.split("/")[2]);
    this.se.start_time.setMonth(+d.split("/")[0] - 1); // because JS is stupid
    this.se.start_time.setDate(+d.split("/")[0]);
    console.log(this.se.start_time);
  }

  public setEndDate(d: string) {
    this.se.end_time = new Date();
    this.se.end_time.setFullYear(+d.split("/")[2]);
    this.se.end_time.setMonth(+d.split("/")[0] - 1); // because JS is stupid
    this.se.end_time.setDate(+d.split("/")[0]);
  }

  public setStartTime(s: string) {
    this.se.start_time.setHours(+s.split(":")[0]);
    this.se.start_time.setMinutes(+s.split(":")[1]);
    this.se.start_time.setSeconds(0);
    console.log(this.se.start_time);
  }

  public setEndTime(s: string) {
    this.se.end_time.setHours(+s.split(":")[0]);
    this.se.end_time.setMinutes(+s.split(":")[1]);
    this.se.end_time.setSeconds(0);
  }

  public open() {
    this.se = new ScheduledEvent();
    this.se.required_vms = new Map();
    this.selectedEnvironments = [];
    this.selectedscenarios = [];
    this.startDate = this.startTime = this.endDate = this.endTime = "";
    this.wizard.reset();
    this.wizard.open();
  }

  public save() {
    this.saving = true;
    this.ses.create(this.se)
    .subscribe(
      (reply: string) => {
        console.log(reply);
      },
      (err: any) => {
        // something went wrong
      }
    )
  }

}
