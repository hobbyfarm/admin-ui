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
      {
        id: 'string-setting',
        name: 'String',
        category: '',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.STRING,
        validation: new InputValidation(),
        value: 'Some text',
        weight: 10,
      },
      {
        id: 'boolean-setting',
        name: 'Boolean',
        category: '',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.BOOLEAN,
        validation: new InputValidation(),
        value: 'true',
        weight: 20,
      },
      {
        id: 'number-setting',
        name: 'Number',
        category: 'Other',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.INTEGER,
        validation: new InputValidation(),
        value: '1337',
        weight: 10,
      },
      {
        id: 'float-setting',
        name: 'Float',
        category: 'Other',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.FLOAT,
        validation: new InputValidation(),
        value: '13.37',
        weight: 30,
      },
      {
        id: 'map-string',
        name: 'MAP string',
        category: 'Third',
        type: TypedInputType.STRING,
        representation: TypedInputRepresentation.MAP,
        validation: new InputValidation(),
        enumValues: [],
        value: {'Second Value': "Value1", "Third Value": "TestValue2"},
        weight: 100,
      },
      {
        id: 'map-integer',
        name: 'MAP Integer',
        category: 'Third',
        type: TypedInputType.INTEGER,
        representation: TypedInputRepresentation.MAP,
        validation: new InputValidation(),
        enumValues: [],
        value: {'first': "2", "second Value": "3"},
        weight: 100,
      },
      {
        id: 'array-string',
        name: 'Array String',
        category: 'Array',
        type: TypedInputType.STRING,
        representation: TypedInputRepresentation.ARRAY,
        validation: new InputValidation(),
        value: ['this', 'is', 'an', 'array'],
        weight: 100,
      },
      {
        id: 'array-integer',
        name: 'Array Integer',
        category: 'Array',
        type: TypedInputType.INTEGER,
        representation: TypedInputRepresentation.ARRAY,
        validation: {enum: ["1","3","4"]} as InputValidation,
        value: ['1', '3', '5', '7'],
        weight: 100,
      },
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
