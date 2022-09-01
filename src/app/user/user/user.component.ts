import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/data/user.service';
import { User } from 'src/app/data/user';
import { ServerResponse } from 'src/app/data/serverresponse';
import { UserEmailFilter } from 'src/app/user-email-filter';
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
    // isn't it sufficient to check for "get"???...
    // because our rbac directive is handling if the user can update user properties???
    this.rbacService.Grants("users", "get").then((allowed: boolean) => {
      this.selectRbac = allowed;
      // only load users if access is granted
      if(this.selectRbac) {
        this.refresh();
      }
    });
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
