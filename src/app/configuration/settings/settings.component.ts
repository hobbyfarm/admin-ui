import { Component } from '@angular/core';
import {
  TypedInput,
  TypedInputType,
  FormGroupType,
  TypedInputRepresentation,
  InputValidation,
} from '../../typed-form/TypedInput';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  public settings: TypedInput[] = [];
  public updatedSettings: TypedInput[] = [];
  public hasChanges: boolean = false;
  public valid: boolean = true;
  readonly FormGroupType = FormGroupType; // Reference to TypedInputTypes enum for template use

  constructor() {
    // TODO 06.04.2023: Retrieve settings from gargantua here
    this.settings = [
      new TypedInput({
        id: 'string-setting',
        name: 'String',
        category: '',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.STRING,
        validation: {
          required: true,
          default: 'nothing here',
          minLength: 3,
          maxLength: 15,
        } as InputValidation,
        value: '',
        weight: 10,
      }),
      new TypedInput({
        id: 'email-setting',
        name: 'Mail',
        category: '',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.STRING,
        validation: {
          required: true,
          pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
        } as InputValidation,
        value: '',
        weight: 10,
      }),
      new TypedInput({
        id: 'boolean-setting',
        name: 'Boolean',
        category: '',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.BOOLEAN,
        validation: new InputValidation(),
        value: 'true',
        weight: 20,
      }),
      new TypedInput({
        id: 'number-setting',
        name: 'Number',
        category: 'Other',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.INTEGER,
        validation: { minimum: 100, maximum: 2000 },
        value: '1337',
        weight: 10,
      }),
      new TypedInput({
        id: 'float-setting',
        name: 'Float',
        category: 'Other',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.FLOAT,
        validation: new InputValidation(),
        value: '13.37',
        weight: 30,
      }),
      new TypedInput({
        id: 'map-string',
        name: 'MAP string',
        category: 'Third',
        type: TypedInputType.STRING,
        representation: TypedInputRepresentation.MAP,
        validation: { required: true } as InputValidation,
        value: { 'Second Value': 'Value1', 'Third Value': 'TestValue2' },
        weight: 100,
      }),
      new TypedInput({
        id: 'map-integer',
        name: 'MAP Integer',
        category: 'Third',
        type: TypedInputType.INTEGER,
        representation: TypedInputRepresentation.MAP,
        validation: {
          required: true,
          maxLength: 5,
          minLength: 2,
        } as InputValidation,

        value: { first: '2', 'second Value': '3' },
        weight: 100,
      }),
      new TypedInput({
        id: 'array-string',
        name: 'Array String',
        category: 'Array',
        type: TypedInputType.STRING,
        representation: TypedInputRepresentation.ARRAY,
        validation: {
          required: true,
          maxLength: 5,
          minLength: 2,
          uniqueItems: true,
        } as InputValidation,
        value: ['this', 'is', 'an', 'array'],
        weight: 100,
      }),
      new TypedInput({
        id: 'array-integer',
        name: 'Array Enum Integer',
        category: 'Array',
        type: TypedInputType.INTEGER,
        representation: TypedInputRepresentation.ARRAY,
        validation: { enum: ['1', '3', '4'] } as InputValidation,
        value: ['1', '3', '5', '7'],
        weight: 100,
      }),
      new TypedInput({
        id: 'array-string-enum',
        name: 'Array Enum String',
        category: 'Array',
        type: TypedInputType.STRING,
        representation: TypedInputRepresentation.ARRAY,
        validation: { enum: ['first', '2nd', '3rd'], required: true, maxLength: 3} as InputValidation,
        value: ['first', 'invalid', '3rd', '2nd'],
        weight: 100,
      }),
    ];
  }

  onFormChange(data: TypedInput[]) {
    this.updatedSettings = data;
    this.hasChanges = true;
  }

  changeFormValidity(valid: boolean) {
    this.valid = valid;
  }

  onSubmit() {
    console.log(this.updatedSettings);
  }
}
