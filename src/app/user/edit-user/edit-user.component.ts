import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrModal } from '@clr/angular';
import { ServerResponse } from 'src/app/data/serverresponse';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit, OnChanges {
  @Input()
  public user: User = new User();

  public alertClosed: boolean = true;
  public alertType: string = "danger";
  public alertText: string = "";

  @Output()
  public deleted: EventEmitter<boolean> = new EventEmitter(false);

  public saving: boolean = false;

  @ViewChild('deleteconfirm') deleteConfirmModal: DeleteConfirmationComponent;

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.reset();
  }

  public userDetailsForm: FormGroup = new FormGroup({
    'email': new FormControl(this.user.email, [
      Validators.required,
      Validators.email
    ]),
    'password': new FormControl(""),
    'admin': new FormControl(true)
  });

  public reset(): void {
    this.userDetailsForm.reset({
      'email': this.user.email,
      'password': "",
      'admin': this.user.admin
    });
    this.alertText = "";
    this.alertClosed = true;
  }

  saveDetails() {
    this.saving = true;
    var email = this.userDetailsForm.get("email").value;
    var password = this.userDetailsForm.get("password").value;
    var admin = this.userDetailsForm.get("admin").value;

    if (email == null) {
      email = "";
    }

    if (password == null) {
      password = "";
    }

    this.userService.saveUser(this.user.id, email, password, admin)
      .subscribe(
        (s: ServerResponse) => {
          this.alertText = "User updated";
          this.alertType = "success";
          this.alertClosed = false;
          this.saving = false;
          setTimeout(() => {
            this.alertClosed = true;
          }, 2000);
        },
        (s: ServerResponse) => {
          this.alertText = "Error updating user: " + s.message;
          this.alertType = "danger";
          this.alertClosed = false;
          this.saving = false;
          setTimeout(() => {
            this.alertClosed = true;
          }, 2000);
        }
      )
  }

  delete() {
    this.deleteConfirmModal.open();
  }

  doDelete() {
    this.userService.deleteUser(this.user.id)
      .subscribe(
        (s: ServerResponse) => {
          this.deleted.next(true);
        },
        (s: ServerResponse) => {
          this.alertText = s.message;
          this.alertType = "danger";
          this.alertClosed = false;
          setTimeout(() => {
            this.alertClosed = true;
          }, 2000);
        }
      )
    }
}
