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
  public editingStep: string = "";
  public editingIndex: number = 0;

  public dangerAlertClosed: boolean = true;
  public successAlertClosed: boolean = true;

  public dangerAlertText: string = "";
  public successAlertText: string = "";

  constructor(
    public scenarioService: ScenarioService
  ) { }

  @ViewChild("editmodal") editModal: ClrModal;

  openEdit(s: Step, i: number) {
    this.editingStep = atob(s.content);
    this.editingIndex = i;
    this.editModal.open();
  }

  cancelEdit() {
    this.editModal.close();
  }

  saveStep() {
    this.selectedscenario.steps[this.editingIndex].content = btoa(this.editingStep);
    this.scenarioService.update(this.selectedscenario)
    .subscribe(
      (s: ServerResponse) => {
        if (s.type == "updated") {
          this.editModal.close();
          this.successAlertText = "Step successfully updated";
          this.successAlertClosed = false;
          setTimeout(() => this.successAlertClosed = true, 3000);
        } else {

        }
      }
    )
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
          (s: Scenario) => this.selectedscenario = s
        )
    }
  }

}
