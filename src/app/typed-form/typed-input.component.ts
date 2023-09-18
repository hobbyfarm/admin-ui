import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypedInput, TypedInputType } from './TypedInput';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

// TODO: Type reactive forms

@Component({
  selector: 'app-typed-input',
  templateUrl: './typed-input.component.html',
  styleUrls: ['./typed-input.component.scss'],
})
export class TypedInputComponent {
  @Input() input: TypedInput;
  @Input() formGroup: UntypedFormGroup;
  @Output() change: EventEmitter<boolean> = new EventEmitter(null);
  readonly TypedInputType = TypedInputType; // Reference to TypedInputTypes enum for template use
  constructor() {}

  inputChanged() {
    this.change.emit(true);
  }

  getControls(inputId: string): AbstractControl[] {
    return (this.formGroup.get(inputId) as UntypedFormArray).controls;
  }

  getMapFormControl(ctrl: AbstractControl, controlName: string): UntypedFormControl {
    const formGroup = ctrl as UntypedFormGroup;
    return formGroup.controls[controlName] as UntypedFormControl;
  }

  getArrayFormControl(ctrl: AbstractControl): UntypedFormControl {
    return ctrl as UntypedFormControl;
  }

  getFormControl(controlName: string): UntypedFormControl {
    return this.formGroup.controls[controlName] as UntypedFormControl;
  }

  getArrayLength(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as UntypedFormArray;
    return control.length;
  }

  getMapSize(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as UntypedFormArray;
    return control.length;
  }

  addArrayElement(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as UntypedFormArray;
    let c = typedInput.getTypedInputFormControl('');
    control.push(c);
    c.updateValueAndValidity();
    setTimeout(() => {
      // this timeout is needed to trigger the validation of the control to show errors
      c.markAsTouched();
      c.updateValueAndValidity();
      this.inputChanged();
    });
  }

  addMapElement(typedInput: TypedInput): void {
    const control = this.formGroup.get(typedInput.id) as UntypedFormArray;
    let vControl = typedInput.getTypedInputFormControl('');
    let kControl = new UntypedFormControl('', [Validators.required, this.uniquekeyvalidator]);
    control.push(
      new UntypedFormGroup({
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

  removeArrayElement(typedInput: TypedInput, index: number) {
    const control = this.formGroup.get(typedInput.id) as UntypedFormArray;
    control.removeAt(index);
    this.inputChanged();
  }

  private uniquekeyvalidator(control: AbstractControl): ValidationErrors | null {
    const parent = control.parent as UntypedFormGroup;
    if (!parent) return null;
    const key = control.value;
    const siblings = (parent.parent as UntypedFormArray).controls as UntypedFormGroup[];
    const keys = siblings.map(sibling => sibling.controls.key.value);
    const duplicates = keys.filter(k => k === key);
    return duplicates.length > 1 ? { 'duplicate': true } : null;
  }
}
