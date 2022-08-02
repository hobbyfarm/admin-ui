import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/data/user.service';
import { User } from 'src/app/data/user';
import { ServerResponse } from 'src/app/data/serverresponse';
import { UserEmailFilter } from 'src/app/user-email-filter';
import { UserIdFilter } from 'src/app/user-id-filter';
import { UserAccesscodeFilter } from 'src/app/user-accescode-filter'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public users: User[] = [];

  public selectedUser: User = new User();

  public accesscodes: string[] = [];

  constructor(
    public userService: UserService
  ) { }

  public emailFilter: UserEmailFilter = new UserEmailFilter();
  public idFilter: UserIdFilter = new UserIdFilter();
  public accescodeFilter: UserAccesscodeFilter = new UserAccesscodeFilter();

  ngOnInit() {
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
