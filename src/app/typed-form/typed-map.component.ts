import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericKeyValueGroup } from '../data/forms';
import { TypedInput } from './TypedInput';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  template: '',
})
export class TypedMapComponent<T extends string | number | boolean> {
  @Input() map: FormArray<GenericKeyValueGroup<T>>;
  @Input() input: TypedInput;
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  inputChanged() {
    this.change.emit(true);
  }

  removeArrayElement(index: number) {
    this.map.removeAt(index);
    this.inputChanged();
  }

  getMapFormControl<T extends string | number | boolean>(
    ctrl: GenericKeyValueGroup<T>,
    controlName: 'key' | 'value',
  ): FormControl<T> | FormControl<string> {
    return ctrl.controls[controlName];
  }

  get minLength() {
    return this.input.getMinLength();
  }
}
