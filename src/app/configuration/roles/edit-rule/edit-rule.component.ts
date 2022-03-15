import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClrModal } from '@clr/angular';
import { Rule } from 'src/app/data/role';
import { RoleService } from 'src/app/data/role.service';

@Component({
  selector: 'edit-rule',
  templateUrl: './edit-rule.component.html',
  styleUrls: ['./edit-rule.component.scss']
})
export class EditRuleComponent implements OnInit {
  public edit: boolean = false;
  public modalOpen: boolean = false;

  @Input()
  public rule: Rule = new Rule();

  @Output()
  public saved: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @ViewChild("modal") modal: ClrModal

  ngOnInit(): void {
  }

  public open(edit: boolean = false): void {
    this.edit = edit;
    if (!this.edit) {
      this.rule = new Rule();
    }
    this.modal.open();
  }

  public save(): void {
    this.saved.next(true);
    this.modal.close();
  }

}
