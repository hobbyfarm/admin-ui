import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormControlStatus,
} from '@angular/forms';
import { ClrCombobox } from '@clr/angular';
import { FormControlStatus as FormControlStatusEnum } from 'src/app/data/formstatus';
import {
  ApiGroup,
  hobbyfarmApiGroup,
  rbacApiGroup,
  Resource,
  resources,
  Verb,
  verbs,
} from 'src/app/data/rbac';
import { Rule } from 'src/app/data/role';

@Component({
  selector: 'rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss'],
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

  private apiGroupControl: FormControl<ApiGroup[]> = new FormControl<
    ApiGroup[]
  >([], {
    validators: [Validators.minLength(1), Validators.required],
    nonNullable: true,
  });
  private resourceControl: FormControl<Resource[]> = new FormControl<
    Resource[]
  >([], {
    validators: [Validators.minLength(1), Validators.required],
    nonNullable: true,
  });
  private verbControl: FormControl<Verb[]> = new FormControl<Verb[]>([], {
    validators: [Validators.minLength(1), Validators.required],
    nonNullable: true,
  });

  public form: FormGroup<{
    apiGroups: FormControl<ApiGroup[]>;
    resources: FormControl<Resource[]>;
    verbs: FormControl<Verb[]>;
  }>;

  public verbs: Verb[] = verbs;
  public resources: Resource[] = resources;
  public apiGroups: ApiGroup[] = [hobbyfarmApiGroup, rbacApiGroup];

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      apiGroups: this.apiGroupControl,
      resources: this.resourceControl,
      verbs: this.verbControl,
    });

    this.resourceControl.valueChanges.subscribe((resources: Resource[]) => {
      this.resourceSelected(resources);
    });

    this.form.valueChanges.subscribe(() => {
      this._rule.apiGroups = this.apiGroupControl.value;
      this._rule.resources = this.resourceControl.value;
      this._rule.verbs = this.verbControl.value;
    });

    this.form.statusChanges.subscribe((s: FormControlStatus) => {
      s == FormControlStatusEnum.Valid
        ? this.valid.emit(true)
        : this.valid.emit(false);
    });
  }

  @ViewChild('apiGroupsCombobox') apiGroupsComobox: ClrCombobox<string>;

  public resourceSelected(resources: Resource[]) {
    if (resources.length === 0 || this.apiGroupControl.value.length === 0) {
      return;
    }

    resources.forEach((r: Resource) => {
      if (r == 'roles' || r == 'rolebindings') {
        if (
          this.apiGroupControl.value.find(
            (ag: ApiGroup) => ag == rbacApiGroup,
          ) == undefined
        ) {
          let groups = this.apiGroupControl.value;
          groups.push(rbacApiGroup);
          this.apiGroupControl.setValue(groups, {
            emitEvent: false,
          });
        }
      } else {
        if (
          this.apiGroupControl.value.find(
            (ag: ApiGroup) => ag == hobbyfarmApiGroup,
          ) == undefined
        ) {
          let groups = this.apiGroupControl.value;
          groups.push(hobbyfarmApiGroup);
          this.apiGroupControl.setValue(groups, {
            emitEvent: false,
          });
        }
      }
    });
  }

  public clearField(field: string): void {
    switch (field) {
      case 'api':
        this.apiGroupControl.markAllAsTouched();
        this.apiGroupControl.setValue([]);
        break;
      case 'resources':
        this.resourceControl.markAsTouched();
        this.resourceControl.setValue([]);
        break;
      case 'verbs':
        this.verbControl.markAsTouched();
        this.verbControl.setValue([]);
        break;
    }
  }

  public addAll(field: string): void {
    switch (field) {
      case 'api':
        this.apiGroupControl.setValue(this.apiGroups);
        break;
      case 'resources':
        this.resourceControl.setValue(['*']);
        break;
      case 'verbs':
        this.verbControl.setValue(['*']);
        break;
    }
  }
}
