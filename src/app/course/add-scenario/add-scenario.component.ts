import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Scenario } from 'src/app/data/scenario';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'add-scenario',
  templateUrl: './add-scenario.component.html',
})
export class AddScenarioComponent {
  public addOpen: boolean = false;

  public selectedScenarios = [];
  public filteredScenarios: Scenario[] = [];

  @Input()
  public scenarios: Scenario[] = []; // TODO - convert this to ues shared service w/ client-side caching

  @Output()
  public selected: EventEmitter<Scenario[]> = new EventEmitter();

  @ViewChild('addModal') addModal: ClrModal;

  save(): void {
    this.selected.emit(this.selectedScenarios);
    this.addModal.close();
  }

  public open(): void {
    this.selectedScenarios = [];
    this.addModal.open();
  }
  setScenarioList(scenarios: Scenario[]) {
    this.filteredScenarios = scenarios;
  }
}
