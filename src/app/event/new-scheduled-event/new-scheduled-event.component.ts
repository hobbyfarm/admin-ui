import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  ClrWizard,
  ClrSignpostContent,
  ClrDatagridSortOrder,
} from '@clr/angular';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import { Course } from 'src/app/data/course';
import { CourseService } from 'src/app/data/course.service';
import { EnvironmentService } from 'src/app/data/environment.service';
import {
  combineAll,
  concatMap,
  map,
  filter,
  defaultIfEmpty,
} from 'rxjs/operators';
import { Environment } from 'src/app/data/environment';
import { EnvironmentAvailability } from 'src/app/data/environmentavailability';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import {
  Validators,
  ValidatorFn,
  FormGroup,
  FormControl,
  NonNullableFormBuilder,
  FormArray,
} from '@angular/forms';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';
import { QuicksetValidator } from 'src/app/validators/quickset.validator';
import { RbacService } from 'src/app/data/rbac.service';
import { of } from 'rxjs';
import { QuickSetEndTimeFormGroup } from 'src/app/data/forms';

// This object type maps VMTemplate names to the number of requested VMs
// The key specifies the template name
// The FormControl holds the number of requested VMs
type VmTemplateMappings = { [key: string]: FormControl<number> };

// This type holds (multiple) VMTemplateMappings within a FormGroup.
type VmTemplatesFormGroup = FormGroup<VmTemplateMappings>;

// This type maps Environment names to the VMTemplateMappings of the respective environment wrapped in a FormGroup
// The key specifies the environment name
// The VMTemplatesFormGroup holds the VMTemplateMappings of the respective environment
type EnvToVmTemplatesMappings = { [key: string]: VmTemplatesFormGroup };

// This type holds all Environment to VMTemplates mappings
type VmCountFormGroup = FormGroup<EnvToVmTemplatesMappings>;

@Component({
  selector: 'new-scheduled-event',
  templateUrl: './new-scheduled-event.component.html',
  styleUrls: ['./new-scheduled-event.component.scss'],
})
export class NewScheduledEventComponent implements OnInit {
  @Output()
  public updated: EventEmitter<boolean> = new EventEmitter(false);

  @Input()
  public event?: ScheduledEvent;

  public wzOpen: boolean = false;
  public se: ScheduledEvent = new ScheduledEvent();
  public scenarios: Scenario[] = [];
  public filteredScenarios: Scenario[] = [];
  public filteredScenariosSelected: Scenario[] = [];
  public courses: Course[] = [];
  public scheduledEvents: ScheduledEvent[] = [];
  public saving: boolean = false;

  public tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  public times: string[] = [];

  public availableEnvironments: EnvironmentAvailability[] = [];
  public checkingEnvironments: boolean = true;
  public noEnvironmentsAvailable: boolean = false;
  public unavailableVMTs: string[] = [];
  public environments: Environment[] = [];
  public keyedEnvironments: Map<string, Environment> = new Map();
  public selectedEnvironments: EnvironmentAvailability[] = [];

  public startDate: string;
  public endDate: string;
  public startTime: string;
  public endTime: string;

  public simpleMode: boolean = true;

  public validTimes: boolean = false;

  public ascSort = ClrDatagridSortOrder.ASC;

  public selectedscenarios: Scenario[] = [];
  public selectedcourses: Course[] = [];

  public simpleUserCounts: {} = {};
  public requiredVmCounts: { [key: string]: number } = {};
  public maxUserCounts: {} = {};
  public invalidSimpleEnvironments: string[] = [];

  private onCloseFn: Function;

  constructor(
    private _fb: NonNullableFormBuilder,
    public ss: ScenarioService,
    public cs: CourseService,
    public ses: ScheduledeventService,
    public es: EnvironmentService,
    public rbacService: RbacService
  ) {}

  public eventDetails: FormGroup<{
    event_name: FormControl<string>;
    description: FormControl<string>;
    access_code: FormControl<string>;
    restricted_bind: FormControl<boolean>;
    on_demand: FormControl<boolean>;
    printable: FormControl<boolean>;
  }> = this._fb.group({
    event_name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4),
      this.uniqueEventName(),
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    access_code: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^[a-z0-9][a-z0-9.-]{3,}[a-z0-9]$/),
      this.uniqueAccessCode(),
    ]),
    restricted_bind: new FormControl<boolean>(true),
    on_demand: new FormControl<boolean>(true),
    printable: new FormControl<boolean>(false),
  });

  public vmCounts: VmCountFormGroup = new FormGroup<EnvToVmTemplatesMappings>(
    {},
    this.validateAdvancedVmPage()
  );

  public simpleModeVmCounts: FormGroup<{
    envs: FormArray<FormControl<number>>;
  }> = this._fb.group({
    envs: this._fb.array<FormControl<number>>(
      [],
      this.validateNonZeroFormControl()
    ),
  });

  public copyEventDetails() {
    this.se.event_name = this.eventDetails.controls.event_name.value;
    this.se.description = this.eventDetails.controls.description.value;
    this.se.access_code = this.eventDetails.controls.access_code.value;
    this.se.disable_restriction =
      !this.eventDetails.controls.restricted_bind.value; // opposite, since restricted_bind: enabled really means disable_restriction: false
    this.se.on_demand = this.eventDetails.controls.on_demand.value;
    this.se.printable = this.eventDetails.controls.printable.value;
  }

  private validateNonZeroFormControl(): ValidatorFn {
    return (formArray: FormArray<FormControl<number>>) => {
      const allEnvironmentsZero = !formArray.controls.some(
        (control: FormControl<number>) => {
          return control.value > 0;
        }
      );
      if (!allEnvironmentsZero) {
        return null;
      }
      // if validation fails -> return an "error"-object
      return {
        allEnvironmentsZero: true,
      };
    };
  }

  public uniqueAccessCode(): ValidatorFn {
    return (control: FormControl<string>): { notUnique: boolean } | null => {
      if (
        !control.value ||
        this.scheduledEvents.filter(
          (el) =>
            el.access_code === control.value &&
            (!this.event || this.event.access_code !== control.value)
        ).length > 0
      ) {
        return {
          notUnique: true,
        };
      }
      return null;
    };
  }

  public uniqueEventName(): ValidatorFn {
    return (control: FormControl<string>): { notUnique: boolean } | null => {
      if (
        !control.value ||
        this.scheduledEvents.filter(
          (el) =>
            el.event_name === control.value &&
            (!this.event || this.event.event_name !== control.value)
        ).length > 0
      ) {
        return {
          notUnique: true,
        };
      }
      return null;
    };
  }

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;
  @ViewChild('startTimeSignpost') startTimeSignpost: ClrSignpostContent;
  @ViewChild('endTimeSignpost') endTimeSignpost: ClrSignpostContent;

  public scenariosSelected(s: Scenario[]) {
    let selected: Scenario[] = [];
    this.se.scenarios = [];

    this.selectedscenarios.forEach((element) => {
      if (!this.filteredScenarios.includes(element)) {
        this.se.scenarios.push(element.id);
        selected.push(element);
      }
    });

    s.forEach((sc: Scenario) => {
      if (!selected.includes(sc)) {
        this.se.scenarios.push(sc.id);
        selected.push(sc);
      }
    });

    this.selectedscenarios = selected;
  }

  public coursesSelected(c: Course[]) {
    this.se.courses = [];
    c.forEach((co: Course) => this.se.courses.push(co.id));
    this.selectedcourses = c;
  }

  public getTemplates(env: string) {
    return Object.keys(this.keyedEnvironments.get(env).template_mapping);
  }

  public setupVMSelection() {
    this.calculateRequiredVms();
    this.maxUserCount();
    // reset
    this.vmCounts = new FormGroup<EnvToVmTemplatesMappings>(
      {},
      this.validateAdvancedVmPage()
    );
    this.simpleModeVmCounts = this._fb.group({
      envs: this._fb.array<FormControl<number>>(
        [],
        this.validateNonZeroFormControl()
      ),
    });
    // Steps: 1. get selected environments.
    // 2. For each environment, if it is supported in that environment, add an input for the vmtype in the scenario
    this.invalidSimpleEnvironments = []; // reset invalid simple mode environments
    this.selectedEnvironments.forEach((ea: EnvironmentAvailability) => {
      this.setupSimpleVMPage(ea);
      this.setupAdvancedVMPage(ea);
    });
  }

  private validateAdvancedVmPage(): ValidatorFn {
    return (vmCountFormGroup: VmCountFormGroup) => {
      const environmentFormGroups = Object.values(vmCountFormGroup.controls);
      let requiredVmCountSatisfied = true;
      for (let template in this.requiredVmCounts) {
        const requiredVmCount: number = this.requiredVmCounts[template];
        let currentVmCount = 0;
        environmentFormGroups.forEach(
          (vmTemplatesFormGroup: VmTemplatesFormGroup) => {
            if (Object.keys(vmTemplatesFormGroup.controls).includes(template)) {
              currentVmCount += vmTemplatesFormGroup.controls[template].value;
            }
          }
        );
        requiredVmCountSatisfied =
          requiredVmCountSatisfied && currentVmCount >= requiredVmCount;
      }

      if (!requiredVmCountSatisfied) {
        return {
          requiredVmCountSatisfied: true,
        };
      }
      return null;
    };
  }

  public setupAdvancedVMPage(ea: EnvironmentAvailability) {
    const vmTemplateMappings: VmTemplatesFormGroup =
      new FormGroup<VmTemplateMappings>({});
    let templates = this.getTemplates(ea.environment);
    for (let template in this.requiredVmCounts) {
      if (!templates.includes(template)) {
        //this environment does not support this template
        continue;
      }
      const initVal: number =
        this.se.required_vms[ea.environment]?.[template] ?? 0; // so we don't blow away old input values when rebuilding this form
      const templateMapping = new FormControl<number>(initVal, {
        validators: [
          Validators.pattern(/-?\d+/),
          Validators.max(ea.available_count[template]),
        ],
        nonNullable: true,
      });
      vmTemplateMappings.addControl(template, templateMapping);
    }

    this.vmCounts.addControl(ea.environment, vmTemplateMappings);
  }

  public setupSimpleVMPage(ea: EnvironmentAvailability) {
    // go through each required VM (and its count) and verify that a) it exists in the selected environment and b) there is a minimum count that supports a single user
    // (otherwise don't list it)
    let meetsCriteria = true;
    Object.keys(this.requiredVmCounts).forEach(
      (requiredVm: string, index: number) => {
        if (
          !ea.available_count[requiredVm] ||
          ea.available_count[requiredVm] < this.requiredVmCounts[requiredVm]
        ) {
          // this template either doesn't exist in the environment, or doesn't match a minimum count
          meetsCriteria = false;
          if (!this.invalidSimpleEnvironments.includes(ea.environment)) {
            this.invalidSimpleEnvironments.push(ea.environment);
          }
        }
      }
    );

    if (meetsCriteria) {
      let initVal = 0;
      if (this.simpleUserCounts[ea.environment]) {
        initVal = this.simpleUserCounts[ea.environment] || 0; // so we don't blow away old input values when rebuilding this form
      }
      const newControl = new FormControl<number>(initVal, [
        Validators.pattern(/-?\d+/),
        Validators.max(this.maxUserCounts[ea.environment]),
      ]);
      this.simpleModeVmCounts.controls.envs.push(newControl);
    }
  }

  public copyVMCounts() {
    // clean up
    this.se.required_vms = {};
    this.simpleUserCounts = {};

    if (this.simpleMode) {
      this.selectedEnvironments.forEach((env, i) => {
        const users = this.simpleModeVmCounts.controls.envs.at(i).value;
        this.simpleUserCounts[env.environment] = users;
        if (users == 0) {
          return;
        }
        Object.keys(this.requiredVmCounts).forEach((template, j) => {
          if (!this.se.required_vms[env.environment]) {
            this.se.required_vms[env.environment] = {};
          }
          this.se.required_vms[env.environment][template] =
            users * this.requiredVmCounts[template];
        });
      });
    } else {
      // basically do setupVMSelection in reverse and shove the results into se.required_vms
      this.selectedEnvironments.forEach((ea: EnvironmentAvailability) => {
        // for each template, get the count.
        this.getTemplates(ea.environment).forEach((template: string) => {
          const val =
            this.vmCounts.controls[ea.environment]?.controls[template]?.value ??
            0;
          if (val != 0) {
            // only map vm counts that are not 0 (instead of using >0 so that -1 is allowable)
            if (!this.se.required_vms[ea.environment]) {
              this.se.required_vms[ea.environment] = {};
            }
            this.se.required_vms[ea.environment][template] = val;
          }
        });
      });
    }
  }

  /*
  Calculate the maximum number of users that can be scheduled in an environment.
  This is used for the simple method of VM provisioning.
  */
  public maxUserCount() {
    this.maxUserCounts = {}; // map[string]int
    // we need to get the number of VMs of each type that a user needs
    // then divide that amount by the number of _available_ VMs, arriving at a max.
    // this max will be passed to the Angular FormControl as a max() validator.
    // it also will be displayed on the page for the users knowledge
    this.selectedEnvironments.forEach((se, i) => {
      // for each environment, get the templates supported by that environment
      let min = Number.MAX_SAFE_INTEGER;
      Object.keys(se.available_count).forEach((template, j) => {
        if (
          se.available_count[template] / this.requiredVmCounts[template] <
          min
        ) {
          min = se.available_count[template] / this.requiredVmCounts[template];
          min = Math.floor(min);
        }
      });

      this.maxUserCounts[se.environment] = min;
    });
  }

  public calculateRequiredVms() {
    this.requiredVmCounts = {}; // this will be map[string]int, where string is vm template and int is required count
    this.selectedscenarios.forEach((ss, i) => {
      // ss is selectedscenario, i is index
      let vmCountPerTemplate = {}; // this will be map[string]int, where string is vm template and int is required count for this scenario.
      ss.virtualmachines.forEach((vmset, j) => {
        // vmset is virtualmachineset, j is index
        // 1. sum up count of vms needed for this scenario.
        Object.values(vmset).forEach((template: string, k) => {
          // tmeplate is vmtemplate name, k is index
          if (vmCountPerTemplate[template]) {
            vmCountPerTemplate[template]++;
          } else {
            vmCountPerTemplate[template] = 1;
          }
        });
      });
      // 2. Set the required VM count to the maximum count of VMs needed in one scenario.
      for (let template in vmCountPerTemplate) {
        if (this.requiredVmCounts[template]) {
          this.requiredVmCounts[template] = Math.max(
            vmCountPerTemplate[template],
            this.requiredVmCounts[template]
          );
        } else {
          this.requiredVmCounts[template] = vmCountPerTemplate[template];
        }
      }
    });
    this.selectedcourses.forEach((sc, i) => {
      // sc is selected course, i is index
      let vmCountPerTemplate = {};
      sc.virtualmachines.forEach((vmset, j) => {
        // vmset is virtualmachineset, j is index
        // 1. sum up count of vms needed for this course.
        Object.values(vmset).forEach((template: string, k) => {
          // template is vmtemplate name, k is index
          if (vmCountPerTemplate[template]) {
            vmCountPerTemplate[template]++;
          } else {
            vmCountPerTemplate[template] = 1;
          }
        });
      });

      // 2. Set the required VM count to the maximum count of VMs needed
      for (let template in vmCountPerTemplate) {
        if (this.requiredVmCounts[template]) {
          this.requiredVmCounts[template] = Math.max(
            vmCountPerTemplate[template],
            this.requiredVmCounts[template]
          );
        } else {
          this.requiredVmCounts[template] = vmCountPerTemplate[template];
        }
      }
    });
  }

  controls(path: string): string[] {
    let group: VmCountFormGroup | VmTemplatesFormGroup;
    if (path == '') {
      group = this.vmCounts;
    } else {
      group = this.vmCounts.controls[path];
    }
    return Object.keys(group.controls);
  }

  ngOnChanges() {
    if (this.event) {
      this.simpleMode = false;
      this.se = this.event;
      this.eventDetails.setValue({
        event_name: this.se.event_name,
        description: this.se.description,
        access_code: this.se.access_code,
        restricted_bind: !this.se.disable_restriction, // opposite, since restricted_bind: enabled really means disable_restriction: false
        on_demand: this.se.on_demand,
        printable: this.se.printable,
      });

      // auto-select the environments
      this.se.scenarios = this.se.scenarios ?? [];
      this.updateScenarioSelection(this.se.scenarios);

      this.se.courses = this.se.courses ?? [];
      this.updateCourseSelection(this.se.courses);

      this.rbacService
        .Grants('environments', 'list')
        .then((allowListEnvironments: boolean) => {
          if (allowListEnvironments) {
            this.checkEnvironments();
          }
        });

      this.wizard.navService.goTo(this.wizard.pages.last, true);
      this.wizard.pages.first.makeCurrent();
    } else {
      this.se = new ScheduledEvent();
      this.se.required_vms = {};
    }
  }

  public simpleUserTotal() {
    let total = 0;
    for (let i = 0; i < this.simpleModeVmCounts.controls.envs.length; i++) {
      total += this.simpleModeVmCounts.controls.envs.at(i).value;
    }
    return total;
  }

  ngOnInit() {
    if (this.event) {
      // we have passed in an event for editing
      this.se = this.event;
    } else {
      this.se = new ScheduledEvent();
      this.se.required_vms = {};
    }

    const authorizationRequests = Promise.all([
      this.rbacService.Grants('scenarios', 'list'),
      this.rbacService.Grants('courses', 'list'),
    ]);

    authorizationRequests.then((permissions: [boolean, boolean]) => {
      const allowListScenarios: boolean = permissions[0];
      const allowListCourses: boolean = permissions[1];

      if (allowListScenarios) {
        this.ss.list().subscribe((s: Scenario[]) => {
          this.scenarios = s;
          this.updateScenarioSelection(this.se.scenarios ?? []);
        });
        this.ss.watch().subscribe((s: Scenario[]) => {
          this.scenarios = s;
          this.updateScenarioSelection(this.se.scenarios ?? []);
        });
      }
      if (allowListCourses) {
        this.cs.list().subscribe((c: Course[]) => {
          this.courses = c;
          this.updateCourseSelection(this.se.courses ?? []);
        });
        this.cs.watch().subscribe((c: Course[]) => {
          this.courses = c;
          this.updateCourseSelection(this.se.courses ?? []);
        });
      }
    });
    this.ses.watch().subscribe((se: ScheduledEvent[]) => {
      this.scheduledEvents = se;
    });
    this.ses.list().subscribe((se: ScheduledEvent[]) => {
      this.scheduledEvents = se;
    });

    // setup the times
    [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
    ].forEach((hr: string) => {
      ['00', '30'].forEach((min: string) => {
        this.times.push(hr + ':' + min);
      });
    });
  }

  // get all environments
  // for each environment, ask for available resources between start and end time
  // display those results
  public checkEnvironments() {
    this.checkingEnvironments = true;
    this.noEnvironmentsAvailable = false;
    this.unavailableVMTs = [];
    const templates: Map<string, boolean> = new Map();

    // add all chosen templates to the list
    this.selectedscenarios.forEach((s: Scenario) => {
      s.virtualmachines.forEach((se: Map<string, string>) => {
        Object.entries(se).forEach((ee: string[]) =>
          templates.set(ee[1], true)
        );
      });
    });
    this.selectedcourses.forEach((c: Course) => {
      c.virtualmachines.forEach((se: Map<string, string>) => {
        Object.entries(se).forEach((ee: string[]) =>
          templates.set(ee[1], true)
        );
      });
    });

    this.es
      .list()
      .pipe(
        concatMap((e: Environment[]) => {
          this.environments = e;
          return e;
        }),
        filter((e: Environment) => {
          // first add to keyed environment, regardless of if we use it or not
          this.keyedEnvironments.set(e.name, e);
          let pass = false;
          Object.keys(e.template_mapping).forEach((s: string) => {
            if (templates.has(s)) {
              pass = true;
            } else {
              pass = pass;
            }
          });
          return pass;
        }),
        concatMap((e: Environment) => {
          return this.es.available(
            e.name,
            this.se.start_time,
            this.se.end_time
          );
        }),
        map((ea: EnvironmentAvailability) => {
          return of(ea);
        }),
        combineAll(),
        defaultIfEmpty([])
      )
      .subscribe((ea: EnvironmentAvailability[]) => {
        this.availableEnvironments = ea;
        this.checkingEnvironments = false;
        this.noEnvironmentsAvailable = ea.length == 0 ? true : false;

        ea.forEach((e) => {
          Object.keys(e.available_count).forEach((vmt) => {
            templates.delete(vmt);
          });
        });

        this.unavailableVMTs = Array.from(templates.keys());

        if (this.event) {
          // we are updating instead of creating new
          // so we need to select the environments

          //increase the number of available VMs by the count of VMs currently set for this event (we can still use them)
          this.availableEnvironments = this.availableEnvironments.map(
            (ea: EnvironmentAvailability) => {
              if (this.event.required_vms[ea.environment]) {
                for (const [vmt, count] of Object.entries(ea.available_count)) {
                  if (this.event.required_vms[ea.environment][vmt]) {
                    ea.available_count[vmt] =
                      count + this.event.required_vms[ea.environment][vmt];
                  }
                }
              }
              return ea;
            }
          );

          this._mapExistingEnvironments(Object.keys(this.event.required_vms));
        } else if (Object.keys(this.vmCounts.controls).length > 0) {
          // there exists fields filled in for vm counts - user probably went back in the form
          this._mapExistingEnvironments(Object.keys(this.vmCounts.controls));
        }
      });
  }

  private _mapExistingEnvironments(envs: string[]) {
    envs.forEach((eid: string) => {
      this.availableEnvironments.forEach((ea: EnvironmentAvailability) => {
        if (ea.environment == eid) {
          this.selectedEnvironments.push(ea);
        }
      });
    });
  }

  private updateScenarioSelection(curSel: string[]) {
    const scenarioMap: Map<string, Scenario> = new Map();
    this.scenarios.forEach((s: Scenario) => {
      scenarioMap.set(s.id, s);
    });

    curSel.forEach((sid: string) => {
      // find matching if there is one, and push into selectedscenarios
      if (scenarioMap.has(sid)) {
        this.selectedscenarios.push(scenarioMap.get(sid));
      }
    });
  }

  private updateCourseSelection(curSel: string[]) {
    const courseMap: Map<string, Course> = new Map();
    this.courses.forEach((c: Course) => {
      courseMap.set(c.id, c);
    });

    curSel.forEach((cid: string) => {
      // find matching if there is one, and push into selectedcourses
      if (courseMap.has(cid)) {
        this.selectedcourses.push(courseMap.get(cid));
      }
    });
  }

  public quicksetEndtimeForm: QuickSetEndTimeFormGroup = new FormGroup(
    {
      quickset_endtime: new FormControl<number>(1, [Validators.required]),
      quickset_unit: new FormControl<'h' | 'd' | 'w' | 'm'>('w', [
        Validators.required,
      ]),
    },
    { validators: QuicksetValidator }
  );

  get quicksetAmount() {
    return this.quicksetEndtimeForm.controls.quickset_endtime;
  }

  get quicksetUnit() {
    return this.quicksetEndtimeForm.controls.quickset_unit;
  }

  get quicksetRequired() {
    const qe = this.quicksetAmount;
    const qu = this.quicksetUnit;

    // validate
    if ((qe.dirty || qe.touched) && qe.invalid && qe.errors.required) {
      return true;
    } else if ((qu.dirty || qu.touched) && qu.invalid && qu.errors.required) {
      return true;
    } else {
      return false;
    }
  }

  public quickStartTime() {
    this.se.start_time = new Date();
  }

  public quickEndTime() {
    const durationType: 'h' | 'd' | 'w' | 'm' =
      this.quicksetEndtimeForm.controls.quickset_unit.value;
    const duration: number =
      this.quicksetEndtimeForm.controls.quickset_endtime.value;
    switch (durationType) {
      case 'h':
        this.se.end_time = new Date(Date.now() + 3600 * 1000 * duration);
        break;
      case 'd':
        this.se.end_time = new Date(Date.now() + 24 * 3600 * 1000 * duration);
        break;
      case 'w':
        this.se.end_time = new Date(
          Date.now() + 7 * 24 * 3600 * 1000 * duration
        );
        break;
      case 'm':
        let days: number = 0;
        const today = new Date();
        for (let i = 0; i < duration; i++) {
          days += this.daysPerMonth(i, today);
        }
        this.se.end_time = new Date(Date.now() + 24 * 3600 * 1000 * days);
        break;
    }
  }

  private daysPerMonth(i: number, date: Date) {
    const monthIteration: number = date.getMonth() + i;
    const monthParam: number = (monthIteration % 12) + 1;
    let yearParam: number = date.getFullYear();
    if (monthIteration / 12 >= 1) {
      yearParam = yearParam + Math.floor(monthIteration / 12);
    }
    return new Date(yearParam, monthParam, 0).getDate();
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
    this.simpleMode = true;
    this.validTimes = false;
    this.se = new ScheduledEvent();
    this.eventDetails.reset();
    this.se.required_vms = {};
    this.selectedEnvironments = [];
    this.selectedscenarios = [];
    this.selectedcourses = [];
    this.startDate = this.startTime = this.endDate = this.endTime = '';
    this.wizard.reset();
    this.wizard.open();
    this.vmCounts = new FormGroup<EnvToVmTemplatesMappings>(
      {},
      this.validateAdvancedVmPage()
    );
  }

  public close() {
    if (this.onCloseFn) {
      this.onCloseFn();
    }
  }

  public setOnCloseFn(fn: Function) {
    this.onCloseFn = fn;
  }

  public isFinishWizardDisabled() {
    //No course or scenario selected
    if (
      this.selectedcourses.length == 0 &&
      this.selectedscenarios.length == 0
    ) {
      return true;
    }

    //no environment selected
    if (this.selectedEnvironments.length == 0) {
      return true;
    }

    //vm count is valid
    if (
      (!this.simpleMode && !this.vmCounts.valid) ||
      (this.simpleMode && !this.simpleModeVmCounts.valid)
    ) {
      return true;
    }

    //valid VM details
    if (
      this.se.start_time >= this.se.end_time ||
      !this.se.start_time ||
      !this.se.end_time ||
      !this.eventDetails.valid
    ) {
      return true;
    }

    return false;
  }

  public save() {
    this.saving = true;
    if (this.event) {
      this.ses.update(this.se).subscribe({
        next: (_reply: string) => {
          this.updated.next(true);
        },
        error: (_err: any) => {
          this.updated.next(true);
        },
      });
    } else {
      this.ses.create(this.se).subscribe({
        next: (_reply: string) => {
          this.updated.next(true);
        },
        error: (_err: any) => {
          this.updated.next(true);
        },
      });
    }
    this.close();
  }
  setScenarioList(values: Scenario[]) {
    this.filteredScenarios = values;
  }
}
