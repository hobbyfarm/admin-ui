import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/data/user.service';
import { User } from 'src/app/data/user';
import { ServerResponse } from 'src/app/data/serverresponse';
import { UserEmailFilter } from 'src/app/user-email-filter';
import { UserIdFilter } from 'src/app/user-id-filter';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { EditAccessCodesComponent } from '../edit-access-codes/edit-access-codes.component';
import { RbacService } from 'src/app/data/rbac.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  public users: User[] = [];

  public selectedUser: User = new User();

  public selectRbac: boolean = false;

  public accesscodes: string[] = [];

  constructor(
    public userService: UserService,
    public rbacService: RbacService
  ) { }

  public emailFilter: UserEmailFilter = new UserEmailFilter();

  ngOnInit() {
    ["update", "get"].forEach((verb: string) => {
      if (this.rbacService.Grants("users", verb)) {
        this.selectRbac = true
      }
    })
    this.refresh();
  }

  refresh() {
    this.userService.getUsers()
      .subscribe(
        (u: User[]) => {
          this.users = u;
        },
        (s: ServerResponse) => {
          // do something about failure
        }
      )
  }

}
