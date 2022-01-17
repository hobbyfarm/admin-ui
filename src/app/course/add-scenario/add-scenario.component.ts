import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Scenario } from 'src/app/data/scenario';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'add-scenario',
  templateUrl: './add-scenario.component.html',
  styleUrls: ['./add-scenario.component.scss']
})
export class AddScenarioComponent implements OnInit {
  public addOpen: boolean = false;

  public selectedScenarios = [];

  @Input()
  public scenarios: Scenario[] = []; // TODO - convert this to ues shared service w/ client-side caching

  @Output()
  public selected: EventEmitter<Scenario[]> = new EventEmitter();

  @ViewChild("addModal") addModal: ClrModal;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  save(): void {
    this.selected.emit(this.selectedScenarios);
    this.addModal.close();
  }

  public open(): void {
    this.selectedScenarios = [];
    this.addModal.open();
  }

}
