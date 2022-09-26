import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RoleBinding } from 'src/app/data/rolebinding';
import { RolebindingService } from 'src/app/data/rolebinding.service';
import { User } from 'src/app/data/user';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';
import { NewRoleBindingComponent } from '../new-role-binding/new-role-binding.component';

@Component({
  selector: 'rolebindings',
  templateUrl: './rolebindings.component.html',
  styleUrls: ['./rolebindings.component.scss']
})
export class RolebindingsComponent implements OnInit {
  private _user: User;
  public rolebindings: RoleBinding[];

  public deletingIndex: number;

  @Input()
  set user(value: User) {
    this._user = value;
    this.roleBindingService.listForUser(value.id)
    .subscribe(
      (rb: RoleBinding[]) => this.rolebindings = rb
    )
  }
  get user() {
    return this._user;
  }

  constructor(
    private roleBindingService: RolebindingService
  ) { }

  @ViewChild("deleteconfirmation") deleteConfirmation: DeleteConfirmationComponent;
  @ViewChild("newrolebinding") newModal: NewRoleBindingComponent;

  ngOnInit(): void {
  }

  delete(index: number): void {
    this.deletingIndex = index;
    this.deleteConfirmation.open();
  }

  doDelete(): void {
    this.roleBindingService.delete(this.rolebindings[this.deletingIndex].name)
    .subscribe(
      () => {
        this.rolebindings.splice(this.deletingIndex, 1);
      }
    )
  }

  openNew(): void {
    this.newModal.open();
  }

  refresh(): void {
    this.roleBindingService.listForUser(this.user.id)
    .subscribe(
      (rb: RoleBinding[]) => this.rolebindings = rb
    )
  }
}
