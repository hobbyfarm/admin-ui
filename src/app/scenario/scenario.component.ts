import { Component, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ClrDatagridSortOrder, ClrModal } from '@clr/angular';
import { ServerResponse } from '../data/serverresponse';
import { FilterScenariosComponent } from '../filter-scenarios/filter-scenarios.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ScenarioWizardComponent } from './scenario-wizard/scenario-wizard.component';
import { RbacService } from '../data/rbac.service';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
})
export class ScenarioComponent implements OnInit {
  public filteredScenarios: Scenario[] = [];
  public selectedscenario: Scenario;

  public scenarioAdded = false;

  public scenarioDangerClosed: boolean = true;
  public scenarioSuccessClosed: boolean = true;
  public deleteScenarioSetOpen: boolean = false;
  public showActionOverflow: boolean = false;

  public scenarioDangerAlert: string = '';
  public scenarioSuccessAlert: string = '';

  public alertType: string = 'warning';
  public errorMessage: string = '';

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
  @ViewChild('scenariowizard', { static: true })
  scenarioWizard: ScenarioWizardComponent;
  @ViewChild('editselectedscenariowizard', { static: true })
  editSelectedScenarioWizard: ScenarioWizardComponent;

  editScenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id).subscribe({
        next: (s: Scenario) => {
          this.selectedscenario = s;
        },
        error: (e: HttpErrorResponse) => {
          this.alertDanger('Error deleting object: ' + e.error.message);
        },
      });
    }
  }

  openScenario() {
    this.scenarioWizard.open();
  }

  editSelectedScenario(scenario: Scenario) {
    this.editSelectedScenarioWizard.editScenarioWizardfunction(scenario);
    this.editSelectedScenarioWizard.open();
  }

  openDeleteScenario(scenario: Scenario) {
    this.scenarioService.get(scenario.id).subscribe({
      next: (scenario) => (this.selectedscenario = scenario),
      error: (e: HttpErrorResponse) => {
        this.alertDanger('Error deleting object: ' + e.error.message);
      },
    });
    this.deleteScenarioModal.open();
  }

  setScenarioList(scenarios: Scenario[]) {
    this.filteredScenarios = scenarios;
    if (this.scenarioAdded) {
      this.scenarioAdded = false;
    }
  }

  refresh(): void {
    this.scenarioService.list(true).subscribe({
      next: (sList: Scenario[]) => (this.filteredScenarios = sList),
      error: (e: HttpErrorResponse) => {
        this.alertDanger('Error deleting object: ' + e.error.message);
      },
    });
  }

  deleteScenario(scenarioId: string) {
    this.scenarioService.delete(scenarioId).subscribe({
      next: (s: ServerResponse) => {
        this.alertSuccess('Scenario deleted');
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
        this.alertDanger('Error deleting object: ' + e.error.message);
      },
    });
  }

  doDeleteScenario() {
    this.deleteScenario(this.selectedscenario.id);
    this.deleteScenarioModal.close();
    this.selectedscenario =
      this.filteredScenarios[this.filteredScenarios.length - 1];
  }

  alertSuccess(msg: string) {
    this.alertType = 'success';
    this.scenarioSuccessAlert = msg;
    this.scenarioSuccessClosed = false;
    setTimeout(() => (this.scenarioSuccessClosed = true), 1000);
  }

  alertDanger(msg: string) {
    this.alertType = 'danger';
    this.scenarioDangerAlert = msg;
    this.scenarioDangerClosed = false;
    setTimeout(() => (this.scenarioDangerClosed = true), 1000);
  }

  readErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
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

    const authorizationRequests = Promise.all([
      this.rbacService.Grants('scenarios', 'get'),
      this.rbacService.Grants('scenarios', 'update'),
      this.rbacService.Grants('scenarios', 'delete'),
    ]);
    authorizationRequests.then((permissions: [boolean, boolean, boolean]) => {
      const allowGet: boolean = permissions[0];
      const allowUpdate: boolean = permissions[1];
      const allowDelete: boolean = permissions[2];
      this.showActionOverflow = allowDelete || (allowGet && allowUpdate);
    });
    this.refresh();
  }

  reloadScenario(wizardScenario: string) {
    this.scenarioFilter.reloadScenarios();
    this.refresh();
    if (wizardScenario === 'edit')
      this.alertSuccess('Scenarios successfully updated');
    if (wizardScenario === 'create') {
      if (this.errorMessage) this.alertDanger(this.errorMessage);
      setTimeout(() => {
        this.errorMessage = '';
        return;
      }, 3000);
    }
  }
}
