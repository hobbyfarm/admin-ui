import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypedInput, TypedInputType } from './TypedInput';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  GenericFormArray,
  GenericFormControl,
  GenericKeyValueGroup,
  GenericKeyValueMapArray,
} from '../data/forms';
import { UniqueKeyValidator } from '../validators/uniquekey.validator';

@Component({
  selector: 'app-typed-input',
  templateUrl: './typed-input.component.html',
})
export class TypedInputComponent {
  @Input() input: TypedInput;
  @Input() formGroup: FormGroup<{
    [key: string]:
      | GenericFormControl
      | GenericFormArray
      | GenericKeyValueMapArray;
  }>;
  @Output() change: EventEmitter<boolean> = new EventEmitter(null);
  readonly TypedInputType = TypedInputType; // Reference to TypedInputTypes enum for template use
  constructor() {}

  inputChanged() {
    this.change.emit(true);
  }

  getMapControlsString(inputId: string) {
    return this.formGroup.controls[inputId] as FormArray<
      GenericKeyValueGroup<string>
    >;
  }

  getMapControlsNumber(inputId: string) {
    return this.formGroup.controls[inputId] as FormArray<
      GenericKeyValueGroup<number>
    >;
  }

  getMapControlsBoolean(inputId: string) {
    return this.formGroup.controls[inputId] as FormArray<
      GenericKeyValueGroup<boolean>
    >;
  }

  getArrayControlsString(inputId: string) {
    return this.formGroup.controls[inputId] as FormArray<FormControl<string>>;
  }

  getArrayControlsNumber(inputId: string) {
    return this.formGroup.controls[inputId] as FormArray<FormControl<number>>;
  }

  getArrayControlsBoolean(inputId: string) {
    return this.formGroup.controls[inputId] as FormArray<FormControl<boolean>>;
  }

  getFormControl(controlName: string) {
    return this.formGroup.controls[controlName] as GenericFormControl;
  }

  getArrayLength(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as GenericFormArray;
    return control.length;
  }

  getMapSize(typedInput: TypedInput) {
    const control = this.formGroup.get(
      typedInput.id
    ) as GenericKeyValueMapArray;
    return control.length;
  }

  addArrayElement(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as GenericFormArray;

    let parsedVal: string | number | boolean | undefined;
    if (typedInput.validation.default) {
      parsedVal = typedInput.parseScalarValue(typedInput.validation.default);
    }
    if (typedInput.isFormArrayString(control)) {
      const defaultVal = typeof parsedVal == 'string' ? parsedVal : '';
      let c: FormControl<string> =
        typedInput.getTypedInputFormControl(defaultVal);
      this.addControlToArray(control, c);
    } else if (typedInput.isFormArrayNumber(control)) {
      const defaultVal = typeof parsedVal == 'number' ? parsedVal : 0;
      let c: FormControl<number> =
        typedInput.getTypedInputFormControl(defaultVal);
      this.addControlToArray(control, c);
    } else {
      // if (typedInput.isFormArrayBoolean(control))
      const defaultVal = typeof parsedVal == 'boolean' ? parsedVal : false;
      let c: FormControl<boolean> =
        typedInput.getTypedInputFormControl(defaultVal);
      this.addControlToArray(control, c);
    }
  }

  addMapElement(typedInput: TypedInput): void {
    const control = this.formGroup.get(
      typedInput.id
    ) as GenericKeyValueMapArray;

    let parsedVal: string | number | boolean | undefined;
    if (typedInput.validation.default) {
      parsedVal = typedInput.parseScalarValue(typedInput.validation.default);
    }
    if (typedInput.isKeyValueMapArrayString(control)) {
      const defaultVal = typeof parsedVal == 'string' ? parsedVal : '';
      let c: FormControl<string> =
        typedInput.getTypedInputFormControl(defaultVal);
      this.addControlToMap(control, c);
    } else if (typedInput.isKeyValueMapArrayNumber(control)) {
      const defaultVal = typeof parsedVal == 'number' ? parsedVal : 0;
      let c: FormControl<number> =
        typedInput.getTypedInputFormControl(defaultVal);
      this.addControlToMap(control, c);
    } else {
      // if (typedInput.isKeyValueMapArrayBoolean(control))
      const defaultVal = typeof parsedVal == 'boolean' ? parsedVal : false;
      let c: FormControl<boolean> =
        typedInput.getTypedInputFormControl(defaultVal);
      this.addControlToMap(control, c);
    }
  }

  private addControlToArray<T extends string | number | boolean>(
    fa: FormArray<FormControl<T>>,
    fc: FormControl<T>
  ) {
    fa.push(fc);
    fc.updateValueAndValidity();
    setTimeout(() => {
      // this timeout is needed to trigger the validation of the control to show errors
      fc.markAsTouched();
      fc.updateValueAndValidity();
      this.inputChanged();
    });
  }

  private addControlToMap<T extends string | number | boolean>(
    fa: FormArray<GenericKeyValueGroup<T>>,
    vControl: FormControl<T>
  ) {
    let kControl = new FormControl('', {
      validators: [Validators.required, UniqueKeyValidator],
      nonNullable: true,
    });
    fa.push(
      new FormGroup({
        key: kControl,
        value: vControl,
      })
    );

    setTimeout(() => {
      // this timeout is needed to trigger the validation of the control to show errors
      vControl.markAsTouched();
      vControl.updateValueAndValidity();
      kControl.markAsTouched();
      kControl.updateValueAndValidity();
      this.inputChanged();
    });
  }
}
