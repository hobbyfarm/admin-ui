import {Component} from '@angular/core';
import {TypedInput, TypedInputTypes} from '../../typed-form/TypedInput';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  public settings: TypedInput[] = [];

  constructor() {
    this.settings = [
      {
        id: 'test-setting',
        name: 'Test this Setting', // Change to camelCase or snake_case
        group: 'group1',
        type: TypedInputTypes.STRING,
        value: 'Some text',
      },
      // ...
    ];

  }
}
