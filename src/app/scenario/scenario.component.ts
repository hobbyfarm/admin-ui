import { Component, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ClrDatagridSortOrder, ClrModal } from '@clr/angular';
import { FilterScenariosComponent } from '../filter-scenarios/filter-scenarios.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ScenarioWizardComponent } from './scenario-wizard/scenario-wizard.component';
import { RbacService } from '../data/rbac.service';
import {
  AlertDetails,
  DEFAULT_ALERT_ERROR_DURATION,
  DEFAULT_ALERT_SUCCESS_DURATION,
} from '../alert/alert';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
})
export class ScenarioComponent implements OnInit {
  public filteredScenarios: Scenario[] = [];
  public selectedscenario: Scenario;

  public deleteScenarioSetOpen: boolean = false;
  public showActionOverflow: boolean = false;

  public selectRbac: boolean = false;

  public ascSort = ClrDatagridSortOrder.ASC;

  constructor(
    public scenarioService: ScenarioService,
    public rbacService: RbacService,
  ) {}

  @ViewChild('deletescenariomodal', { static: true })
  deleteScenarioModal: ClrModal;

  @ViewChild('scenarioFilter', { static: true })
  scenarioFilter: FilterScenariosComponent;
  @ViewChild('scenariowizard', { static: true })
  scenarioWizard: ScenarioWizardComponent;
  @ViewChild('alert') alert: AlertComponent;

  editScenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id).subscribe({
        next: (s: Scenario) => {
          this.selectedscenario = s;
        },
        error: (e: HttpErrorResponse) => {
          const alertMsg = 'Error retrieving object: ' + e.message;
          this.alert.danger(alertMsg, true, DEFAULT_ALERT_ERROR_DURATION);
        },
      });
    }
  }

  openScenarioWizard(wizardMode: 'create' | 'edit', scenario?: Scenario) {
    this.scenarioWizard.open(wizardMode, scenario);
  }

  openDeleteScenario(scenario: Scenario) {
    this.scenarioService.get(scenario.id).subscribe({
      next: (scenario) => (this.selectedscenario = scenario),
      error: (e: HttpErrorResponse) => {
        const alertMsg = 'Error deleting object: ' + e.message;
        this.alert.danger(alertMsg, true, DEFAULT_ALERT_ERROR_DURATION);
      },
    });
    this.deleteScenarioModal.open();
  }

  setScenarioList(scenarios: Scenario[]) {
    this.filteredScenarios = scenarios;
  }

  refresh(): void {
    this.scenarioService.list(true).subscribe({
      next: (sList: Scenario[]) => (this.filteredScenarios = sList),
      error: (e: HttpErrorResponse) => {
        const alertMsg = 'Error listing objects: ' + e.message;
        this.alert.danger(alertMsg, true, DEFAULT_ALERT_ERROR_DURATION);
      },
    });
  }

  cloneScenario(scenarioId: string) {
    this.scenarioService.clone(scenarioId).subscribe({
      next: () => {
        const alertMsg = 'Scenario cloned';
        this.alert.success(alertMsg, true, DEFAULT_ALERT_SUCCESS_DURATION);
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
        const alertMsg = 'Error cloning scenario: ' + e.message;
        this.alert.danger(alertMsg, true, DEFAULT_ALERT_ERROR_DURATION);
      },
    });
  }

  deleteScenario(scenarioId: string) {
    this.scenarioService.delete(scenarioId).subscribe({
      next: () => {
        const alertMsg = 'Scenario deleted';
        this.alert.success(alertMsg, true, DEFAULT_ALERT_SUCCESS_DURATION);
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
        const alertMsg = 'Error deleting object: ' + e.message;
        this.alert.danger(alertMsg, true, DEFAULT_ALERT_ERROR_DURATION);
      },
    });
  }

  doDeleteScenario() {
    this.deleteScenario(this.selectedscenario.id);
    this.deleteScenarioModal.close();
    this.selectedscenario =
      this.filteredScenarios[this.filteredScenarios.length - 1];
  }

  refreshAndDisplayAlert(alertDetails: AlertDetails) {
    this._reloadScenario();
    this.alert.doAlert(
      alertDetails.message,
      alertDetails.type,
      alertDetails.closable,
      alertDetails.duration,
    );
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

  private _reloadScenario() {
    this.scenarioFilter.reloadScenarios();
    this.refresh();
  }
}
