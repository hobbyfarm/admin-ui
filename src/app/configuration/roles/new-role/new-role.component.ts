import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrForm, ClrModal } from '@clr/angular';
import { Role, Rule } from 'src/app/data/role';
import { RoleService } from 'src/app/data/role.service';
import { RuleFormComponent } from '../rule-form/rule-form.component';

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

  public form = new FormGroup({
    name: new FormControl(this.role.name, [
      Validators.required
    ])
  })

  @Output()
  saved: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild("modal") modal: ClrModal;

  private _ruleFormValid: boolean;
  public ruleFormValid(value: boolean) {
    this._ruleFormValid = value;
  }

  public open(): void {
    this.rule = new Rule();
    this.form.reset();
    this.modal.open();
  }

  public save(): void {
    this.role.name = this.form.get('name').value;

    this.role.rules = [this.rule];

    this.roleService.create(this.role)
    .subscribe(
      (a: any) => {
        this.saved.next(true);
        this.modal.close();
      }
    )
  }

  public get formValid(): boolean {
    return !(this._ruleFormValid && this.form.valid);
  }

}
