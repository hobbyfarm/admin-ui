import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrDatagridSortOrder } from '@clr/angular';
import { RbacService } from '../data/rbac.service';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { ScheduledEvent } from '../data/scheduledevent';
import { VMTemplate } from '../data/vmtemplate';
import { VmtemplateService } from '../data/vmtemplate.service';

@Component({
  selector: 'filter-scenarios',
  templateUrl: './filter-scenarios.component.html',
  styleUrls: ['./filter-scenarios.component.scss']
})
export class FilterScenariosComponent implements OnInit {

  public categories: string[] = [];
  public selectedCategories: string[] = [];
  public se: ScheduledEvent = new ScheduledEvent();
  public ascSort = ClrDatagridSortOrder.ASC;
  public scenarios: Scenario[] = [];
  public filteredScenarios: Scenario[] = [];
  @Output() public filterScenarioEventEmitter = new EventEmitter<Scenario[]>()
  public selectRbac: boolean = false;
  public vmtemplates: VMTemplate[] = [];

  public categoryFilterForm = new FormGroup({
    categoryControl: new FormControl([], []),
  });
  event: any;

  constructor(public scenarioService: ScenarioService,     public rbacService: RbacService,     public vmTemplateService: VmtemplateService
  ) { }


  emitScenarios(values: Scenario[]){
    this.filterScenarioEventEmitter.emit(values);
    console.log(values)
  }
  clearCategoryFilter() {
    this.selectedCategories = [];
    this.categoryFilterForm.get('categoryControl').setValue([]);
  }


  filterScenarioList() {
    if (this.selectedCategories.length === 0) {
      this.filteredScenarios = this.scenarios;
      return;
    }

    let sc = [];

    if (this.selectedCategories.includes('__none__')) {
      this.scenarios.forEach((s) => {
        if (s.categories.length === 0) {
          sc.push(s);
          return;
        }
      });
    }

    

    this.scenarios.forEach((s) => {
      let matches = s.categories.filter((element) =>
        this.selectedCategories.includes(element)
      );
      if (matches.length > 0) {
        sc.push(s);
        return;
      }
    });
    this.filteredScenarios = sc;
  }
  calculateCategories() {
    let c = new Set<string>();
    this.scenarios.forEach((s) => {
      s.categories.forEach((category) => c.add(category));
    });

    this.categories = Array.from(c).sort();
  }
  

  ngOnInit() {
    // "Get" Permission on scenarios is required to load step content
    this.rbacService.Grants('scenarios', 'get').then((allowed: boolean) => {
      this.selectRbac = allowed;
    });

    this.scenarioService.list().subscribe((s: Scenario[]) => {
      this.scenarios = s;
      this.calculateCategories();
      this.filterScenarioList();
      this.emitScenarios(this.scenarios);
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

    this.categoryFilterForm.valueChanges.subscribe(() => {
      this.selectedCategories =
        this.categoryFilterForm.get('categoryControl').value ?? [];
      this.filterScenarioList();
      // TODO: Refactor
      this.emitScenarios(this.filteredScenarios)
    });
  }
}
