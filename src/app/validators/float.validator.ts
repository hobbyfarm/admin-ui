import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";

export function FloatValidator(minInc: number, maxInc: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value;

    // allow empty values since the field is optional
    if (!value) {
      return null;
    }

    // Attempt to coerce to a number if the value is a string
    if (typeof value === 'string') {
      value = parseFloat(value);
    }

    const isValid =
      typeof value === 'number' &&
      !isNaN(value) &&
      value >= minInc &&
      value <= maxInc;

    return isValid ? null : { invalidFloat: true };
  };
}
