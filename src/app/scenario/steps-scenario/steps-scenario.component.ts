import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ClrModal } from '@clr/angular';
import { Scenario } from 'src/app/data/scenario';
import { Step } from 'src/app/data/step';
import { QuizService } from 'src/app/data/quiz.service';
import { finalize } from 'rxjs/operators';

type Quiz = { id: string; title?: string };

@Component({
  selector: 'steps-scenario',
  templateUrl: './steps-scenario.component.html',
  styleUrls: ['./steps-scenario.component.scss'],
})
export class StepsScenarioComponent implements OnInit {
  @Input()
  scenario: Scenario;

  public scenarioTainted: boolean = false;
  public editOpen: boolean = false;
  public deleteStepOpen: boolean = false;
  public isStepsLengthNull: boolean = true;

  public editingStep: Step = new Step();
  public editingSteps: Step[] = [];

  public editingIndex: number = 0;
  public stepsToBeAdded: number = 0;
  public deletingStepIndex: number = 0;

  // Quizzes for selector + title lookup
  public quizzes: Quiz[] = [];
  public quizTitleById: Record<string, string> = {};
  public loadingQuizzes = false;

  @ViewChild('editmodal', { static: true }) editModal: ClrModal;
  @ViewChild('deletestepmodal', { static: true }) deleteStepModal: ClrModal;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.isStepsLengthNull = !this.scenario?.steps?.length;

    // Load quizzes for selector and display (title by ID)
    this.loadingQuizzes = true;
    this.quizService
      .list()
      .pipe(finalize(() => (this.loadingQuizzes = false)))
      .subscribe({
        next: (qs) => {
          this.quizzes = (qs || []).map((q) => ({
            id: q.id ?? '',
            title: q.title ?? '',
          }));
          this.quizTitleById = this.quizzes.reduce<Record<string, string>>(
            (acc, q) => {
              if (q.id) acc[q.id] = q.title || q.id;
              return acc;
            },
            {},
          );
        },
        error: () => {
          this.quizzes = [];
          this.quizTitleById = {};
        },
      });
  }

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

    // Ensure quiz property exists (string id, or '')
    if (this.editingStep && !this.editingStep.quiz) {
      this.editingStep.quiz = '';
    }

    this.editModal.open();
  }

  openNewStep() {
    this.editingSteps = structuredClone(this.scenario.steps);
    this.editingIndex = this.editingSteps.length;

    const s = new Step();
    s.title = 'Step ' + (this.editingIndex + 1);
    // Provide default content with syntax examples
    s.content =
      "## Your Content\n```ctr:node1\necho 'hello world'\n```\n```hidden:Syntax reference\navailable at [the hobbyfarm docs](https://hobbyfarm.github.io/docs/appendix/markdown_syntax/)\n```";
    // Adding quiz id. Empty means none.
    s.quiz = '';

    this.editingStep = s;
    this.editingSteps[this.editingIndex] = this.editingStep;
    this.editModal.open();
  }

  public openDeleteStep(i: number) {
    this.deletingStepIndex = i;
    this.deleteStepModal.open();
  }

  previousStep() {
    if (this.isFirstStep()) return;
    this.editingSteps[this.editingIndex] = this.editingStep;
    this.editingIndex--;
    this.editingStep = this.editingSteps[this.editingIndex];
    if (!this.editingStep.quiz) {
      this.editingStep.quiz = '';
    }
  }
  isFirstStep() {
    return this.editingIndex == 0;
  }
  nextStep() {
    if (this.isLastStep()) return;
    this.editingSteps[this.editingIndex] = this.editingStep;
    this.editingIndex++;
    this.editingStep = this.editingSteps[this.editingIndex];
    if (!this.editingStep.quiz) {
      this.editingStep.quiz = '';
    }
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
    this.isStepsLengthNull = this.scenario.steps.length == 0;
  }
}
