import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ReturnType, Task } from '../../data/vm-tasks';

@Component({
  selector: 'app-single-task-verification-markdown',
  templateUrl: './single-task-verification-markdown.component.html',
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotating', style({ transform: 'rotate(360deg)' })),
      transition('default => rotating', animate('1500ms')),
    ]),
  ],
  styleUrls: ['./single-task-verification-markdown.component.scss'],
})
export class SingleTaskVerificationMarkdownComponent {
  @Input() target: string;
  @Input() message: string;
  @Input() taskName: string;

  detailsOpen = false;

  rotationState = 'default';

  task: Task = {
    name: 'Placeholder Name',
    description: 'Placeholder Description',
    command: 'Placeholder command',
    expected_output_value: 'Expected Output',
    expected_return_code: 0,
    return_type: ReturnType.Return_Code_And_Text,
  };

  isOfReturnType(task: Task, returnTypes: string[]): boolean {
    return returnTypes.includes(task.return_type);
  }

  elementClicked() {
    this.rotationState = 'rotating';
    setTimeout(() => {
      this.rotationState = 'default';
    }, 1500);
  }
}
