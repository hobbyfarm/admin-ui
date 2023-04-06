import { Component } from '@angular/core';
import { TypedInput, TypedInputTypes } from '../../typed-form/TypedInput';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  public settings: TypedInput[] = [];
  public updatedSettings: TypedInput[] = [];
  public hasChanges: boolean = false;

  constructor() {
    // Retrieve settings from gargantua here
    this.settings = [
      {
        id: 'string-setting',
        name: 'String',
        group: 'group1',
        type: TypedInputTypes.STRING,
        value: 'Some text',
      },
      {
        id: 'boolean-setting',
        name: 'Boolean',
        group: 'group1',
        type: TypedInputTypes.BOOLEAN,
        value: 'true',
      },
      {
        id: 'number-setting',
        name: 'Number',
        group: 'group1',
        type: TypedInputTypes.NUMBER,
        value: '1337',
      },
      {
        id: 'enum-setting',
        name: 'Enum',
        group: 'group1',
        type: TypedInputTypes.ENUM,
        enumValues: ['First Value', 'Second Value', 'Third Value'],
        value: 'Second Value',
      },
    ];
  }

  onFormChange(data: TypedInput[]) {
    this.updatedSettings = data;
    this.hasChanges = true;
  }

  onSubmit() {
    console.log(this.updatedSettings);
  }
}
