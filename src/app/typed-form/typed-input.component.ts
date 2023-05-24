import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TypedInput,
  TypedInputRepresentation,
  TypedInputType,
  getTypedInputFormControl,
} from './TypedInput';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
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

  isScalarType(typedInput: TypedInput): boolean {
    return typedInput.representation === TypedInputRepresentation.SCALAR;
  }

  isMapType(typedInput: TypedInput): boolean {
    return typedInput.representation === TypedInputRepresentation.MAP;
  }

  isArrayType(typedInput: TypedInput): boolean {
    return typedInput.representation === TypedInputRepresentation.ARRAY;
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

  addArrayElement(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    control.push(getTypedInputFormControl(typedInput, ''));
    this.inputChanged();
  }

  addMapElement(typedInput: TypedInput): void {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    control.push(
      new FormGroup({
        key: new FormControl(''),
        value: getTypedInputFormControl(typedInput, ''),
      })
    );
    this.inputChanged();
  }

  removeArrayElement(typedInput: TypedInput, index: number) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    control.removeAt(index);
    this.inputChanged();
  }
}
