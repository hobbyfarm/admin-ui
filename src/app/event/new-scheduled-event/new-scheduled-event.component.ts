import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  ClrWizard,
  ClrSignpostContent,
  ClrDatagridSortOrder,
  ClrWizardPage,
} from '@clr/angular';
import {
  ScheduledEvent,
  ScheduledEventBase,
} from 'src/app/data/scheduledevent';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import { Course } from 'src/app/data/course';
import { CourseService } from 'src/app/data/course.service';
import { EnvironmentService } from 'src/app/data/environment.service';
import { concatMap, filter, defaultIfEmpty, toArray } from 'rxjs/operators';
import { Environment } from 'src/app/data/environment';
import { EnvironmentAvailability } from 'src/app/data/environmentavailability';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';
import {
  Validators,
  FormGroup,
  FormControl,
  NonNullableFormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';
import { QuicksetValidator } from 'src/app/validators/quickset.validator';
import { RbacService } from 'src/app/data/rbac.service';
import { EMPTY, Subscription } from 'rxjs';
import {
  EnvToVmTemplatesMappings,
  isFormArrayOfNumbers,
  isVmCountFormGroup,
  QuickSetEndTimeFormGroup,
  VmCountFormGroup,
  VmTemplateMappings,
  VmTemplatesFormGroup,
} from 'src/app/data/forms';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';

@Component({
  selector: 'new-scheduled-event',
  templateUrl: './new-scheduled-event.component.html',
  styleUrls: ['./new-scheduled-event.component.scss'],
})
export class NewScheduledEventComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Output()
  public updated: EventEmitter<boolean> = new EventEmitter(false);

  @Input()
  public event: ScheduledEventBase | null;

  public wzOpen: boolean = false;
  public se: ScheduledEventBase = new ScheduledEventBase();
  public uneditedScheduledEvent = new ScheduledEventBase();
  public scenarios: Scenario[] = [];
  public filteredScenarios: Scenario[] = [];
  public filteredScenariosSelected: Scenario[] = [];
  public courses: Course[] = [];
  public scheduledEvents: ScheduledEventBase[] = [];
  public saving: boolean = false;

  public tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  public times: string[] = [];

  public availableEnvironments: EnvironmentAvailability[] = [];
  public checkingEnvironments: boolean = true;
  public noEnvironmentsAvailable: boolean = false;
  public noVirtualMachinesNeeded: boolean = false;
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

  public simpleUserCounts: Record<string, number> = {};
  public requiredVmCounts: Record<string, number> = {};
  public maxUserCounts: Record<string, number> = {};
  public invalidSimpleEnvironments: string[] = [];

  public virtualMachineTemplateList: Map<string, string> = new Map();
  public isEditMode = false;

  private onCloseFn?: () => void;

  private wizardSubscription: Subscription;

  constructor(
    private _fb: NonNullableFormBuilder,
    public ss: ScenarioService,
    public cs: CourseService,
    public ses: ScheduledeventService,
    public es: EnvironmentService,
    public rbacService: RbacService,
    public vmTemplateService: VmtemplateService,
  ) {
    this.rbacService
      .Grants('virtualmachinetemplates', 'list')
      .then((allowVMTemplateList: boolean) => {
        if (!allowVMTemplateList) {
          return;
        }
        vmTemplateService
          .list()
          .subscribe((list: VMTemplate[]) =>
            list.forEach((v) =>
              this.virtualMachineTemplateList.set(v.id, v.name),
            ),
          );
      });
  }
  ngOnDestroy(): void {
    this.wizardSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.wizardSubscription = this.wizardPages.changes
      .pipe(
        filter(
          (wizardPages: QueryList<ClrWizardPage>) =>
            wizardPages.length != 0 && !this.checkingEnvironments,
        ),
      )
      .subscribe((wizardPages: QueryList<ClrWizardPage>) => {
        setTimeout(() => {
          this.wizard.navService.goTo(wizardPages.last, true);
          wizardPages.first.makeCurrent();
        });
      });
  }

  public eventDetails: FormGroup<{
    event_name: FormControl<string>;
    description: FormControl<string>;
    access_code: FormControl<string>;
    restricted_bind: FormControl<boolean>;
    on_demand: FormControl<boolean>;
    printable: FormControl<boolean>;
  }> = this._fb.group({
    event_name: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(4),
        this.uniqueEventNameValidator(),
      ],
      nonNullable: true,
    }),
    description: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(4)],
      nonNullable: true,
    }),
    access_code: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[a-z0-9][a-z0-9.-]{3,}[a-z0-9]$/),
        this.uniqueAccessCodeValidator(),
      ],
      nonNullable: true,
    }),
    restricted_bind: new FormControl<boolean>(true, { nonNullable: true }),
    on_demand: new FormControl<boolean>(true, { nonNullable: true }),
    printable: new FormControl<boolean>(false, { nonNullable: true }),
  });

  public vmCounts: VmCountFormGroup = new FormGroup<EnvToVmTemplatesMappings>(
    {},
    this.advancedVmPageValidator(),
  );

  public simpleModeVmCounts: FormGroup<{
    envs: FormArray<FormControl<number>>;
  }> = this._fb.group({
    envs: this._fb.array<FormControl<number>>(
      [],
      this.validateNonZeroFormControl,
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

  /**
   * If we close our new-scheduled-event modal,
   * we need to reset the values that were changed on our referenced input object.
   * We are operating on "this.se" because it was initially assigned to "this.event" in ngOnChanges().
   * This way we don't need to reload the datagrid after modifications.
   */
  private resetEventDetails() {
    this.se.event_name = this.uneditedScheduledEvent.event_name;
    this.se.description = this.uneditedScheduledEvent.description;
    this.se.on_demand = this.uneditedScheduledEvent.on_demand;
    this.se.disable_restriction =
      this.uneditedScheduledEvent.disable_restriction;
    this.se.courses = this.uneditedScheduledEvent.courses;
    this.se.scenarios = this.uneditedScheduledEvent.scenarios;
    this.se.start_time = this.uneditedScheduledEvent.start_time;
    this.se.end_time = this.uneditedScheduledEvent.end_time;
    this.se.required_vms = this.uneditedScheduledEvent.required_vms;
    this.se.vmsets = this.uneditedScheduledEvent.vmsets;
  }

  private validateNonZeroFormControl(
    formArray: AbstractControl,
  ): { controlTypeMismatch?: string; allEnvironmentsZero?: boolean } | null {
    if (!isFormArrayOfNumbers(formArray)) {
      return {
        controlTypeMismatch: 'Expected FormArray<FormControl<number>>',
      };
    }
    const allEnvironmentsZero = !formArray.controls.some(
      (control: FormControl<number>) => {
        return control.value > 0;
      },
    );
    if (!allEnvironmentsZero) {
      return null;
    }
    // if validation fails -> return an "error"-object
    return {
      allEnvironmentsZero: true,
    };
  }

  private uniqueAccessCodeValidator(): (
    control: AbstractControl,
  ) => { notUnique: boolean } | null {
    return (control: AbstractControl<string>) => this.uniqueAccessCode(control);
  }

  public uniqueAccessCode(
    control: AbstractControl<string>,
  ): { notUnique: boolean } | null {
    if (
      !control.value ||
      this.scheduledEvents.filter(
        (el) =>
          el.access_code === control.value &&
          (!this.event || this.event.access_code !== control.value),
      ).length > 0
    ) {
      return {
        notUnique: true,
      };
    }
    return null;
  }

  private uniqueEventNameValidator(): (
    control: AbstractControl,
  ) => { notUnique: boolean } | null {
    return (control: AbstractControl<string>) => this.uniqueEventName(control);
  }

  private uniqueEventName(
    control: AbstractControl<string>,
  ): { notUnique: boolean } | null {
    if (
      !control.value ||
      this.scheduledEvents.filter(
        (el) =>
          el.event_name === control.value &&
          (!this.event || this.event.event_name !== control.value),
      ).length > 0
    ) {
      return {
        notUnique: true,
      };
    }
    return null;
  }

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;
  @ViewChildren(ClrWizardPage) wizardPages: QueryList<ClrWizardPage>;
  @ViewChild('startTimeSignpost') startTimeSignpost: ClrSignpostContent;
  @ViewChild('endTimeSignpost') endTimeSignpost: ClrSignpostContent;

  public scenariosSelected(s: Scenario[]) {
    const selected: Scenario[] = [];
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

  public getTemplates(env: string): string[] {
    const environment = this.keyedEnvironments.get(env);
    return environment ? Object.keys(environment.template_mapping) : [];
  }

  setupVMSelection() {
    this.calculateRequiredVms();
    this.maxUserCount();
    // reset
    this.vmCounts = new FormGroup<EnvToVmTemplatesMappings>(
      {},
      this.advancedVmPageValidator(),
    );

    this.simpleModeVmCounts = this._fb.group({
      envs: this._fb.array<FormControl<number>>(
        [],
        this.validateNonZeroFormControl,
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

  private advancedVmPageValidator(): (control: AbstractControl) => {
    controlTypeMismatch?: string;
    requiredVmCountSatisfied?: boolean;
  } | null {
    return (control: AbstractControl) => this.validateAdvancedVmPage(control);
  }

  private validateAdvancedVmPage(vmCountFormGroup: AbstractControl): {
    controlTypeMismatch?: string;
    requiredVmCountSatisfied?: boolean;
  } | null {
    if (!isVmCountFormGroup(vmCountFormGroup)) {
      return {
        controlTypeMismatch: 'Expected VmCountFormGroup',
      };
    }
    const environmentFormGroups = Object.values(vmCountFormGroup.controls);
    let requiredVmCountSatisfied = true;
    for (const template in this.requiredVmCounts) {
      const requiredVmCount: number = this.requiredVmCounts[template];
      let currentVmCount = 0;
      environmentFormGroups.forEach(
        (vmTemplatesFormGroup: VmTemplatesFormGroup) => {
          if (Object.keys(vmTemplatesFormGroup.controls).includes(template)) {
            currentVmCount += vmTemplatesFormGroup.controls[template].value;
          }
        },
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
  }

  public setupAdvancedVMPage(ea: EnvironmentAvailability) {
    const vmTemplateMappings: VmTemplatesFormGroup =
      new FormGroup<VmTemplateMappings>({});
    const templates = this.getTemplates(ea.environment);
    for (const template in this.requiredVmCounts) {
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

  public checkIfSimplePageCanBeDone() {
    const simpleUserCounts: Record<string, number> = {};
    for (const env in this.uneditedScheduledEvent.required_vms) {
      const entries = Object.entries(this.se.required_vms[env]);
      const lastEntry = entries.pop();

      if (!lastEntry) {
        // Skip empty environment ... the current environment does not contain required vms
        continue;
      }

      // @count is the required number of VMs based on @template for the environment @env, specified in the scheduled event spec
      const [template, count] = lastEntry;
      // @this.requiredVmCounts[<template>] is the number of VMs based on <template> that is required per user for the scheduled event
      const userRatio = Math.ceil(count / this.requiredVmCounts[template]); // Calculate ratio of VMs, for example when 2 are needed but 4 are present 2 users could use them.
      // if userRatio is not a true integer
      if (userRatio * this.requiredVmCounts[template] != count) {
        return false;
      }

      // Check if all entries in the environment have the same "userRatio"
      const consistentUserRatio = entries.every(
        ([tmpTemplate, tmpCount]) =>
          this.requiredVmCounts[tmpTemplate] * userRatio === tmpCount,
      );

      if (!consistentUserRatio) {
        return false;
      }
      simpleUserCounts[env] = userRatio;
    }

    this.simpleUserCounts = simpleUserCounts;
    return true;
  }

  public setupSimpleVMPage(ea: EnvironmentAvailability) {
    // go through each required VM (and its count) and verify that a) it exists in the selected environment and b) there is a minimum count that supports a single user
    // (otherwise don't list it)
    let meetsCriteria = true;
    Object.keys(this.requiredVmCounts).forEach((requiredVm: string) => {
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
    });

    if (meetsCriteria) {
      let initVal = 0;
      if (this.simpleUserCounts[ea.environment]) {
        initVal = this.simpleUserCounts[ea.environment] || 0; // so we don't blow away old input values when rebuilding this form
      }
      const newControl = this._fb.control(initVal, [
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
        Object.keys(this.requiredVmCounts).forEach((template) => {
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
    this.maxUserCounts = {};
    // we need to get the number of VMs of each type that a user needs
    // then divide that amount by the number of _available_ VMs, arriving at a max.
    // this max will be passed to the Angular FormControl as a max() validator.
    // it also will be displayed on the page for the users knowledge
    this.selectedEnvironments.forEach((se) => {
      // for each environment, get the templates supported by that environment
      let min = Number.MAX_SAFE_INTEGER;
      Object.keys(se.available_count).forEach((template) => {
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
    this.selectedscenarios.forEach((ss) => {
      // ss is selectedscenario, i is index
      const vmCountPerTemplate: Record<string, number> = {}; // this will be map[string]int, where string is vm template and int is required count for this scenario.
      ss.virtualmachines.forEach((vmset) => {
        // vmset is virtualmachineset, j is index
        // 1. sum up count of vms needed for this scenario.
        Object.values(vmset).forEach((template) => {
          // tmeplate is vmtemplate name, k is index
          if (vmCountPerTemplate[template]) {
            vmCountPerTemplate[template]++;
          } else {
            vmCountPerTemplate[template] = 1;
          }
        });
      });
      // 2. Set the required VM count to the maximum count of VMs needed in one scenario.
      for (const template in vmCountPerTemplate) {
        if (this.requiredVmCounts[template]) {
          this.requiredVmCounts[template] = Math.max(
            vmCountPerTemplate[template],
            this.requiredVmCounts[template],
          );
        } else {
          this.requiredVmCounts[template] = vmCountPerTemplate[template];
        }
      }
    });
    this.selectedcourses.forEach((sc) => {
      // sc is selected course, i is index
      const vmCountPerTemplate: Record<string, number> = {};
      sc.virtualmachines.forEach((vmset) => {
        // vmset is virtualmachineset, j is index
        // 1. sum up count of vms needed for this course.
        Object.values(vmset).forEach((template: string) => {
          // template is vmtemplate name, k is index
          if (vmCountPerTemplate[template]) {
            vmCountPerTemplate[template]++;
          } else {
            vmCountPerTemplate[template] = 1;
          }
        });
      });

      // 2. Set the required VM count to the maximum count of VMs needed
      for (const template in vmCountPerTemplate) {
        if (this.requiredVmCounts[template]) {
          this.requiredVmCounts[template] = Math.max(
            vmCountPerTemplate[template],
            this.requiredVmCounts[template],
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
    this.checkingEnvironments = true;
    if (this.event) {
      this.isEditMode = true;
      this.simpleMode = false;
      this.se = this.event;
      this.uneditedScheduledEvent = structuredClone(this.event);
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

      //Test if simple mode can be done
      this.calculateRequiredVms();
      if (this.checkIfSimplePageCanBeDone()) {
        this.simpleMode = true;
      }

      this.rbacService
        .Grants('environments', 'list')
        .then((allowListEnvironments: boolean) => {
          if (allowListEnvironments) {
            this.checkEnvironments();
          } else {
            this.checkingEnvironments = false;
          }
        })
        .catch(() => {
          this.checkingEnvironments = false;
        });
    } else {
      // If we do not edit an existing environment but create a new one, we do not need to check environments
      this.checkingEnvironments = false;
      this.isEditMode = false;
      this.se = new ScheduledEventBase();
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
    this.ses.list().subscribe((se: ScheduledEventBase[]) => {
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
    this.noEnvironmentsAvailable = false;
    this.unavailableVMTs = [];
    const templates: Map<string, boolean> = new Map();

    // add all chosen templates to the list
    this.selectedscenarios.forEach((s: Scenario) => {
      s.virtualmachines.forEach((se) => {
        Object.entries(se).forEach((ee: string[]) =>
          templates.set(ee[1], true),
        );
      });
    });
    this.selectedcourses.forEach((c: Course) => {
      c.virtualmachines.forEach((se) => {
        Object.entries(se).forEach((ee: string[]) =>
          templates.set(ee[1], true),
        );
      });
    });

    //If there are no templates needed, we do not need virtual machines and have content only scenarios / courses
    this.noVirtualMachinesNeeded = templates.size == 0;

    if (this.noVirtualMachinesNeeded) {
      this.noEnvironmentsAvailable = true;
      this.unavailableVMTs = [];
      this.availableEnvironments = [];
      this.checkingEnvironments = false;
      return;
    }

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
            }
          });
          return pass;
        }),
        concatMap((e: Environment) => {
          if (this.se.start_time && this.se.end_time) {
            return this.es.available(
              e.name,
              this.se.start_time,
              this.se.end_time,
            );
          }
          return EMPTY;
        }),
        toArray(),
        defaultIfEmpty([]),
      )
      .subscribe((ea: EnvironmentAvailability[]) => {
        this.availableEnvironments = ea;
        this.noEnvironmentsAvailable = ea.length == 0 ? true : false;

        ea.forEach((e) => {
          Object.keys(e.available_count).forEach((vmt) => {
            templates.delete(vmt);
          });
        });

        this.unavailableVMTs = Array.from(templates.keys());

        if (this.event) {
          const currentSe = this.event;
          // we are updating instead of creating new
          // so we need to select the environments

          //increase the number of available VMs by the count of VMs currently set for this event (we can still use them)
          this.availableEnvironments = this.availableEnvironments.map(
            (ea: EnvironmentAvailability) => {
              if (currentSe.required_vms[ea.environment]) {
                for (const [vmt, count] of Object.entries(ea.available_count)) {
                  if (currentSe.required_vms[ea.environment][vmt]) {
                    ea.available_count[vmt] =
                      count + currentSe.required_vms[ea.environment][vmt];
                  }
                }
              }
              return ea;
            },
          );

          this._mapExistingEnvironments(Object.keys(this.event.required_vms));
        } else if (Object.keys(this.vmCounts.controls).length > 0) {
          // there exists fields filled in for vm counts - user probably went back in the form
          this._mapExistingEnvironments(Object.keys(this.vmCounts.controls));
        }
        this.setupVMSelection();
        this.checkingEnvironments = false;
      });
  }

  private _mapExistingEnvironments(envs: string[]) {
    this.selectedEnvironments = [];
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
      const curScenario = scenarioMap.get(sid);
      if (curScenario) {
        this.selectedscenarios.push(curScenario);
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
      const curCourse = courseMap.get(cid);
      if (curCourse) {
        this.selectedcourses.push(curCourse);
      }
    });
  }

  public quicksetEndtimeForm: QuickSetEndTimeFormGroup = this._fb.group(
    {
      quickset_endtime: this._fb.control(1, [Validators.required]),
      quickset_unit: this._fb.control<'h' | 'd' | 'w' | 'm'>('w', [
        Validators.required,
      ]),
    },
    { validators: QuicksetValidator },
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
    if ((qe.dirty || qe.touched) && qe.invalid && qe.errors?.required) {
      return true;
    } else if ((qu.dirty || qu.touched) && qu.invalid && qu.errors?.required) {
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
          Date.now() + 7 * 24 * 3600 * 1000 * duration,
        );
        break;
      case 'm': {
        let days = 0;
        const today = new Date();
        for (let i = 0; i < duration; i++) {
          days += this.daysPerMonth(i, today);
        }
        this.se.end_time = new Date(Date.now() + 24 * 3600 * 1000 * days);
        break;
      }
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
    this.se = new ScheduledEventBase();
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
      this.advancedVmPageValidator(),
    );
  }

  public close() {
    if (!this.saving) {
      this.resetEventDetails();
    } else {
      this.saving = false;
    }
    this.onCloseFn?.();
  }

  public setOnCloseFn(fn: () => void) {
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

    //no environment selected but VMs are required
    if (
      this.selectedEnvironments.length == 0 &&
      !this.noVirtualMachinesNeeded
    ) {
      return true;
    }

    //vm count is valid
    if (
      (!this.simpleMode &&
        !this.vmCounts.valid &&
        !this.noVirtualMachinesNeeded) ||
      (this.simpleMode &&
        !this.simpleModeVmCounts.valid &&
        !this.noVirtualMachinesNeeded)
    ) {
      return true;
    }

    //valid VM details
    if (
      (this.se.start_time &&
        this.se.end_time &&
        this.se.start_time >= this.se.end_time) ||
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
    let se: ScheduledEvent;
    if (!this.se.start_time || !this.se.end_time) {
      console.error('start_time or end_time not defined');
      return;
    } else {
      // make sure start_time and end_time are defined
      se = {
        ...this.se,
        start_time: this.se.start_time,
        end_time: this.se.end_time,
      };
    }
    if (this.event) {
      this.ses.update(se).subscribe({
        next: () => {
          this.updated.next(true);
        },
        error: () => {
          this.updated.next(true);
        },
      });
    } else {
      this.ses.create(se).subscribe({
        next: () => {
          this.updated.next(true);
        },
        error: () => {
          this.updated.next(true);
        },
      });
    }
    this.close();
  }
  setScenarioList(values: Scenario[]) {
    this.filteredScenarios = values;
  }

  getVirtualMachineTemplateName(template: string): string {
    return this.virtualMachineTemplateList.get(template) ?? template;
  }

  getEnvironmentName(environment: string): string {
    const env = this.environments.find((e) => e.name === environment);
    return env?.display_name ?? environment;
  }

  updateFormValues() {
    this.copyEventDetails();
    this.copyVMCounts();
  }

  isStartDateAsEditedCheck() {
    return this.uneditedScheduledEvent.start_time
      ? this.se.start_time?.getTime() !==
          this.uneditedScheduledEvent.start_time.getTime()
      : false;
  }

  isEndDateAsEditedCheck() {
    return this.uneditedScheduledEvent.end_time
      ? this.se.end_time?.getTime() !==
          this.uneditedScheduledEvent.end_time.getTime()
      : false;
  }

  isScenarioInList(scenario: string, list?: string[]): boolean {
    return list ? list.includes(scenario) : false;
  }
  isCourseInList(course: string, list?: string[]): boolean {
    return list ? list.includes(course) : false;
  }

  getUneditedScheduledEventVMCount(environment: string, vmtemplate: string) {
    return (
      this.uneditedScheduledEvent.required_vms[environment]?.[vmtemplate] ?? 0
    );
  }
}
