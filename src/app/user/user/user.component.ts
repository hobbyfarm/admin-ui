import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/data/user.service';
import { User } from 'src/app/data/user';
import { ServerResponse } from 'src/app/data/serverresponse';
import { UserEmailFilter } from 'src/app/user-email-filter';
import { UserIdFilter } from 'src/app/user-id-filter';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { EditAccessCodesComponent } from '../edit-access-codes/edit-access-codes.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public users: User[] = [];

  public editingUser: User = new User();

  @ViewChild("editusermodal", { static: true }) editUserModal: EditUserComponent;
  @ViewChild("editaccesscodesmodal", {static: true}) accessCodeModal: EditAccessCodesComponent;

  public newAccessCode: boolean = false;
  
  public accessCodesOpen: boolean = false;

  public fetchingAccessCodes: boolean = false;

  public accesscodes: string[] = [];

  constructor(
    public userService: UserService
  ) { }

  public emailFilter: UserEmailFilter = new UserEmailFilter();
  public idFilter: UserIdFilter = new UserIdFilter();

  public editUser(u: User) {
    this.editingUser = u;
    this.editUserModal.open();
  }

  ngOnInit() {
    this.refresh();
  }

  public openAccessCodes(u: User) {
    this.editingUser = u;
    this.accessCodeModal.open();
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
