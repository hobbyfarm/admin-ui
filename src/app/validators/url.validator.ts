import { AbstractControl } from '@angular/forms';

export function UrlValidator(control: AbstractControl) {
  let validUrl = true;

  if (control.value.length > 0) {
    //Allow empty input, since this might not be a required Field
    try {
      new URL(control.value);
    } catch {
      validUrl = false;
    }
  }

  return validUrl ? null : { invalidUrl: true };
}
