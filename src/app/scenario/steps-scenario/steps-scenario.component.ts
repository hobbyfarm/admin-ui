import {
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { ClrModal } from '@clr/angular';
import { Scenario } from 'src/app/data/scenario';
import { Step } from 'src/app/data/step';

@Component({
  selector: 'steps-scenario',
  templateUrl: './steps-scenario.component.html',
  styleUrls: ['./steps-scenario.component.scss'],
})
export class StepsScenarioComponent {
  @Input()
  scenario: Scenario;

  public scenarioTainted: boolean = false;
  public editOpen: boolean = false;
  public editDangerClosed: boolean = true;
  public editSuccessClosed: boolean = true;
  public deleteStepOpen: boolean = false;
  public isStepsLengthNull: boolean = true;

  public editingStep: Step = new Step();
  public editingSteps: Step[] = [];

  public editingIndex: number = 0;
  public stepsToBeAdded: number = 0;
  public deletingStepIndex: number = 0;

  public editDangerAlert: string = '';
  public editSuccessAlert: string = '';

  @ViewChild('editmodal', { static: true }) editModal: ClrModal;
  @ViewChild('deletestepmodal', { static: true }) deleteStepModal: ClrModal;

  moveStepUp(i: number) {
    this.scenarioTainted = true;
    // get a copy of the to-be-moved item
    const obj = structuredClone(this.scenario.steps[i]);
    // delete at the index currently
    this.scenario.steps.splice(i, 1);
    // put into the i-1 index
    this.scenario.steps.splice(i - 1, 0, obj);
  }
  moveStepDown(i: number) {
    this.scenarioTainted = true;
    // get a copy of the to-be-moved item
    const obj = structuredClone(this.scenario.steps[i]);
    // delete at the index currently
    this.scenario.steps.splice(i, 1);
    // put into the i+1 index
    this.scenario.steps.splice(i + 1, 0, obj);
  }

  openEdit(i: number) {
    this.editingSteps = structuredClone(this.scenario.steps);
    if (this.editingSteps.length == 0) {
      this.openNewStep();
      return;
    }
    this.editingIndex = i;
    this.editingStep = this.editingSteps[i];
    this.editModal.open();
  }

  openNewStep() {
    this.editingSteps = structuredClone(this.scenario.steps);
    this.editingIndex = this.editingSteps.length;
    this.editingStep = new Step();
    this.editingStep.title = 'Step ' + (this.editingIndex + 1);
    // Provide default content with syntax examples
    this.editingStep.content =
      "## Your Content\n```ctr:node1\necho 'hello world'\n```\n```hidden:Syntax reference\navailable at [the hobbyfarm docs](https://hobbyfarm.github.io/docs/appendix/markdown_syntax/)\n```";
    this.editingSteps[this.editingIndex] = this.editingStep;
    this.editModal.open();
  }

  public openDeleteStep(i: number) {
    this.deletingStepIndex = i;
    this.deleteStepModal.open();
  }

  previousStep() {
    if (this.isFirstStep()) {
      return;
    }
    this.editingSteps[this.editingIndex] = this.editingStep;
    this.editingIndex--;
    this.editingStep = this.editingSteps[this.editingIndex];
  }
  isFirstStep() {
    return this.editingIndex == 0;
  }
  nextStep() {
    if (this.isLastStep()) {
      return;
    }
    this.editingSteps[this.editingIndex] = this.editingStep;
    this.editingIndex++;
    this.editingStep = this.editingSteps[this.editingIndex];
  }
  isLastStep() {
    return this.editingIndex >= this.editingSteps?.length - 1;
  }
  cancelEdit() {
    this.editModal.close();
  }

  saveCreatedStep() {
    this.scenario.steps = structuredClone(this.editingSteps);
    this.isStepsLengthNull = false;
    this.stepsToBeAdded = 0;
    this.editModal.close();
  }
  public doDeleteStep() {
    this.scenario.steps.splice(this.deletingStepIndex, 1);
    this.deleteStepModal.close();
    if (this.scenario.steps.length == 0) this.isStepsLengthNull = true;
  }
}
