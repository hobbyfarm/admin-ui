import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/data/user.service';
import { User } from 'src/app/data/user';
import { ServerResponse } from 'src/app/data/serverresponse';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClrModal } from '@clr/angular';
import { UserEmailFilter } from 'src/app/user-email-filter';
import { UserIdFilter } from 'src/app/user-id-filter';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public users: User[] = [];

  public editingUser: User = new User();

  @ViewChild("editusermodal", { static: true }) editUserModal: ClrModal;
  @ViewChild("editaccesscodes", {static: true}) accessCodeModal: ClrModal;

  public editUserOpen: boolean = false;

  public editUserDangerClosed: boolean = true;
  public editUserSuccessClosed: boolean = true;
  public editUserSuccessAlert: string = "";
  public editUserDangerAlert: string = "";

  public accessCodeDangerClosed: boolean = true;
  public accessCodeSuccessClosed: boolean = true;
  public accessCodeDangerAlert: string = "";
  public accessCodeSuccessAlert: string = "";

  public newAccessCode: boolean = false;
  
  public accessCodesOpen: boolean = false;

  public fetchingAccessCodes: boolean = false;

  public accesscodes: string[] = [];

  constructor(
    public userService: UserService
  ) { }

  public emailFilter: UserEmailFilter = new UserEmailFilter();
  public idFilter: UserIdFilter = new UserIdFilter();

  public userDetailsForm: FormGroup = new FormGroup({
    'email': new FormControl(this.editingUser.email, [
      Validators.required,
      Validators.email
    ]),
    'password': new FormControl(""),
    'admin': new FormControl(true)
  });

  public newAccessCodeForm: FormGroup = new FormGroup({
    "access_code": new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ])
  })

  public editUser(u: User) {
    this.editingUser = u;
    this.userDetailsForm.reset({
      'email': u.email,
      'password': "",
      'admin': u.admin
    })
    this.editUserModal.open();
  }

  ngOnInit() {
    this.refresh();
  }

  public openAccessCodes(u: User) {
    this.editingUser = u;
    this.newAccessCodeForm.reset();
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

  deleteAccessCode(a: string) {
    var acIndex = this.editingUser.access_codes.findIndex((v: string) => {
      return v == a;
    });

    this.editingUser.access_codes.splice(acIndex, 1);

    this.userService.saveUser(this.editingUser.id, "", "", null, this.editingUser.access_codes)
    .subscribe(
      (s: ServerResponse) => {
        this.accessCodeSuccessAlert = "Access code deleted.";
        this.accessCodeSuccessClosed = false;
        setTimeout(() => this.accessCodeSuccessClosed = true, 2000);
      },
      (s: ServerResponse) => {
        this.accessCodeDangerAlert = "Failed to delete access code: " + s.message;
        this.accessCodeDangerClosed = false;
        setTimeout(() => this.accessCodeDangerClosed = true, 2000);
      }
    )
  }

  saveAccessCode() {
    this.editingUser.access_codes.push(this.newAccessCodeForm.get("access_code").value);

    this.userService.saveUser(this.editingUser.id, "", "", null, this.editingUser.access_codes)
    .subscribe(
      (s: ServerResponse) => {
        this.accessCodeSuccessAlert = "Access code saved.";
        this.accessCodeSuccessClosed = false;
        setTimeout(() => this.accessCodeSuccessClosed = true, 2000);
      },
      (s: ServerResponse) => {
        this.accessCodeDangerAlert = "Failed to save access code: " + s.message;
        this.accessCodeDangerClosed = false;
        setTimeout(() => this.accessCodeDangerClosed = true, 2000);
      }
    )
  }

  saveDetails() {
    var email = this.userDetailsForm.get("email").value;
    var password = this.userDetailsForm.get("password").value;
    var admin = this.userDetailsForm.get("admin").value;

    if (email == null) {
      email = "";
    }

    if (password == null) {
      password = "";
    }

    this.userService.saveUser(this.editingUser.id, email, password, admin)
      .subscribe(
        (s: ServerResponse) => {
          this.editUserSuccessAlert = "User updated.";
          this.editUserSuccessClosed = false;
          this.refresh();
          setTimeout(() => {
            this.editUserSuccessClosed = true;
            this.editUserOpen = false;
          }, 2000);
        },
        (s: ServerResponse) => {
          this.editUserDangerAlert = "Update failed: " + s.message;
          this.editUserDangerClosed = false;
          setTimeout(() => {
            this.editUserDangerClosed = true;
          }, 2000);
        }
      )
  }

}
