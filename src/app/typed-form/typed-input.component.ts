import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypedInput, TypedInputType } from './TypedInput';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-typed-input',
  templateUrl: './typed-input.component.html',
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
}
