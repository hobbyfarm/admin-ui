import { Component } from '@angular/core';
import {
  TypedInput,
  TypedInputType,
  FormGroupType,
  TypedInputRepresentation,
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
        value: 'Some text',
        weight: 10,
      },
      {
        id: 'boolean-setting',
        name: 'Boolean',
        category: '',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.BOOLEAN,
        value: 'true',
        weight: 20,
      },
      {
        id: 'number-setting',
        name: 'Number',
        category: 'Other',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.INTEGER,
        value: '1337',
        weight: 10,
      },
      {
        id: 'float-setting',
        name: 'Float',
        category: 'Other',
        representation: TypedInputRepresentation.SCALAR,
        type: TypedInputType.FLOAT,
        value: '13.37',
        weight: 30,
      },
      {
        id: 'enum-string',
        name: 'Enum string',
        category: 'Third',
        type: TypedInputType.STRING,
        representation: TypedInputRepresentation.ENUM,
        enumValues: ['First Value', 'Second Value', 'Third Value'],
        value: 'Second Value',
        weight: 100,
      },
      {
        id: 'enum-float',
        name: 'Enum float',
        category: 'Third',
        type: TypedInputType.FLOAT,
        representation: TypedInputRepresentation.ENUM,
        enumValues: ['1.1', '2.23', '13.37'],
        value: '1337',
        weight: 100,
      },
      {
        id: 'enum-integer',
        name: 'Enum int',
        category: 'Third',
        type: TypedInputType.INTEGER,
        representation: TypedInputRepresentation.ENUM,
        enumValues: ['12', '1', '1337'],
        value: '1337',
        weight: 100,
      },
      {
        id: 'array-string',
        name: 'Array String',
        category: 'Array',
        type: TypedInputType.STRING,
        representation: TypedInputRepresentation.ARRAY,
        value: ['this', 'is', 'an', 'array'],
        weight: 100,
      },
      {
        id: 'array-integer',
        name: 'Array Integer',
        category: 'Array',
        type: TypedInputType.INTEGER,
        representation: TypedInputRepresentation.ARRAY,
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
