import { Component, OnInit, ViewChild } from '@angular/core';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ClrDatagridSortOrder, ClrModal } from '@clr/angular';
import { ServerResponse } from '../data/serverresponse';
import { FilterScenariosComponent } from '../filter-scenarios/filter-scenarios.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ScenarioWizardComponent } from './scenario-wizard/scenario-wizard.component';
import { RbacService } from '../data/rbac.service';
import { AlertDetails } from '../alert/alert';
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

  public wizardMode: 'create' | 'edit' = 'create';

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
  @ViewChild('alert') alert: AlertComponent;

  editScenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id).subscribe({
        next: (s: Scenario) => {
          this.selectedscenario = s;
        },
        error: (e: HttpErrorResponse) => {
          this.alert.danger('Error retrieving object: ' + e.error.message, true, 3000);
        },
      });
    }
  }

  openScenario() {
    this.wizardMode = 'create';
    this.scenarioWizard.open();
  }

  editSelectedScenario(scenario: Scenario) {
    this.wizardMode = 'edit';
    this.editSelectedScenarioWizard.editScenarioWizardfunction(scenario);
    this.editSelectedScenarioWizard.open();
  }

  openDeleteScenario(scenario: Scenario) {
    this.scenarioService.get(scenario.id).subscribe({
      next: (scenario) => (this.selectedscenario = scenario),
      error: (e: HttpErrorResponse) => {
        this.alert.danger('Error deleting object: ' + e.error.message, true, 3000);
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
        this.alert.danger('Error listing objects: ' + e.error.message, true, 3000);
      },
    });
  }

  deleteScenario(scenarioId: string) {
    this.scenarioService.delete(scenarioId).subscribe({
      next: (_s: ServerResponse) => {
        this.alert.success('Scenario deleted', true, 3000);
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
        this.alert.danger('Error deleting object: ' + e.error.message, true, 3000);
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
    this.alert.doAlert(alertDetails.message, alertDetails.type, alertDetails.closable, alertDetails.duration);
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
