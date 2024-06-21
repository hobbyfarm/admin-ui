import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReturnType, Task } from 'src/app/data/vm-tasks';
import { supportedLanguages } from 'src/app/configuration/code-with-syntax-highlighting/code-with-syntax-highlighting.component';

export interface EditTask extends Task {
  id: string;
  vmName: string;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  @Input() virtualMachineNames: string[];

  @Input() editTask: EditTask;

  @Output() taskChanged = new EventEmitter<EditTask>();

  supportedLanguages = supportedLanguages;

  returnTypes = Object.values(ReturnType);

  private previousReturnType: string = 'Return Text';

  taskForm: FormGroup;

  ngOnInit() {
    this.taskForm = new FormGroup({
      taskNode: new FormControl(this.editTask.vmName, [Validators.required]),
      taskName: new FormControl(this.editTask.name, [Validators.required]),
      taskDescription: new FormControl(this.editTask.description, [
        Validators.required,
      ]),
      taskCommand: new FormControl(this.editTask.command, [
        Validators.required,
      ]),
      taskExpectedOutput: new FormControl(this.editTask.expected_output_value, []),
      taskExpectedReurncode: new FormControl(
        this.editTask.expected_return_code,
        []
      ),
      taskReturnType: new FormControl(ReturnType[this.editTask.return_type], [
        Validators.required,
      ]),
    });
    this.taskForm.valueChanges.subscribe(() => {
      this.taskChanged.emit(this.buildEditTaskFromFormData());
      this.taskForm.updateValueAndValidity({ emitEvent: false });
    });
    this.previousReturnType =
      ReturnType[
        this.editTask.return_type as unknown as keyof typeof ReturnType
      ];
    this.taskForm.controls.taskReturnType.valueChanges.subscribe((newValue) => {
      if (
        this.previousReturnType == 'Match Regex' &&
        newValue !== 'Match Regex'
      ) {
        this.taskForm.controls.taskExpectedOutput.setValue('');
      }
      if (
        this.previousReturnType !== 'Match Regex' &&
        newValue == 'Match Regex'
      ) {
        this.taskForm.controls.taskExpectedOutput.setValue('');
      }
      if (newValue == 'Return Code') {
        this.taskForm.controls.taskExpectedOutput.setValue('');
      }
      this.previousReturnType = newValue;
    });
  }

  private buildEditTaskFromFormData(): EditTask {
    const rTypeString = this.taskForm.controls.taskReturnType.value;
    const rTypeKey =
      Object.keys(ReturnType).find((key) => ReturnType[key] == rTypeString) ??
      'Return_Text';
    const expectedReturnCode =
      this.taskForm.controls.taskExpectedReurncode.value == ''
        ? 0
        : this.taskForm.controls.taskExpectedReurncode.value;
    return {
      id: this.editTask.id,
      vmName: this.taskForm.controls.taskNode.value,
      name: this.taskForm.controls.taskName.value,
      description: this.taskForm.controls.taskDescription.value,
      command: this.taskForm.controls.taskCommand.value,
      expected_output_value: this.taskForm.controls.taskExpectedOutput.value,
      expected_return_code: expectedReturnCode,
      return_type: rTypeKey,
    } as unknown as EditTask;
  }

  isOfReturnType(returnTypes: string[]): boolean {
    return returnTypes.includes(this.taskForm.controls.taskReturnType.value);
  }

  commandOutput(command) {
    this.editTask.command = command;
    this.taskForm.controls.taskCommand.setValue(command);
  }

  regexOutput(regex) {
    this.taskForm.controls.taskExpectedOutput.setValue(regex);
  }
}
