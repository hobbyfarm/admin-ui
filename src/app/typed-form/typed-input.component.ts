import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypedInput, TypedInputType } from './TypedInput';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-typed-input',
  templateUrl: './typed-input.component.html',
  styleUrls: ['./typed-input.component.scss'],
})
export class TypedInputComponent {
  @Input() input: TypedInput;
  @Input() formGroup: FormGroup;
  @Output() change: EventEmitter<boolean> = new EventEmitter(null);
  readonly TypedInputType = TypedInputType; // Reference to TypedInputTypes enum for template use
  constructor() {}

  inputChanged() {
    this.change.emit(true);
  }

  getControls(inputId: string): AbstractControl[] {
    return (this.formGroup.get(inputId) as FormArray).controls;
  }

  getMapFormControl(ctrl: AbstractControl, controlName: string): FormControl {
    const formGroup = ctrl as FormGroup;
    return formGroup.controls[controlName] as FormControl;
  }

  getArrayFormControl(ctrl: AbstractControl): FormControl {
    return ctrl as FormControl;
  }

  getFormControl(controlName: string): FormControl {
    return this.formGroup.controls[controlName] as FormControl;
  }

  getArrayLength(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    return control.length;
  }

  getMapSize(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    return control.length;
  }

  addArrayElement(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
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
    const control = this.formGroup.get(typedInput.id) as FormArray;
    let vControl = typedInput.getTypedInputFormControl('');
    let kControl = new FormControl('', [Validators.required, this.uniquekeyvalidator]);
    control.push(
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

  removeArrayElement(typedInput: TypedInput, index: number) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    control.removeAt(index);
    this.inputChanged();
  }

  private uniquekeyvalidator(control: AbstractControl): ValidationErrors | null {
    const parent = control.parent as FormGroup;
    if (!parent) return null;
    const key = control.value;
    const siblings = (parent.parent as FormArray).controls as FormGroup[];
    const keys = siblings.map(sibling => sibling.controls.key.value);
    const duplicates = keys.filter(k => k === key);
    return duplicates.length > 1 ? { 'duplicate': true } : null;
  }
}
