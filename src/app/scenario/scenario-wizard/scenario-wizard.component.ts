import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrModal, ClrWizard } from '@clr/angular';
import { RbacService } from 'src/app/data/rbac.service';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { KeepaliveValidator } from 'src/app/validators/keepalive.validator';
import { StepsScenarioComponent } from '../steps-scenario/steps-scenario.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryFormGroup, ScenarioFormGroup } from 'src/app/data/forms';
import { AlertDetails } from 'src/app/alert/alert';
import { ClrAlertType } from 'src/app/clr-alert-type';

@Component({
  selector: 'scenario-wizard',
  templateUrl: './scenario-wizard.component.html',
  styleUrls: ['./scenario-wizard.component.scss'],
})
export class ScenarioWizardComponent implements OnInit {
  @Output()
  onWizardFinished: EventEmitter<AlertDetails> =
    new EventEmitter<AlertDetails>();

  public wizardMode: 'create' | 'edit' = 'create';
  public wizardTitle: 'Create new Scenario' | 'Edit Scenario' =
    'Create new Scenario';

  public _open: boolean = false;
  public selectRbac: boolean = false;
  public deleteVMSetOpen: boolean = false;
  public createVMOpen: boolean = false;
  public newCategory: boolean = false;
  public newTag: boolean = false;

  public deletingVMSetIndex: number = 0;
  public newvmindex: number = 0;
  public stepsToBeAdded: number = 0;
  public deletingStepIndex: number = 0;
  public editingIndex: number = 0;

  public vmtemplates: VMTemplate[] = [];

  public selectedscenario: Scenario;

  get keepaliveRequired() {
    const ka = this.scenarioDetails.controls.keepalive_amount;
    const ku = this.scenarioDetails.controls.keepalive_unit;

    // validate
    if ((ka.dirty || ka.touched) && ka.invalid && ka.errors.required) {
      return true;
    } else if ((ku.dirty || ku.touched) && ku.invalid && ku.errors.required) {
      return true;
    } else {
      return false;
    }
  }

  @ViewChild('deletevmsetmodal', { static: true }) deleteVMSetModal: ClrModal;
  @ViewChild('createvmmodal', { static: true }) createVMModal: ClrModal;
  @ViewChild('stepsscenario', { static: true })
  stepScenario: StepsScenarioComponent;

  constructor(
    public scenarioService: ScenarioService,
    public vmTemplateService: VmtemplateService,
    public rbacService: RbacService
  ) {}

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;

  public scenarioDetails: ScenarioFormGroup = new FormGroup(
    {
      scenario_name: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      scenario_description: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      keepalive_amount: new FormControl<number>(10, {
        validators: Validators.required,
        nonNullable: true,
      }),
      keepalive_unit: new FormControl<string>('m', {
        validators: Validators.required,
        nonNullable: true,
      }),
      pause_duration: new FormControl<number>(1, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]+$'),
        ],
        nonNullable: true,
      }),
    },
    { validators: KeepaliveValidator }
  );

  public vmform: FormGroup<{
    vm_name: FormControl<string | null>;
    vm_template: FormControl<string | null>;
  }> = new FormGroup({
    vm_name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(4),
    ]),
    vm_template: new FormControl<string | null>(null, [Validators.required]),
  });

  public newCategoryForm: CategoryFormGroup = new FormGroup({
    category: new FormControl<string | null>(null, [Validators.required]),
  });
  public newTagForm: FormGroup<{
    tag: FormControl<string>;
  }> = new FormGroup({
    tag: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit() {
    // let's initialize our selected scenario to prevent TypeErrors in our HTML template
    this._initSelectedScenario();
    // "Get" Permission on scenarios is required to load step content
    this.rbacService.Grants('scenarios', 'get').then((allowed: boolean) => {
      this.selectRbac = allowed;
    });

    this.rbacService
      .Grants('virtualmachinesets', 'list')
      .then((listVmSets: boolean) => {
        if (listVmSets) {
          this.vmTemplateService.list().subscribe((v: VMTemplate[]) => {
            this.vmtemplates = v;
          });
        }
      });
  }

  open(wizardMode: 'create' | 'edit', scenario?: Scenario) {
    this.wizardMode = wizardMode;
    if (this.wizardMode == 'create') {
      this._createScenarioWizardfunction();
    } else {
      // this wizardMode == 'edit'
      this._editScenarioWizardfunction(scenario);
    }
  }

  doCancel(): void {
    this.wizard.reset();
    this.resetScenarioForm();

    this.wizard.close();
  }

  finishScenario() {
    if (this.wizardMode == 'create') this.saveCreatedScenario();
    if (this.wizardMode == 'edit') this.saveUpdatedScenario();
  }

  saveCreatedScenario() {
    this.scenarioService.create(this.selectedscenario).subscribe({
      next: (s: Scenario) => {
        this.onWizardFinished.emit({
          type: ClrAlertType.Success,
          message: `Scenario ${s.name} created`,
          closable: true,
          duration: 3000,
        });
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage: string = e.message;
        this.onWizardFinished.emit({
          type: ClrAlertType.Danger,
          message: errorMessage,
          closable: true,
          duration: 3000,
        });
      },
    });
    this.resetScenarioForm();
  }

  public copyScenarioDetails() {
    this.selectedscenario.keepalive_duration =
      this.scenarioDetails.controls.keepalive_amount.value +
      this.scenarioDetails.controls.keepalive_unit.value;
    this.selectedscenario.pause_duration =
      this.scenarioDetails.controls.pause_duration.value + 'h';
    this.selectedscenario.name =
      this.scenarioDetails.controls.scenario_name.value;
    this.selectedscenario.description =
      this.scenarioDetails.controls.scenario_description.value;
  }

  saveUpdatedScenario() {
    if(!this.selectedScenarioHasVM()){
      this.selectedscenario.virtualmachines = [];
    }

    this.scenarioService
      .update(this.selectedscenario)
      .subscribe((s: ServerResponse) => {
        if (s.type == 'updated') {
          this.onWizardFinished.emit({
            type: ClrAlertType.Success,
            message: `Scenario updated`,
            closable: true,
            duration: 3000,
          });
        } else {
          const errorMsg = 'Unable to update scenario: ' + s.message;
          this.onWizardFinished.emit({
            type: ClrAlertType.Success,
            message: errorMsg,
            closable: true,
            duration: 3000,
          });
        }
      });
  }
  resetScenarioForm() {
    this.wizard.reset();
    this.scenarioDetails.reset({
      keepalive_amount: 10,
      keepalive_unit: 'm',
      pause_duration: 1,
    });
    this.selectedscenario.virtualmachines = [];
    this.selectedscenario.steps = [];
    this.selectedscenario.categories = [];
    this.selectedscenario.tags = [];
  }
  addCategory() {
    const categories: string[] | undefined =
      this.newCategoryForm.controls.category.value?.split(',');
    categories?.forEach((category) => {
      category = category.replace(/\s/g, ''); //remove all whitespaces
      if (
        category != '' &&
        !this.selectedscenario.categories.includes(category)
      ) {
        this.selectedscenario.categories.push(category);
      }
    });
    this.newCategoryForm.reset();
    this.newCategory = false;
  }
  deleteCategory(category: string) {
    this.selectedscenario.categories.forEach((element, index) => {
      if (element == category)
        this.selectedscenario.categories.splice(index, 1);
    });
  }
  addTag() {
    const tags: string[] | undefined =
      this.newTagForm.controls.tag.value?.split(',');
    tags?.forEach((tag) => {
      tag = tag.replace(/\s/g, ''); //remove all whitespaces
      if (tag != '' && !this.selectedscenario.tags.includes(tag)) {
        this.selectedscenario.tags.push(tag);
      }
    });
    this.newTagForm.reset();
    this.newTag = false;
  }
  deleteTag(tag: string) {
    this.selectedscenario.tags.forEach((element, index) => {
      if (element == tag) this.selectedscenario.tags.splice(index, 1);
    });
  }

  selectedScenarioHasVMSet(): boolean {
    return this.selectedscenario.virtualmachines.length > 0
  }

  selectedScenarioHasVM(): boolean {
    if (this.selectedscenario.virtualmachines.length > 0) {
      const validVMSet = this.selectedscenario.virtualmachines.filter(
        (virtualmachine, i) => {
          if (Object.keys(virtualmachine).length > 0) {
            return true;
          }
          return false;
        }
      );
      if (validVMSet.length == this.selectedscenario.virtualmachines.length) {
        return true;
      }
    }
    return false;
  }

  addVMSet() {
    this.selectedscenario.virtualmachines.push({});
  }

  addVM() {
    this.selectedscenario.virtualmachines[this.newvmindex][
      this.vmform.controls.vm_name.value
    ] = this.vmform.controls.vm_template.value;
    this.createVMModal.close();
  }

  deleteVMSet(i: number) {
    this.deletingVMSetIndex = i;
    this.deleteVMSetModal.open();
  }

  public deleteVM(setIndex: number, key: string) {
    delete this.selectedscenario.virtualmachines[setIndex][key];
  }

  doDeleteVMSet() {
    this.selectedscenario.virtualmachines.splice(this.deletingVMSetIndex, 1);
    this.deleteVMSetModal.close();
  }

  public openCreateVM(i: number) {
    this.vmform.reset();
    this.newvmindex = i;
    this.createVMModal.open();
  }

  private _editScenarioWizardfunction(scenario?: Scenario) {
    if (!scenario) {
      // somehow scenario is undefined -> display an error alert
      this.onWizardFinished.emit({
        type: ClrAlertType.Danger,
        message:
          'Could not edit scenario. The provided scenario is not defined.',
      });
    }
    this.wizardTitle = 'Edit Scenario';
    this._editScenario(scenario);
  }

  private _editScenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id).subscribe({
        next: (s: Scenario) => {
          this.selectedscenario = s;
          this.scenarioDetails.reset({
            scenario_name: s.name,
            scenario_description: s.description,
            keepalive_amount: Number(
              s.keepalive_duration.substring(0, s.keepalive_duration.length - 1)
            ),
            keepalive_unit: s.keepalive_duration.substring(
              s.keepalive_duration.length - 1,
              s.keepalive_duration.length
            ),
          });
          const pauseDuration = Number(s.pause_duration?.slice(0, -1));
          if (!Number.isNaN(pauseDuration)) {
            this.scenarioDetails.patchValue({
              pause_duration: pauseDuration,
            });
          }
          this.wizard.navService.goTo(this.wizard.pages.last, true);
          this.wizard.pages.first.makeCurrent();
          this.wizard.open();
        },
        error: () => {
          this.onWizardFinished.emit({
            type: ClrAlertType.Danger,
            message: 'error editing scenario',
            closable: true,
            duration: 3000,
          });
        },
      });
    }
  }

  private _createScenarioWizardfunction() {
    this.wizardTitle = 'Create new Scenario';
    this.resetScenarioForm();
    this._initSelectedScenario();
    this.wizard.open();
  }

  private _initSelectedScenario() {
    this.selectedscenario = new Scenario();
    this.selectedscenario.id = '';
    this.selectedscenario.name = '';
    this.selectedscenario.virtualmachines = [];
    this.selectedscenario.tags = [];
    this.selectedscenario.steps = [];
    this.selectedscenario.virtualmachines[0] = {};
    this.selectedscenario.categories = [];
  }
}
