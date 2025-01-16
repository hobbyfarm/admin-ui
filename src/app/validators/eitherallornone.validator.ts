import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";

export function EitherAllOrNoneValidator(fieldNames: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const values = fieldNames.map((name) => group.get(name)?.value);

    const allSet = values.every((value) => !!value);
    const allEmpty = values.every((value) => !value);

    if (allSet || allEmpty) {
      return null; // Valid: either all fields are set or none are set
    }

    return { invalidAllOrNone: true };
  };
}
