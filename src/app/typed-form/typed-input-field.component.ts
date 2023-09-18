import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TypedInput,
  TypedInputType,
  TypedInputRepresentation,
} from './TypedInput';
import { UntypedFormControl } from '@angular/forms';

// TODO: Type reactive forms

@Component({
  selector: 'app-typed-input-field',
  templateUrl: './typed-input-field.component.html',
  styleUrls: ['./typed-input-field.component.scss'],
})
export class TypedInputFieldComponent {
  @Input() input: TypedInput;
  @Input() formControlRef: UntypedFormControl;
  @Output() change: EventEmitter<boolean> = new EventEmitter(null);
  readonly TypedInputType = TypedInputType; // Reference to TypedInputTypes enum for template use
  readonly TypedInputRepresentation = TypedInputRepresentation; // Reference to TypedInputRepresentation enum for template use
  constructor() {}

  inputChanged() {
    this.change.emit(true);
  }
}
