import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { TypedInput, FormGroupType } from './TypedInput';
import { FormControl, FormGroup } from '@angular/forms';
import {
  GenericFormArray,
  GenericFormControl,
  GenericKeyValueGroup,
  GenericKeyValueMapArray,
} from '../data/forms';

@Component({
  selector: 'app-typed-form',
  templateUrl: './typed-form.component.html',
  styleUrls: ['./typed-form.component.scss'],
})
export class TypedFormComponent implements OnInit, OnChanges {
  @Input() typedInputs: TypedInput[] = []; // Input: List of typed inputs for the form
  @Output() syncedInputs: EventEmitter<TypedInput[]> = new EventEmitter(); // Output: Emit updated TypedInput list when form changes
  @Output() inputsValid: EventEmitter<boolean> = new EventEmitter(false); // Output: Form is invalid
  @Input() groupType: FormGroupType = FormGroupType.LIST; // group Items, otherwise display all settings
  @Input() groupOrder: string[] = []; // start with this groups, other groups follow alphabetically.

  formGroup: FormGroup<{
    [key: string]:
      | GenericFormControl
      | GenericFormArray
      | GenericKeyValueMapArray;
  }> = new FormGroup({}); // Form group to manage the dynamic form
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
      let control:
        | GenericFormControl
        | GenericFormArray
        | GenericKeyValueMapArray;
      if (
        input.isString(input.value) ||
        input.isNumber(input.value) ||
        input.isBoolean(input.value)
      ) {
        control = input.getTypedInputFormControl(input.value);
      } else if (input.isStringArray(input.value)) {
        // Use individual branches for each array type. getTypedInputFormArray() does not accept union types.
        control = input.getTypedInputFormArray(input.value);
      } else if (input.isNumberArray(input.value)) {
        control = input.getTypedInputFormArray(input.value);
      } else if (input.isBooleanArray(input.value)) {
        control = input.getTypedInputFormArray(input.value);
      } else if (input.isStringMap(input.value)) {
        // Use individual branches for each map type. getTypedInputMap() does not accept union types.
        control = input.getTypedInputMap(input.value);
      } else if (input.isNumberMap(input.value)) {
        control = input.getTypedInputMap(input.value);
      } else {
        // input must be boolean map (only option left)
        control = input.getTypedInputMap(input.value);
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
      const control = this.formGroup.controls[input.id];
      if (control.errors) {
        valid = false;
        return;
      } else if (input.isGenericFormArray(control)) {
        //is required but has no field
        if (input.validation.required && control.controls.length == 0) {
          valid = false;
          return;
        }
        // When the TypedInput has the Array representation we need to check for errors on each control.
        control.controls.forEach(
          (
            arrayControl:
              | FormControl<string>
              | FormControl<number>
              | FormControl<boolean>,
          ) => {
            if (arrayControl.errors) {
              valid = false;
              return;
            }
          },
        );
      } else if (input.isGenericKeyValueMapArray(control)) {
        //is required but has no field
        if (input.validation.required && control.controls.length == 0) {
          valid = false;
          return;
        }
        // When the TypedInput has the Map representation we need to check for errors on each FormGroup.
        control.controls.forEach(
          (
            formGroup:
              | GenericKeyValueGroup<string>
              | GenericKeyValueGroup<number>
              | GenericKeyValueGroup<boolean>,
          ) => {
            if (
              formGroup.controls['key'].errors ||
              formGroup.controls['value'].errors
            ) {
              valid = false;
              return;
            }
          },
        );
      }
    });
    this.inputsValid.emit(valid);
  }

  groupTypedInputs(): { [key: string]: TypedInput[] } {
    const groupedInputs: { [key: string]: TypedInput[] } = {};
    this.typedInputs.forEach((input) => {
      // Fallback group name if the 'category' property is not set or empty
      if (!input.category || input.category == '') {
        input.category = 'General';
      }

      // If the group doesn't exist in the object, create it and initialize an empty array
      if (!groupedInputs[input.category]) {
        groupedInputs[input.category] = [];
      }

      groupedInputs[input.category].push(input);
    });

    // Sort the inputs within each group by their 'weight' property in descending order
    for (const groupName in groupedInputs) {
      groupedInputs[groupName].sort(
        (a, b) => (b.weight || 0) - (a.weight || 0),
      );
    }
    return groupedInputs;
  }

  getTypedInputValue(input: TypedInput) {
    const formControl = this.formGroup.controls[input.id];
    if (input.isGenericFormControl(formControl)) {
      return input.getTypedInputScalarValue(formControl.value);
    } else if (input.isFormArrayString(formControl)) {
      return input.getTypedInputRawArray(formControl);
    } else if (input.isFormArrayNumber(formControl)) {
      return input.getTypedInputRawArray(formControl);
    } else if (input.isFormArrayBoolean(formControl)) {
      return input.getTypedInputRawArray(formControl);
    } else if (input.isKeyValueMapArrayString(formControl)) {
      return input.getTypedInputRawMap(formControl);
    } else if (input.isKeyValueMapArrayNumber(formControl)) {
      return input.getTypedInputRawMap(formControl);
    } else {
      // if(input.isKeyValueMapArrayNumber(formControl))
      return input.getTypedInputRawMap(formControl);
    }
  }
}
