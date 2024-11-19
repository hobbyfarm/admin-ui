import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DEFAULT_ALERT_ERROR_DURATION,
  DEFAULT_ALERT_SUCCESS_DURATION,
} from 'src/app/alert/alert';
import { AlertComponent } from 'src/app/alert/alert.component';
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

  @ViewChild('alert') alert: AlertComponent;

  public newAccessCode: boolean = false;

  constructor(public userService: UserService) {}

  public newAccessCodeForm: FormGroup<{
    access_code: FormControl<string>;
  }> = new FormGroup({
    access_code: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(4)],
      nonNullable: true,
    }),
  });

  ngOnChanges(): void {
    this.reset();
  }

  public reset(): void {
    this.newAccessCodeForm.reset();
  }

  deleteAccessCode(a: string) {
    var acIndex = this.user.access_codes.findIndex((v: string) => {
      return v == a;
    });

    this.user.access_codes.splice(acIndex, 1);

    this.userService
      .saveUser(this.user.id, '', '', this.user.access_codes)
      .subscribe({
        next: (_s: ServerResponse) => {
          const alertText = 'Access code deleted';
          this.alert.success(alertText, false, DEFAULT_ALERT_SUCCESS_DURATION);
        },
        error: (s: ServerResponse) => {
          const alertText = 'Failed to delete access code: ' + s.message;
          this.alert.danger(alertText, false, DEFAULT_ALERT_ERROR_DURATION);
        },
      });
  }

  saveAccessCode() {
    this.user.access_codes.push(
      this.newAccessCodeForm.controls.access_code.value,
    );

    this.userService
      .saveUser(this.user.id, '', '', this.user.access_codes)
      .subscribe({
        next: (_s: ServerResponse) => {
          const alertText = 'Access code saved';
          this.alert.success(alertText, false, DEFAULT_ALERT_SUCCESS_DURATION);
        },
        error: (s: ServerResponse) => {
          const alertText = 'Failed to save access code: ' + s.message;
          this.alert.danger(alertText, false, DEFAULT_ALERT_ERROR_DURATION);
        },
      });
  }
}
