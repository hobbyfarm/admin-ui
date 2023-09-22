import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypedInput } from './TypedInput';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  template: ''
})
export class TypedArrayComponent<T extends string | number | boolean> {
  @Input() array: FormArray<FormControl<T>>;
  @Input() input: TypedInput;
  @Output() change: EventEmitter<boolean> = new EventEmitter(null);

  inputChanged() {
    this.change.emit(true);
  }

  removeArrayElement(index: number) {
    this.array.removeAt(index);
    this.inputChanged();
  }
}