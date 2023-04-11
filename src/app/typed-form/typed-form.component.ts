import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { TypedInput, TypedInputType, FormGroupType } from './TypedInput';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-typed-form',
  templateUrl: './typed-form.component.html',
  styleUrls: ['./typed-form.component.scss'],
})
export class TypedFormComponent implements OnInit, OnChanges {
  @Input() typedInputs: TypedInput[] = []; // Input: List of typed inputs for the form
  @Output() syncedInputs: EventEmitter<TypedInput[]> = new EventEmitter(null); // Output: Emit updated TypedInput list when form changes
  @Output() inputsValid: EventEmitter<boolean> = new EventEmitter(false); // Output: Form is invalid
  @Input() groupType: FormGroupType = FormGroupType.LIST; // group Items, otherwise display all settings
  @Input() groupOrder: string[] = []; // start with this groups, other groups follow alphabetically.

  formGroup: FormGroup = new FormGroup({}); // Form group to manage the dynamic form
  readonly FormGroupType = FormGroupType; // Reference to TypedInputTypes enum for template use
  activeTab = 0; // Activate first tab per default

  groupedInputs: { [key: string]: TypedInput[] }; // stores all inputs grouped by TypedInput.group

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
    this.groupedInputs = this.groupTypedInputs();
  }

  /**
   * Initialize the form by creating form controls based on the typedInputs.
   */
  initForm(): void {
    this.typedInputs.forEach((input) => {
      let control: FormControl;

      switch (input.type) {
        case TypedInputType.STRING:
          control = new FormControl(input.value || '');
          break;
        case TypedInputType.ENUM:
          control = new FormControl(input.value || '', Validators.required);
          break;
        case TypedInputType.FLOAT:
          control = new FormControl(input.value ? +input.value : null, [
            Validators.required,
          ]);
          break;
        case TypedInputType.INTEGER:
          control = new FormControl(input.value ? +input.value : null, [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
          ]);
          break;
        case TypedInputType.BOOLEAN:
          control = new FormControl(
            input.value === 'true',
            Validators.required
          );
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
    this.typedInputs.forEach((input) => {
      input.value = this.getTypedInputValue(input);
      data.push(input);
    });
    return data;
  }

  /**
   * Emit the updated TypedInput list when the form changes.
   */
  onFormChanged(): void {
    this.syncedInputs.emit(this.retrieveFormData());

    let valid = true;
    this.typedInputs.forEach((input) => {
      if (this.formGroup.get(input.id).errors) {
        valid = false;
        return;
      }
    });
    console.log('here valid');
    this.inputsValid.emit(valid);
  }

  groupTypedInputs(): { [key: string]: TypedInput[] } {
    const groupedInputs: { [key: string]: TypedInput[] } = {};
    this.typedInputs.forEach((input) => {
      input.categories.forEach((category) => {
        if (!groupedInputs[category]) {
          groupedInputs[category] = [];
        }
        groupedInputs[category].push(input);
      });
    });
    return groupedInputs;
  }

  getTypedInputValue(input: TypedInput) {
    const v = this.formGroup.get(input.id).value;

    switch (input.type) {
      case TypedInputType.BOOLEAN:
        return v;
      case TypedInputType.ENUM:
        if (!input.enumValues) return '';
        if (!input.enumValues[0]) return '';
        return input.enumValues.includes(v) ? v : input.enumValues[0];
      case TypedInputType.FLOAT:
        return +v;
      case TypedInputType.INTEGER:
        const parsed = parseInt(v, 10);
        if (isNaN(parsed)) {
          return 0;
        }
        return parsed;
      case TypedInputType.STRING:
        return v;
    }
  }
}
