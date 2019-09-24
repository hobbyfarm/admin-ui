import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ClrWizard, ClrSignpostContent } from '@clr/angular';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import { EnvironmentService } from 'src/app/data/environment.service';
import { combineAll, concatMap, map, filter } from 'rxjs/operators';
import { Environment } from 'src/app/data/environment';
import { from, of } from 'rxjs';
import { EnvironmentAvailability } from 'src/app/data/environmentavailability';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';

@Component({
  selector: 'new-scheduled-event',
  templateUrl: './new-scheduled-event.component.html',
  styleUrls: ['./new-scheduled-event.component.scss']
})
export class NewScheduledEventComponent implements OnInit {
  @Output()
  public updated: EventEmitter<boolean> = new EventEmitter(false);

  @Input()
  public event: ScheduledEvent;

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

  public validTimes: boolean = false;

  public vmtotals: Map<string, number> = new Map();

  public selectedscenarios: Scenario[] = [];

  constructor(
    public ss: ScenarioService,
    public ses: ScheduledeventService,
    public es: EnvironmentService
  ) { }

  public eventDetails: FormGroup = new FormGroup({
    'event_name': new FormControl(this.se.event_name, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'description': new FormControl(this.se.description, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'access_code': new FormControl(this.se.access_code, [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^[a-zA-Z0-9]*$/)
    ]),
    'restricted_bind': new FormControl(true)
  })

  public copyEventDetails() {
    this.se.event_name = this.eventDetails.get('event_name').value;
    this.se.description = this.eventDetails.get('description').value;
    this.se.access_code = this.eventDetails.get('access_code').value;
    this.se.disable_restriction = !this.eventDetails.get("restricted_bind").value; // opposite, since restricted_bind: enabled really means disable_restriction: false
  }

  @ViewChild("wizard", { static: true }) wizard: ClrWizard;
  @ViewChild("startTimeSignpost", { static: false }) startTimeSignpost: ClrSignpostContent;
  @ViewChild("endTimeSignpost", { static: false }) endTimeSignpost: ClrSignpostContent;

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

  public getVMCount(env: string, template: string) {
    return this.se.required_vms[env] ? this.se.required_vms[env][template] : 0;
  }

  public setVMCount(env: string, template: string, count: number) {
    count == null ? 0 : count; // handle zeroes
    this.se.required_vms[env] = {};
    this.se.required_vms[env][template] = count;
  }

  ngOnChanges() {
    if (this.event) {
      this.se = this.event;
      this.eventDetails.setValue({
        'event_name': this.se.event_name,
        'description': this.se.description,
        'access_code': this.se.access_code,
        'restricted_bind': true
      });

      // auto-select the environments
      this.se.scenarios.forEach(
        (sid: string) => {
          // find matching if there is one, and push into selectedscenarios
          this.scenarios.map(
            (s: Scenario) => {
              if (s.id == sid) {
                this.selectedscenarios.push(s);
              }
            }
          )
        }
      )

    } else {
      this.se = new ScheduledEvent();
      this.se.required_vms = {};
    }
  }

  ngOnInit() {
    if (this.event) {
      // we have passed in an event for editing
      this.se = this.event;
    } else {
      this.se = new ScheduledEvent();
      this.se.required_vms = {};
    }

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

          if (this.event) {
            // we are updating instead of creating new
            // so we need to select the environments
            Object.keys(this.se.required_vms).forEach(
              (eid: string) => {
                this.availableEnvironments.map(
                  (ea: EnvironmentAvailability) => {
                    if (ea.environment == eid) {
                      this.selectedEnvironments.push(ea);
                    }
                  }
                )
              }
            )
          }
        }
      )
  }

  public prepareEnvironments() {
    // get a list of environments we are using
    // from that list, we will n eed to ask the user how many of each associated VM type they would like
  }


  public setStartTime(d: DlDateTimePickerChange<Date>) {
    this.se.start_time = d.value;
    this.startTimeSignpost.close();
  }

  public setEndTime(d: DlDateTimePickerChange<Date>) {
    this.se.end_time = d.value;
    this.endTimeSignpost.close();
  }

  public open() {
    this.validTimes = false;
    this.se = new ScheduledEvent();
    this.eventDetails.reset({
      'restricted_bind': true
    });
    this.se.required_vms = new Map();
    this.selectedEnvironments = [];
    this.selectedscenarios = [];
    this.startDate = this.startTime = this.endDate = this.endTime = "";
    this.wizard.reset();
    this.wizard.open();
  }

  public save() {
    this.saving = true;
    if (this.event) {
      this.ses.update(this.se)
        .subscribe(
          (reply: string) => {
            this.updated.next(true);
          },
          (err: any) => {
            this.updated.next(true);
          }
        )
    } else {
      this.ses.create(this.se)
        .subscribe(
          (reply: string) => {
            this.updated.next(true);
          },
          (err: any) => {
            this.updated.next(true);
          }
        )
    }
  }

}
