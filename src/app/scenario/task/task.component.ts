import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Scenario } from 'src/app/data/scenario';
import { Task, VMTasks } from 'src/app/data/vm-tasks';
import { EditTask } from '../task-form/task-form.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() set selectedScenario(scenario: Scenario) {
    this.editTasks = [];
    this.changedTasks = [];
    this.vmTasks = scenario.vm_tasks ?? [];
    this.vmNames = scenario.virtualmachines
      .map((vmSet) => Object.keys(vmSet))
      .reduce((acc, curr) => acc.concat(curr), []); //Can be replaced with flatMap once we switch to es2019 or higher

    this.vmTasks.forEach((vmTask) => {
      vmTask.tasks.forEach((task: Task) => {
        let editTask = {
          vmName: vmTask.vm_name,
          id: this.getRandomId(),
          ...task,
        };
        this.changedTasks.push(editTask);
        this.editTasks.push(editTask);
      });
    });
  }

  @Input() readonly = false

  editTasks: EditTask[] = [];

  changedTasks: EditTask[] = [];

  vmNames: string[] = [];

  vmTasks: VMTasks[] = [];

  @Output() tasksChanged = new EventEmitter<VMTasks[]>();

  buildEditedVMTasks() {
    let updatedVMTasks: VMTasks[] = [];
    this.changedTasks.forEach((editTask) => {
      let vmTask = updatedVMTasks.find((vmTask) => {
        return vmTask.vm_name == editTask.vmName;
      });
      if (vmTask) {
        vmTask.tasks.push(this.buildTask(editTask));
      } else {
        updatedVMTasks.push({
          vm_name: editTask.vmName,
          tasks: [this.buildTask(editTask)],
        });
      }
    });
    this.vmTasks = updatedVMTasks;
    this.tasksChanged.emit(this.vmTasks);
  }

  buildTask(editTask: EditTask = null): Task {
    return {
      name: editTask?.name ?? '',
      description: editTask?.description ?? '',
      command: editTask?.command ?? '',
      expected_output_value: editTask?.expected_output_value ?? '',
      expected_return_code: editTask?.expected_return_code ?? '',
      return_type: editTask?.return_type ?? 'Return_Text',
    } as Task;
  }

  updateTask(changedTask: EditTask) {
    let idExists = this.changedTasks
      .map((task) => task.id)
      .includes(changedTask.id);
    if (!idExists) {
      this.changedTasks.push(changedTask);
      return;
    }
    this.changedTasks = this.changedTasks.map((task) =>
      task.id !== changedTask.id ? task : changedTask
    );
    this.buildEditedVMTasks();
  }

  addTask() {
    let newTask = {
      vmName: this.vmNames[0] ?? '',
      id: this.getRandomId(),
      ...this.buildTask(),
    } as EditTask;
    this.editTasks.push(newTask);
    this.changedTasks.push(newTask);
    this.buildEditedVMTasks();
  }

  deleteTask(id: string) {
    this.editTasks = this.editTasks.filter((task: EditTask) => {
      return task.id !== id;
    });
    this.changedTasks = this.changedTasks.filter((task: EditTask) => {
      return task.id !== id;
    });
    this.buildEditedVMTasks();
  }

  applyChanges() {
    this.changedTasks.forEach((chTask: EditTask) => {
      const alreadyExists = this.editTasks
        .map((task) => task.id)
        .includes(chTask.id);
      if (alreadyExists) {
        this.editTasks = this.editTasks.map((eTask: EditTask) => {
          return eTask.id == chTask.id ? chTask : eTask;
        });
      } else {
        this.editTasks.push(chTask);
      }
    });
    this.buildEditedVMTasks();
  }

  getRandomId(): string {
    return Math.random().toString(36).substring(2);
  }
}
