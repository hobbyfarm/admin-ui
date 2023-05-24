import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  TypedInput,
  TypedInputType,
  FormGroupType,
  TypedInputRepresentation,
  getTypedInputFormControl,
} from './TypedInput';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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
      let control: FormControl | FormArray;

      if (input.representation === TypedInputRepresentation.SCALAR) {
        control = getTypedInputFormControl(input, input.value);
      } else if (input.representation === TypedInputRepresentation.ARRAY) {
        const controls = (input.value as any[]).map((val) =>
          getTypedInputFormControl(input, val)
        );
        control = new FormArray(controls);
      }
      else if (input.representation === TypedInputRepresentation.MAP) {
        const mapControls: FormGroup[] = [];
        if (input.value) {
          for (const key in input.value) {
            if (input.value.hasOwnProperty(key)) {
              const mapControl = new FormGroup({
                key: new FormControl(key),
                value: getTypedInputFormControl(input, input.value[key])
              });
              mapControls.push(mapControl);
            }
          }
        }
        control = new FormArray(mapControls);
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
      const control = this.formGroup.get(input.id);
      if (control.errors) {
        valid = false;
        return;
      }
      if (input.representation === TypedInputRepresentation.ARRAY) {
        // When the TypedInput has the Array representation we need to check for errors on each control.
        (control as FormArray).controls.forEach((arrayControl) => {
          if (arrayControl.errors) {
            valid = false;
            return;
          }
        });
      }
    });
    console.log('here valid');
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
        (a, b) => (b.weight || 0) - (a.weight || 0)
      );
    }
    return groupedInputs;
  }

  getTypedInputValue(input: TypedInput) {
    const formValue = this.formGroup.get(input.id).value;
    if (input.representation === TypedInputRepresentation.SCALAR) {
      return this.getTypedInputScalarValue(input, formValue);
    } else if (input.representation === TypedInputRepresentation.ARRAY) {
      return (this.formGroup.get(input.id) as FormArray).controls.map(
        (control) => this.getTypedInputScalarValue(input, control.value)
      );
    }else if (input.representation === TypedInputRepresentation.MAP) {
        let formGroup = this.formGroup.get(input.id) as FormArray;
        let result = new Map();
        formGroup.controls.forEach((group: AbstractControl) => {
          let key = (group as FormGroup).controls['key'].value;
          let value = this.getTypedInputScalarValue(input, (group as FormGroup).controls['value'].value);
          result.set(key, value);
        });
        return result;
    }
  }

  getTypedInputScalarValue(input: TypedInput, value: any) {
    switch (input.type) {
      case TypedInputType.BOOLEAN:
        return value;
      case TypedInputType.FLOAT:
        return +value;
      case TypedInputType.INTEGER:
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
          return 0;
        }
        return parsed;
      case TypedInputType.STRING:
        return value;
    }
  }

  getTypedInputEnumValues(input: TypedInput): any[] {
    if (!input.enumValues) {
      return [];
    }
    return input.enumValues.map((v) => {
      return this.getTypedInputScalarValue(input, v);
    });
  }
}
