import { FormArray, FormControl, Validators } from '@angular/forms';

export enum TypedInputType {
  STRING,
  INTEGER,
  FLOAT,
  BOOLEAN,
  // COLOR or other possible custom input types
}

export enum TypedInputRepresentation {
  SCALAR,
  ARRAY,
  MAP,
}

export enum FormGroupType {
  LIST, // Display all settings in a grouped list
  TABS, // Group form inputs, display groups in horizontal tabs (default)
  TABS_VERTICAL, // Group form inputs, display groups in vertical tabs
}

export class TypedInput {
  id: string; // id as of the metadata.name
  name: string; // Display name of the input
  category: string; // Category e.g. General, Provisioning etc.
  type: TypedInputType;
  representation: TypedInputRepresentation;
  validation: InputValidation;
  value: any;
  enumValues?: any[]; // If this is of type ENUM this list provides allowed values
  weight: number; // Weight of setting in it's category
}

export class InputValidation {
  required?: boolean;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  format?: string;
  pattern?: string;
  enum?: string[];
  default?: string;
  uniqueItems?: boolean;
}

export function getTypedInputFormControl(input: TypedInput, value: any) {
  // TODO validators from inputValidation here
  let control: FormControl | FormArray;
  switch (input.type) {
    case TypedInputType.STRING:
      control = new FormControl(value || '');
      break;
    case TypedInputType.FLOAT:
      control = new FormControl(value ? +value : null, [Validators.required]);
      break;
    case TypedInputType.INTEGER:
      control = new FormControl(value ? +value : null, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]);
      break;
    case TypedInputType.BOOLEAN:
      control = new FormControl(value === 'true', Validators.required);
      break;
  }
  return control;
}
