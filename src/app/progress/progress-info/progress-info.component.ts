import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ClrModal } from '@clr/angular';
import { ProgressStep } from 'src/app/data/progress';

@Component({
  selector: 'progress-info',
  templateUrl: './progress-info.component.html',
  styleUrls: ['./progress-info.component.scss']
})
export class ProgressInfoComponent implements OnInit {
  public infoOpen: boolean = false;

  public selectedScenarios = [];

  @Input()
  public steps: ProgressStep[] = [];

  @ViewChild("infoModal") infoModal: ClrModal;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  open(){
    this.infoModal.open();
  }


}
