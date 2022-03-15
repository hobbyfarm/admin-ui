import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
import { ClrForm, ClrModal } from '@clr/angular';
import { Role, Rule } from 'src/app/data/role';

@Component({
  selector: 'new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {

  public modalOpen: boolean = false;

  @Input()
  public role: Role = new Role();

  public rule: Rule = new Rule();

  @Output()
  saved: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild("modal") modal: ClrModal;
  @ViewChild("nameForm") nameForm: Form;

  public open(): void {
    this.rule = new Rule();
    this.modal.open();
  }

  public save(): void {
    this.role.rules = [
      this.rule
    ]
    this.saved.next(true);
    this.modal.close();
  }

}
