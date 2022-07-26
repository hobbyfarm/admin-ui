import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrModal } from '@clr/angular';
import { Role } from 'src/app/data/role';
import { RoleService } from 'src/app/data/role.service';
import { RoleBinding } from 'src/app/data/rolebinding';
import { RolebindingService } from 'src/app/data/rolebinding.service';
import { User } from 'src/app/data/user';

@Component({
  selector: 'new-role-binding',
  templateUrl: './new-role-binding.component.html',
  styleUrls: ['./new-role-binding.component.scss']
})
export class NewRoleBindingComponent implements OnInit {
  public roles: Role[];
  public modalOpen: boolean = false;
  public rolebinding: RoleBinding;
  public selectedRole: Role;

  @Input()
  public user: User;

  @Output()
  public saved: EventEmitter<boolean> = new EventEmitter(false);

  public roleControl = new FormControl( '', [Validators.required])
  public form: FormGroup = new FormGroup({
    "role": this.roleControl
  })

  constructor(
    private roleService: RoleService,
    private roleBindingService: RolebindingService
  ) { }

  @ViewChild("modal") modal: ClrModal;

  ngOnInit(): void {
    this.rolebinding = new RoleBinding();
    this.roleControl.valueChanges.subscribe(
      (rn: string) => {
        this.selectedRole = this.roles?.find((r: Role) => r.name == rn)
      }
    )
  }

  public open(): void {
    this.form.reset();
    this.rolebinding = new RoleBinding();
    this.roleService.list()
    .subscribe(
      (r: Role[]) => this.roles = r
    )
    this.modal.open();
  }

  public save(): void {
    this.rolebinding.role = this.roleControl.value;
    this.rolebinding.name = this.user.id + "-" + this.rolebinding.role;
    this.rolebinding.subjects = [{
      kind: "User",
      name: this.user.email
    }]

    this.roleBindingService.create(this.rolebinding)
    .subscribe(
      () => {
        // successful
        this.saved.emit(true);
        this.modal.close();
      }
    )
  }

}
