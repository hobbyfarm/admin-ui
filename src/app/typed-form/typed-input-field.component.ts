import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TypedInput,
  TypedInputType,
  TypedInputRepresentation,
} from './TypedInput';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-typed-input-field',
  templateUrl: './typed-input-field.component.html',
  styleUrls: ['./typed-input-field.component.scss'],
})
export class TypedInputFieldComponent {
  @Input() input: TypedInput;
  @Input() formGroup: FormGroup;
  @Input() formControlRef: FormControl;
  @Output() change: EventEmitter<boolean> = new EventEmitter(null);
  readonly TypedInputType = TypedInputType; // Reference to TypedInputTypes enum for template use
  readonly TypedInputRepresentation = TypedInputRepresentation; // Reference to TypedInputRepresentation enum for template use
  constructor() {}

  inputChanged() {
    this.change.emit(true);
  }
}
