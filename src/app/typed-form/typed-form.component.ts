import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {TypedInput, TypedInputTypes} from './TypedInput';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-typed-form',
  templateUrl: './typed-form.component.html',
  styleUrls: ['./typed-form.component.scss'],
})

export class TypedFormComponent implements OnInit, OnChanges  {
  @Input() typedInputs: TypedInput[] = []; // Input: List of typed inputs for the form
  @Output() syncedInputs: EventEmitter<TypedInput[]> = new EventEmitter(null); // Output: Emit updated TypedInput list when form changes

  formGroup: FormGroup = new FormGroup({});  // Form group to manage the dynamic form
  readonly TypedInputTypes = TypedInputTypes; // Reference to TypedInputTypes enum for template use

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  /**
   * Initialize the form by creating form controls based on the typedInputs.
   */
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

  /**
   * Retrieve the form data as an array of TypedInput objects.
   */
  retrieveFormData(): TypedInput[] {
    const data: TypedInput[] = [];
    this.typedInputs.forEach(input => {
      input.value = this.formGroup.get(input.id).value;
      data.push(input);
    });
    console.log(data);
    return data;
  }

  /**
   * Emit the updated TypedInput list when the form changes.
   */
  onFormChanged(): void {
    this.syncedInputs.emit(this.retrieveFormData());
  }
}
