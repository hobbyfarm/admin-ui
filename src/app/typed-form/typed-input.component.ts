import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TypedInput,
  TypedInputRepresentation,
  TypedInputType,
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

  isEnumType(typedInput: TypedInput): boolean {
    return typedInput.representation === TypedInputRepresentation.ENUM;
  }

  isArrayType(typedInput: TypedInput): boolean {
    return typedInput.representation === TypedInputRepresentation.ARRAY;
  }

  getControls(inputId: string): AbstractControl[] {
    return (this.formGroup.get(inputId) as FormArray).controls;
  }

  addArrayElement(typedInput: TypedInput) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    control.push(this.getTypedInputFormControl(typedInput.type, ''));
  }

  removeArrayElement(typedInput: TypedInput, index: number) {
    const control = this.formGroup.get(typedInput.id) as FormArray;
    control.removeAt(index);
  }

  getTypedInputFormControl(typedInputType: TypedInputType, value: any) {
    let control: FormControl | FormArray;
    switch (typedInputType) {
      case TypedInputType.STRING:
        control = new FormControl(value || '');
        break;
      case TypedInputType.FLOAT:
        control = new FormControl(value ? +value : null, [Validators.required]);
        break;
      case TypedInputType.INTEGER:
        control = new FormControl(value ? +value : null, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]);
        break;
      case TypedInputType.BOOLEAN:
        control = new FormControl(value === 'true', Validators.required);
        break;
    }
    return control;
  }
}
