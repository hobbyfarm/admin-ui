import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrCombobox } from '@clr/angular';
import { FormControlStatus } from 'src/app/data/formstatus';
import { hobbyfarmApiGroup, rbacApiGroup, resources, verbs } from 'src/app/data/rbac';
import { Rule } from 'src/app/data/role';

@Component({
  selector: 'rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss']
})
export class RuleFormComponent implements OnInit {
  private _rule: Rule;

  @Input() set rule(value: Rule) {
    this.apiGroupControl.reset(value.apiGroups);
    this.resourceControl.reset(value.resources);
    this.verbControl.reset(value.verbs);

    this._rule = value;
  }
  get rule() {
    return this._rule;
  }

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  private apiGroupControl: FormControl = new FormControl([], [
    Validators.minLength(1),
    Validators.required,
  ]);
  private resourceControl: FormControl = new FormControl([], [
    Validators.minLength(1),
    Validators.required,
  ]);
  private verbControl: FormControl = new FormControl([], [
    Validators.minLength(1),
    Validators.required,
  ]);

  public form = new FormGroup({
    apiGroups: this.apiGroupControl,
    resources: this.resourceControl,
    verbs: this.verbControl
  })

  public verbs: string[] = verbs;
  public resources: string[] = resources;
  public apiGroups: string[] = [
    hobbyfarmApiGroup,
    rbacApiGroup
  ]

  constructor() { }

  ngOnInit(): void {
    this.resourceControl.valueChanges.subscribe(
      (resources: string[]) => {
        this.resourceSelected(resources)
      }
    )

    this.form.valueChanges.subscribe(
      () => {
        this._rule.apiGroups = this.apiGroupControl.value;
        this._rule.resources = this.resourceControl.value;
        this._rule.verbs = this.verbControl.value;
      }
    )

    this.form.statusChanges.subscribe(
      (s: FormControlStatus) => {
        s == FormControlStatus.Valid ? this.valid.emit(true) : this.valid.emit(false)
      }
    )
  }

  @ViewChild("apiGroupsCombobox") apiGroupsComobox: ClrCombobox<string>;

  public resourceSelected(resources: string[]) {
    if (resources == null || this.apiGroupControl.value == null) {
      return
    }

    resources.forEach((r: string) => {
      if (r == "roles" || r == "rolebindings") {
        if ((this.apiGroupControl.value as Array<string>).find((ag: string) => ag == rbacApiGroup) == undefined) {
          let groups = (this.apiGroupControl.value as Array<string>)
          groups.push(rbacApiGroup)
          this.apiGroupControl.setValue(groups, {
            emitEvent: false
          })
        }
      } else {
        if ((this.apiGroupControl.value as Array<string>).find((ag: string) => ag == hobbyfarmApiGroup) == undefined) {
          let groups = (this.apiGroupControl.value as Array<string>)
          groups.push(hobbyfarmApiGroup)
          this.apiGroupControl.setValue(groups, {
            emitEvent: false
          })
        }
      }
    })
  }

  public clearField(field: string): void {
    switch (field) {
      case 'api':
        this.form.get('apiGroups').markAllAsTouched();
        this.apiGroupControl.setValue(null);
        break;
      case 'resources':
        this.resourceControl.markAsTouched();
        this.resourceControl.setValue(null);
        break;
      case 'verbs':
        this.verbControl.markAsTouched();
        this.verbControl.setValue(null)
        break;
    }
  }

  public addAll(field: string): void {
    switch (field) {
      case 'api':
        this.apiGroupControl.setValue(this.apiGroups)
        break;
      case 'resources':
        this.resourceControl.setValue(["*"])
        break;
      case 'verbs':
        this.verbControl.setValue(["*"])
        break;
    }
  }

}
