import { Component } from '@angular/core';
import { TypedInput, TypedInputType, FormGroupType } from '../../typed-form/TypedInput';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  public settings: TypedInput[] = [];
  public updatedSettings: TypedInput[] = [];
  public hasChanges: boolean = false;
  readonly FormGroupType = FormGroupType; // Reference to TypedInputTypes enum for template use

  constructor() {
    // TODO 06.04.2023: Retrieve settings from gargantua here
    this.settings = [
      {
        id: 'string-setting',
        name: 'String',
        group: 'General',
        type: TypedInputType.STRING,
        value: 'Some text',
      },
      {
        id: 'boolean-setting',
        name: 'Boolean',
        group: 'General',
        type: TypedInputType.BOOLEAN,
        value: 'true',
      },
      {
        id: 'number-setting',
        name: 'Number',
        group: 'Other',
        type: TypedInputType.NUMBER,
        value: '1337',
      },
      {
        id: 'enum-setting',
        name: 'Enum',
        group: 'Third',
        type: TypedInputType.ENUM,
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
