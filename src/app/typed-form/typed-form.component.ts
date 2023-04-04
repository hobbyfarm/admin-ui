import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {TypedInput, TypedInputTypes} from './TypedInput';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-typed-form',
  templateUrl: './typed-form.component.html',
  styleUrls: ['./typed-form.component.scss'],
})

export class TypedFormComponent implements OnChanges {
  @Input() typedInputs: TypedInput[] = [];
  @Output() syncedInputs: EventEmitter<TypedInput[]> = new EventEmitter(null);

  formGroup: FormGroup = new FormGroup({});
  readonly TypedInputTypes = TypedInputTypes;

  constructor() {
    this.initForm();
  }

  ngOnChanges() {
    // this.buildForm();
  }

  initForm(): void {
    this.typedInputs.forEach(input => {
      let control: FormControl;

      switch (input.type) {
        case TypedInputTypes.STRING:
        case TypedInputTypes.ENUM:
          control = new FormControl(input.value || '', Validators.required);
          break;
        case TypedInputTypes.NUMBER:
          control = new FormControl(input.value ? +input.value : null, Validators.required);
          break;
        case TypedInputTypes.BOOLEAN:
          control = new FormControl(input.value === 'true', Validators.required);
          break;
      }

      this.formGroup.addControl(input.id, control);
    });
  }

  onSubmit(): void {
    console.log('Form submitted:', this.formGroup.value);
  }
}
