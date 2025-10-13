import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrModal } from '@clr/angular';
import { Role, Rule } from 'src/app/data/role';
import { RoleService } from 'src/app/data/role.service';

@Component({
  selector: 'new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss'],
})
export class NewRoleComponent implements OnInit {
  public modalOpen: boolean = false;

  @Input()
  public role: Role = new Role();

  public rule: Rule = new Rule();

  public form: FormGroup<{
    name: FormControl<string>;
  }>;

  @Output()
  saved: EventEmitter<boolean> = new EventEmitter();

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl<string>(this.role.name, {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  @ViewChild('modal') modal: ClrModal;

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
    this.role.name = this.form.controls.name.value;

    this.role.rules = [this.rule];

    this.roleService.create(this.role).subscribe(() => {
      this.saved.next(true);
      this.modal.close();
    });
  }

  public get formValid(): boolean {
    return !(this._ruleFormValid && this.form.valid);
  }
}
