import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerResponse } from 'src/app/data/serverresponse';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';

@Component({
  selector: 'edit-access-codes',
  templateUrl: './edit-access-codes.component.html',
})
export class EditAccessCodesComponent implements OnChanges {
  @Input()
  public user: User = new User();

  public alertType: string = "success";
  public alertClosed: boolean = true;
  public alertText: string = "";

  public newAccessCode: boolean = false;


  constructor(
    public userService: UserService
  ) { }

  public newAccessCodeForm: FormGroup = new FormGroup({
    "access_code": new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ])
  })

  ngOnChanges(): void {
    this.reset();
  }
  
  public reset(): void {
    this.newAccessCodeForm.reset({
      "access_code": ""
    })
  }

  deleteAccessCode(a: string) {
    var acIndex = this.user.access_codes.findIndex((v: string) => {
      return v == a;
    });

    this.user.access_codes.splice(acIndex, 1);

    this.userService.saveUser(this.user.id, "", "", null, this.user.access_codes)
    .subscribe(
      (s: ServerResponse) => {
        this.alertText = "Access code deleted";
        this.alertType = "success";
        this.alertClosed = false;
        setTimeout(() => this.alertClosed = true, 2000);
      },
      (s: ServerResponse) => {
        this.alertText = "Failed to delete access code: " + s.message;
        this.alertType = "danger";
        this.alertClosed = false;
        setTimeout(() => this.alertClosed = true, 2000);
      }
    )
  }

  saveAccessCode() {
    this.user.access_codes.push(this.newAccessCodeForm.get("access_code").value);

    this.userService.saveUser(this.user.id, "", "", null, this.user.access_codes)
    .subscribe(
      (s: ServerResponse) => {
        this.alertText = "Access code saved";
        this.alertType = "success";
        this.alertClosed = false;
        setTimeout(() => this.alertClosed = true, 2000);
      },
      (s: ServerResponse) => {
        this.alertText = "Failed to save access code: " + s.message;
        this.alertType = "danger";
        this.alertClosed = false;
        setTimeout(() => this.alertClosed = true, 2000);
      }
    )
  }

}
