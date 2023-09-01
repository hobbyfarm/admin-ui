import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ClrDatagridSortOrder, ClrModal } from '@clr/angular';
import { Step } from '../data/step';
import { ServerResponse } from '../data/serverresponse';
import { deepCopy } from '../deepcopy';
import { VmtemplateService } from '../data/vmtemplate.service';
import { VMTemplate } from '../data/vmtemplate';
import { VirtualMachine } from '../data/virtualmachine';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeepaliveValidator } from '../validators/keepalive.validator';
import { RbacService } from '../data/rbac.service';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
})
export class ScenarioComponent implements OnInit {
  public unusedSelectedScenario: any = {}; // only exists to satisfy a datagrid requirement

  public filteredScenarios: Scenario[] = [];
  public vmtemplates: VMTemplate[] = [];
  public selectedscenario: Scenario;
  public editingStep: Step = new Step();
  public editingIndex: number = 0;

  public scenarioTainted: boolean = false;

  public editDangerClosed: boolean = true;
  public editSuccessClosed: boolean = true;
  public scenarioDangerClosed: boolean = true;
  public scenarioSuccessClosed: boolean = true;

  public editDangerAlert: string = '';
  public editSuccessAlert: string = '';
  public scenarioDangerAlert: string = '';
  public scenarioSuccessAlert: string = '';
  public newvmindex: number = 0;

  public deletingVMSetIndex: number = 0;
  public deletingStepIndex: number = 0;

  public editOpen: boolean = false;
  public deleteVMSetOpen: boolean = false;
  public deleteStepOpen: boolean = false;
  public createVMOpen: boolean = false;
  public newScenarioOpen: boolean = false;

  public newCategory: boolean = false;
  public newTag: boolean = false;

  public newScenario: Scenario = new Scenario();

  public vmProps: string[] = Object.keys(new VirtualMachine());

  public selectRbac: boolean = false;

  public ascSort = ClrDatagridSortOrder.ASC;

  constructor(
    public scenarioService: ScenarioService,
    public vmTemplateService: VmtemplateService,
    public rbacService: RbacService
  ) {}

  public vmform: FormGroup = new FormGroup({
    vm_name: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
    ]),
    vm_template: new FormControl(null, [Validators.required]),
  });

  public editScenarioForm: FormGroup = new FormGroup(
    {
      scenario_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      scenario_description: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      keepalive_amount: new FormControl(10, [Validators.required]),
      keepalive_unit: new FormControl('m', [Validators.required]),
      pause_duration: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]+$'),
      ]),
    },
    { validators: KeepaliveValidator }
  );

  public scenarioDetails: FormGroup = new FormGroup(
    {
      scenario_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      scenario_description: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      keepalive_amount: new FormControl(10, [Validators.required]),
      keepalive_unit: new FormControl('m', [Validators.required]),
      pause_duration: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]+$'),
      ]),
    },
    { validators: KeepaliveValidator }
  );

  public newCategoryForm: FormGroup = new FormGroup({
    category: new FormControl(null, [Validators.required]),
  });

  public newTagForm: FormGroup = new FormGroup({
    tag: new FormControl(null, [Validators.required]),
  });

  get keepaliveAmount() {
    return this.scenarioDetails.get('keepalive_amount');
  }

  get keepaliveUnit() {
    return this.scenarioDetails.get('keepalive_unit');
  }

  get keepaliveRequired() {
    var ka = this.scenarioDetails.get('keepalive_amount');
    var ku = this.scenarioDetails.get('keepalive_unit');

    // validate
    if ((ka.dirty || ka.touched) && ka.invalid && ka.errors.required) {
      return true;
    } else if ((ku.dirty || ku.touched) && ku.invalid && ku.errors.required) {
      return true;
    } else {
      return false;
    }
  }

  @ViewChild('editmodal', { static: true }) editModal: ClrModal;
  @ViewChild('deletevmsetmodal', { static: true }) deleteVMSetModal: ClrModal;
  @ViewChild('createvmmodal', { static: true }) createVMModal: ClrModal;
  @ViewChild('deletestepmodal', { static: true }) deleteStepModal: ClrModal;
  @ViewChild('newscenariomodal', { static: true }) newScenarioModal: ClrModal;

  openEdit(s: Step, i: number) {
    if (this.selectedscenario.steps.length == 0) {
      this.openNewStep();
      return;
    }
    this.editingStep = s;
    this.editingIndex = i;
    this.editModal.open();
  }

  editScenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id).subscribe((s: Scenario) => {
        this.selectedscenario = s;
        this.editScenarioForm.reset({
          scenario_name: s.name,
          scenario_description: s.description,
          keepalive_amount: s.keepalive_duration.substring(
            0,
            s.keepalive_duration.length - 1
          ),
          keepalive_unit: s.keepalive_duration.substring(
            s.keepalive_duration.length - 1,
            s.keepalive_duration.length
          ),
          pause_duration: s.pause_duration.substring(
            0,
            s.pause_duration.length - 1
          ),
        });
      });
    }
  }

  openNewScenario() {
    this.newScenario = new Scenario();
    this.newScenarioModal.open();
  }

  openNewStep() {
    this.editingIndex = this.selectedscenario.steps.length;
    this.editingStep = new Step();
    this.editingStep.title = 'Step ' + (this.editingIndex + 1);
    // Provide default content with syntax examples
    this.editingStep.content =
      "## Your Content\n```ctr:node1\necho 'hello world'\n```\n```hidden:Syntax reference\navailable at [the hobbyfarm docs](https://hobbyfarm.github.io/docs/appendix/markdown_syntax/)\n```";
    this.selectedscenario.steps[this.editingIndex] = this.editingStep;
    this.editModal.open();
  }

  isFirstStep() {
    return this.editingIndex == 0;
  }

  isLastStep() {
    return this.editingIndex >= this.selectedscenario?.steps.length - 1;
  }

  nextStep() {
    if (this.isLastStep()) {
      return;
    }
    this.selectedscenario.steps[this.editingIndex] = this.editingStep;
    this.editingIndex++;
    this.editingStep = this.selectedscenario.steps[this.editingIndex];
  }

  previousStep() {
    if (this.isFirstStep()) {
      return;
    }
    this.selectedscenario.steps[this.editingIndex] = this.editingStep;
    this.editingIndex--;
    this.editingStep = this.selectedscenario.steps[this.editingIndex];
  }

  public openDeleteStep(i: number) {
    this.deletingStepIndex = i;
    this.deleteStepModal.open();
  }

  public doDeleteStep() {
    this.selectedscenario.steps.splice(this.deletingStepIndex, 1);
    this.deleteStepModal.close();
    this.savescenario();
  }

  private _displayAlert(alert: string, success: boolean, duration?: number) {
    if (success) {
      this.scenarioSuccessAlert = alert;
      this.scenarioSuccessClosed = false;
      setTimeout(() => {
        this.scenarioSuccessClosed = true;
      }, duration || 1000);
    } else {
      this.scenarioDangerAlert = alert;
      this.scenarioDangerClosed = false;
      setTimeout(() => {
        this.scenarioDangerClosed = true;
      }, duration || 1000);
    }
  }

  public addNewScenario() {
    this.newScenario.name = this.scenarioDetails.get('scenario_name').value;
    this.newScenario.description = this.scenarioDetails.get(
      'scenario_description'
    ).value;
    this.newScenario.keepalive_duration =
      this.scenarioDetails.get('keepalive_amount').value +
      this.scenarioDetails.get('keepalive_unit').value;
    this.newScenario.pause_duration =
      this.scenarioDetails.get('pause_duration').value + 'h';

    // should be able to save at this point
    this.scenarioService.create(this.newScenario).subscribe({
      next: (s: Scenario) => {
        this._displayAlert(s.name, true);
      },
      error: (s: string) => {
        this._displayAlert(s, false);
      },
    });

    this.newScenarioModal.close();
  }

  cancelEdit() {
    this.editModal.close();
  }

  saveStep() {
    this.selectedscenario.steps[this.editingIndex] = this.editingStep;
    this.scenarioService
      .update(this.selectedscenario)
      .subscribe((s: ServerResponse) => {
        if (s.type == 'updated') {
          this.editSuccessAlert = 'Steps successfully saved';
          this.editSuccessClosed = false;
          setTimeout(() => {
            this.editSuccessClosed = true;
            this.editModal.close();
          }, 1000);
        } else {
          this.editDangerAlert = 'Unable to save steps: ' + s.message;
          this.editDangerClosed = false;
          setTimeout(() => {
            this.editDangerClosed = true;
          }, 1000);
        }
      });
  }

  public openCreateVM(i: number) {
    this.vmform.reset();
    this.newvmindex = i;
    this.createVMModal.open();
  }

  public deleteVM(setIndex: number, key: string) {
    this.scenarioTainted = true;
    delete this.selectedscenario.virtualmachines[setIndex][key];
  }

  addVM() {
    this.scenarioTainted = true;
    this.selectedscenario.virtualmachines[this.newvmindex][
      this.vmform.get('vm_name').value
    ] = this.vmform.get('vm_template').value;
    this.createVMModal.close();
  }

  savescenario() {
    this.selectedscenario.keepalive_duration =
      this.editScenarioForm.get('keepalive_amount').value +
      this.editScenarioForm.get('keepalive_unit').value;
    this.selectedscenario.pause_duration =
      this.editScenarioForm.get('pause_duration').value + 'h';
    this.selectedscenario.name =
      this.editScenarioForm.get('scenario_name').value;
    this.selectedscenario.description = this.editScenarioForm.get(
      'scenario_description'
    ).value;

    this.scenarioService
      .update(this.selectedscenario)
      .subscribe((s: ServerResponse) => {
        if (s.type == 'updated') {
          this.scenarioSuccessAlert = 'Scenario updated';
          this.scenarioSuccessClosed = false;
          setTimeout(() => {
            this.scenarioSuccessClosed = true;
            this.scenarioTainted = false;
          }, 1000);
        } else {
          this.scenarioDangerAlert = 'Unable to update scenario: ' + s.message;
          this.scenarioDangerClosed = false;
          setTimeout(() => {
            this.scenarioDangerClosed = true;
          }, 1000);
        }
      });
  }

  moveStepUp(i: number) {
    this.scenarioTainted = true;
    // get a copy of the to-be-moved item
    var obj = <Step>deepCopy(this.selectedscenario.steps[i]);
    // delete at the index currently
    this.selectedscenario.steps.splice(i, 1);
    // put into the i-1 index
    this.selectedscenario.steps.splice(i - 1, 0, obj);
  }

  moveStepDown(i: number) {
    this.scenarioTainted = true;
    // get a copy of the to-be-moved item
    var obj = <Step>deepCopy(this.selectedscenario.steps[i]);
    // delete at the index currently
    this.selectedscenario.steps.splice(i, 1);
    // put into the i+1 index
    this.selectedscenario.steps.splice(i + 1, 0, obj);
  }

  deleteCategory(category: string) {
    this.selectedscenario.categories.forEach((element, index) => {
      if (element == category)
        this.selectedscenario.categories.splice(index, 1);
    });
  }

  addCategory() {
    let categories = this.newCategoryForm.get('category').value;
    categories = categories.split(',');
    categories.forEach((category) => {
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

  deleteTag(tag: string) {
    this.selectedscenario.tags.forEach((element, index) => {
      if (element == tag) this.selectedscenario.tags.splice(index, 1);
    });
  }

  addTag() {
    let tags = this.newTagForm.get('tag').value;
    tags = tags.split(',');
    tags.forEach((tag) => {
      tag = tag.replace(/\s/g, ''); //remove all whitespaces
      if (tag != '' && !this.selectedscenario.tags.includes(tag)) {
        this.selectedscenario.tags.push(tag);
      }
    });
    this.newTagForm.reset();
    this.newTag = false;
  }

  addVMSet() {
    this.scenarioTainted = true;
    this.selectedscenario.virtualmachines.push({});
  }

  deleteVMSet(i: number) {
    this.scenarioTainted = true;
    this.deletingVMSetIndex = i;
    this.deleteVMSetModal.open();
  }

  doDeleteVMSet() {
    this.selectedscenario.virtualmachines.splice(this.deletingVMSetIndex, 1);
    this.deleteVMSetModal.close();
  }
  setScenarioList(scenarios: Scenario[]) {
    this.filteredScenarios = scenarios;
  }

  ngOnInit() {
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
}
