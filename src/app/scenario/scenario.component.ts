import { Component, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ClrModal } from '@clr/angular';
import { Step } from '../data/step';
import { ServerResponse } from '../data/serverresponse';
import { deepCopy } from '../deepcopy';
import { VmtemplateService } from '../data/vmtemplate.service';
import { VMTemplate } from '../data/vmtemplate';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
})
export class ScenarioComponent implements OnInit {
  public unusedSelectedScenario: any = {}; // only exists to satisfy a datagrid requirement

  public scenarios: Scenario[] = [];
  public vmtemplates: VMTemplate[] = [];
  public selectedscenario: Scenario;
  public editingStep: Step = new Step();
  public editingIndex: number = 0;

  public scenarioTainted: boolean = false;

  public editDangerClosed: boolean = true;
  public editSuccessClosed: boolean = true;
  public scenarioDangerClosed: boolean = true;
  public scenarioSuccessClosed: boolean = true;

  public editDangerAlert: string = "";
  public editSuccessAlert: string = "";
  public scenarioDangerAlert: string = "";
  public scenarioSuccessAlert: string = "";
  public newvmindex: number = 0;

  public deletingVMSetIndex: number = 0;
  public deletingStepIndex: number = 0;

  public editOpen: boolean = false;
  public deleteVMSetOpen: boolean = false;
  public deleteStepOpen: boolean = false;
  public createVMOpen: boolean = false;
  public newScenarioOpen: boolean = false;

  public newScenario: Scenario = new Scenario();

  constructor(
    public scenarioService: ScenarioService,
    public vmTemplateService: VmtemplateService
  ) { }

  public vmform: FormGroup = new FormGroup({
    'vm_name': new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'vm_template': new FormControl(null, [
      Validators.required,
    ])
  })

  public scenarioDetails: FormGroup = new FormGroup({
    'scenario_name': new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'scenario_description': new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ])
  })

  @ViewChild("editmodal") editModal: ClrModal;
  @ViewChild("deletevmsetmodal") deleteVMSetModal: ClrModal;
  @ViewChild("createvmmodal") createVMModal: ClrModal;
  @ViewChild("deletestepmodal") deleteStepModal: ClrModal;
  @ViewChild("newscenariomodal") newScenarioModal: ClrModal;

  openEdit(s: Step, i: number) {
    this.editingStep = s;
    this.editingIndex = i;
    this.editModal.open();
  }

  openNewScenario() {
    this.newScenario = new Scenario();
    this.newScenarioModal.open();
  }

  openNewStep() {
    this.editingStep = new Step();
    this.editingIndex = this.selectedscenario.steps.length;
    this.editModal.open();
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
    this.newScenario.name = this.scenarioDetails.get("scenario_name").value;
    this.newScenario.description = this.scenarioDetails.get("scenario_description").value;
    // should be able to save at this point
    this.scenarioService.create(this.newScenario)
    .subscribe(
      (s: string) => {
        this._displayAlert(s, true);
      },
      (s: string) => {
        this._displayAlert(s, false);
      }
    )

    this.scenarioService.list()
    .subscribe(
      (s: Scenario[]) => this.scenarios = s
    )
    
    this.newScenarioModal.close();
  }

  cancelEdit() {
    this.editModal.close();
  }

  saveStep() {
    this.selectedscenario.steps[this.editingIndex] = this.editingStep;
    this.scenarioService.update(this.selectedscenario)
      .subscribe(
        (s: ServerResponse) => {
          if (s.type == "updated") {
            this.editSuccessAlert = "Step successfully updated";
            this.editSuccessClosed = false;
            setTimeout(() => {
              this.editSuccessClosed = true;
              this.editModal.close();
            }, 1000);
          } else {
            this.editDangerAlert = "Unable to update step: " + s.message;
            this.editDangerClosed = false;
            setTimeout(() => {
              this.editDangerClosed = true;
            }, 1000);
          }
        }
      )
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
    this.selectedscenario.virtualmachines[this.newvmindex][this.vmform.get('vm_name').value] = this.vmform.get('vm_template').value;
    this.createVMModal.close();
  }


  savescenario() {
    this.scenarioService.update(this.selectedscenario)
      .subscribe(
        (s: ServerResponse) => {
          if (s.type == "updated") {
            this.scenarioSuccessAlert = "Scenario updated";
            this.scenarioSuccessClosed = false;
            setTimeout(() => {
              this.scenarioSuccessClosed = true;
              this.scenarioTainted = false;
            }, 1000);
          } else {
            this.scenarioDangerAlert = "Unable to update scenario: " + s.message;
            this.scenarioDangerClosed = false;
            setTimeout(() => {
              this.scenarioDangerClosed = true;
            }, 1000);
          }
        }
      )
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

  ngOnInit() {
    this.scenarioService.list()
      .subscribe(
        (s: Scenario[]) => this.scenarios = s
      )

    this.vmTemplateService.list()
      .subscribe(
        (v: VMTemplate[]) => {
          this.vmtemplates = v;
        }
      )
  }

  getscenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id)
        .subscribe(
          (s: Scenario) => {
            this.selectedscenario = s;
          }
        )
    }
  }

}
