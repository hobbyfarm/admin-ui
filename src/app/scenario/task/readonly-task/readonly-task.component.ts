import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReturnType, Task } from 'src/app/data/vm-tasks';
import { supportedLanguages } from 'src/app/configuration/code-with-syntax-highlighting/code-with-syntax-highlighting.component';

export interface EditTask extends Task {
  id: string;
  vmName: string;
}

@Component({
  selector: 'app-readonly-task',
  templateUrl: './readonly-task.component.html',
  styleUrls: ['./readonly-task.component.scss'],
})
export class ReadonlyTaskComponent {

  @Input() editTask: EditTask;

  supportedLanguages = supportedLanguages;

  translateReturnType(rtype: string) {
    return ReturnType[rtype]
  }

  isOfReturnType(returnTypes: string[]): boolean {
    return returnTypes.includes(this.translateReturnType(this.editTask.return_type));
  }
}
