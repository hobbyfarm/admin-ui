import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/data/user.service';
import { User } from 'src/app/data/user';
import { ServerResponse } from 'src/app/data/serverresponse';
import { UserEmailFilter } from 'src/app/user-email-filter';
import { UserAccesscodeFilter } from 'src/app/user-accescode-filter'
import { DeleteProcessModalComponent } from './delete-process-modal/delete-process-modal.component';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';
import { RbacService } from 'src/app/data/rbac.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public users: User[] = [];

  public selectedUser: User;
  public selectedUsers: User[] = [];  

  public selectRbac: boolean = false;

  public accesscodes: string[] = [];

  @ViewChild('deleteconfirm') deleteConfirmModal: DeleteConfirmationComponent;
  @ViewChild('deleteprocess') deleteProcessModal: DeleteProcessModalComponent;

  constructor(
    public userService: UserService,
    public rbacService: RbacService
  ) { }

  public emailFilter: UserEmailFilter = new UserEmailFilter();
  public accescodeFilter: UserAccesscodeFilter = new UserAccesscodeFilter();

  ngOnInit() {
    // Enable permission to list users if either "get" or "update" on users is granted
    this.rbacService.Grants("users", "get").then(async (allowedGet: boolean) => {
      const allowedUpdate: boolean = await this.rbacService.Grants("users", "update");
      this.selectRbac = allowedGet || allowedUpdate;
      // only load users if access is granted
      if(this.selectRbac) {
        this.refresh();
      }
    });
  }

  refresh(force?: boolean) {
    this.userService.getUsers(force)
      .subscribe(
        (u: User[]) => {
          this.users = u;
        },
        (s: ServerResponse) => {
          // do something about failure
        }
      )
  }

  setSelectedUser(u: User) {
    this.selectedUser = u
  }

  deleteMultiple() {
    this.deleteConfirmModal.open();
  }

  doDeleteMultiple() {
    this.deleteProcessModal.open()
  }

  doOnDeleteCompletion() {    
      this.selectedUsers = []
      this.refresh(true)
  }

}
