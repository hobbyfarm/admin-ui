import { Component, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ClrDatagridSortOrder, ClrModal } from '@clr/angular';
import { ServerResponse } from '../data/serverresponse';
import { VirtualMachine } from '../data/virtualmachine';
import { RbacService } from '../data/rbac.service';
import { FilterScenariosComponent } from '../filter-scenarios/filter-scenarios.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ScenarioWizardComponent } from './scenario-wizard/scenario-wizard.component';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
})
export class ScenarioComponent implements OnInit {

  public filteredScenarios: Scenario[] = [];
  public selectedscenario: Scenario;


  public scenarioAdded = false;

  public scenarioTainted: boolean = false;

  public editDangerClosed: boolean = true;
  public editSuccessClosed: boolean = true;
  public scenarioDangerClosed: boolean = true;
  public scenarioSuccessClosed: boolean = true;

  public editDangerAlert: string = '';
  public editSuccessAlert: string = '';
  public scenarioDangerAlert: string = '';
  public scenarioSuccessAlert: string = '';



  public alertType: string = 'warning';
  public isAlert: boolean = false;
  public modified: boolean = false;

  public newScenario: Scenario = new Scenario();

  public vmProps: string[] = Object.keys(new VirtualMachine());

  public selectRbac: boolean = false;

  public ascSort = ClrDatagridSortOrder.ASC;

  constructor(
    public scenarioService: ScenarioService,
    public rbacService: RbacService
  ) {}

  @ViewChild('deletescenariomodal', { static: true })
  deleteScenarioModal: ClrModal;

  @ViewChild('scenarioFilter', { static: true })
  scenarioFilter: FilterScenariosComponent;
  @ViewChild('myForm') formData: any;
  @ViewChild('scenariowizard', { static: true })
  scenarioWizard: ScenarioWizardComponent;
  @ViewChild('editselectedscenariowizard', {static: true}) editSelectedScenarioWizard: ScenarioWizardComponent;

  editScenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id).subscribe((s: Scenario) => {
        this.selectedscenario = s;
      });
    }
  }

  openScenario() {
    this.scenarioWizard.open();
  }

  editSelectedScenario(scenario: Scenario){
    this.editSelectedScenarioWizard.editScenarioWizardfunction(scenario)
    this.editSelectedScenarioWizard.open();
  }

  openDeleteScenario(scenario: Scenario) {
    this.scenarioService.get(scenario.id).subscribe(
      (scenario) => (this.selectedscenario = scenario),
      (e: HttpErrorResponse) =>
        this.alertDanger('Error deleting object: ' + e.error.message)
    );
    this.deleteScenarioModal.open();
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


  setScenarioList(scenarios: Scenario[]) {
    this.filteredScenarios = scenarios;
    if (this.scenarioAdded) {
      this.scenarioAdded = false;
    }
  }

  refresh(): void {
    this.scenarioService
      .list(true)
      .subscribe((sList: Scenario[]) => (this.filteredScenarios = sList));
  }

  deleteScenario(scenarioId: string) {
    this.scenarioService.delete(scenarioId).subscribe(
      (s: ServerResponse) => {
        this.alertSuccess('Scenario deleted');
        this.refresh();
      },
      (e: HttpErrorResponse) => {
        this.alertDanger('Error deleting object: ' + e.error.message);
      }
    );
  }

    doDeleteScenario() {
    this.deleteScenario(this.selectedscenario.id);
    this.deleteScenarioModal.close();
    this.selectedscenario = this.filteredScenarios[this.filteredScenarios.length - 1];
  }

  alertSuccess(msg: string) {
    this.alertType = 'success';
    this.scenarioDangerAlert = msg;
    this.isAlert = true;
    setTimeout(() => (this.isAlert = false), 1000);
  }

  alertDanger(msg: string) {
    this.alertType = 'danger';
    this.scenarioDangerAlert = msg;
    this.isAlert = true;
    setTimeout(() => (this.isAlert = false), 3000);
  }
  ngOnInit() {
    this.selectedscenario = new Scenario();
    this.selectedscenario.name = '';
    this.selectedscenario.virtualmachines = [];
    this.selectedscenario.steps = [];
    this.selectedscenario.virtualmachines[0] = {};
    // "Get" Permission on scenarios is required to load step content
    this.rbacService.Grants('scenarios', 'get').then((allowed: boolean) => {
      this.selectRbac = allowed;
    });
  }
  reloadScenario(){
    this.scenarioFilter.reloadScenarios();
    this.alertSuccess('Course successfully updated');
  }
}
