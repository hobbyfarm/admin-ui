import { Component, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ClrModal } from '@clr/angular';
import { Step } from '../data/step';
import { ServerResponse } from '../data/serverresponse';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
})
export class ScenarioComponent implements OnInit {
  public unusedSelectedScenario: any = {}; // only exists to satisfy a datagrid requirement

  public scenarios: Scenario[] = [];
  public selectedscenario: Scenario;
  public editingStep: Step = new Step();
  public editingIndex: number = 0;

  public editDangerClosed: boolean = true;
  public editSuccessClosed: boolean = true;

  public editDangerAlert: string = "";
  public editSuccessAlert: string = "";

  public deletingVMSetIndex: number = 0;

  constructor(
    public scenarioService: ScenarioService
  ) { }

  @ViewChild("editmodal") editModal: ClrModal;
  @ViewChild("deletevmsetmodal") deleteVMSetModal: ClrModal;

  openEdit(s: Step, i: number) {
    this.editingStep = s;
    this.editingIndex = i;
    this.editModal.open();
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

  addVMSet() {
    this.selectedscenario.virtualmachines.push(new Map());
  }

  deleteVMSet(i: number) {
    console.log(i);
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
