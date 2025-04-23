import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  QuizService,
  Quiz,
  QuizQuestion,
  QuizAnswer,
} from '../../data/quiz.service';
import {
  QuizAnswerFormGroup,
  QuizFormGroup,
  QuizQuestionFormGroup,
} from '../QuizFormGroup';
import { Validation } from '../Validation';
import { QuestionType } from '../QuestionType';
import { ClrWizard } from '@clr/angular';

@Component({
  selector: 'app-quiz-wizard',
  templateUrl: './quiz-wizard.component.html',
  styleUrls: ['./quiz-wizard.component.scss'],
})
export class QuizWizardComponent {
  @Output() refreshQuizzes = new EventEmitter<void>();

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;

  public editMode = false; // false => create, true => edit
  public quizId: string | null = null;

  quizForm: QuizFormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private quizService: QuizService,
  ) {
    this.quizForm = this.fb.group({
      // Basic quiz-level fields
      title: ['', [Validators.required, Validators.minLength(4)]],
      // type: ['something'],
      shuffle: [false],
      poolSize: [1, [Validators.required, Validators.min(1)]],
      maxAttempts: [1, [Validators.required, Validators.min(1)]],
      successThreshold: [60, [Validators.required, Validators.min(0)]],
      validationType: this.fb.control<Validation>(
        'standard',
        Validators.required,
      ),
      // Questions is a form array of question groups
      questions: this.fb.array<QuizQuestionFormGroup>([]),
    });
  }

  /* Helpers */
  get questionsArr() {
    return this.quizForm.controls.questions;
  }

  newQuestion(question?: QuizQuestion): QuizQuestionFormGroup {
    // If question is provided, pre-fill
    return this.fb.group({
      title: [question?.title || '', Validators.required, Validators.min(4)],
      description: [question?.description || ''],
      type: this.fb.control<QuestionType>(question?.type || 'checkbox'),
      shuffle: [question?.shuffle || false],
      failureMessage: [question?.failure_message || ''],
      successMessage: [question?.success_message || ''],
      weight: [question?.weight || 1, Validators.min(1)],
      answers: this.fb.array<QuizAnswerFormGroup>([]),
    });
  }

  newAnswer(answer?: QuizAnswer): QuizAnswerFormGroup {
    return this.fb.group({
      title: [answer?.title || '', Validators.required, Validators.min(4)],
      correct: [answer?.correct || false],
    });
  }

  /* Opening the wizard for create vs. edit */
  openForCreate() {
    this.wizard.open();
    // this.opened = true;
    this.editMode = false;
    this.quizId = null;
    this.quizForm.reset({
      title: '',
      // type: 'something',
      shuffle: false,
      poolSize: 1,
      maxAttempts: 1,
      successThreshold: 60,
      validationType: 'standard',
      questions: [],
    });
    // Clear the form arrays
    this.questionsArr.clear();
  }

  openForEdit(quiz: Quiz) {
    // this.opened = true;
    this.wizard.open();
    this.editMode = true;
    this.quizId = quiz.id || null;

    // Populate form
    this.quizForm.patchValue({
      title: quiz.title,
      // type: quiz.type,
      shuffle: quiz.shuffle,
      poolSize: quiz.pool_size,
      maxAttempts: quiz.max_attempts,
      successThreshold: quiz.success_threshold,
      validationType: quiz.validation_type,
    });

    // Clear array, re-add
    this.questionsArr.clear();
    quiz.questions.forEach((q) => {
      const qGroup = this.newQuestion(q);
      // Fill the answers
      const answersCtrl = qGroup.controls.answers;
      answersCtrl.clear();
      q.answers.forEach((ans) => {
        answersCtrl.push(this.newAnswer(ans));
      });
      this.questionsArr.push(qGroup);
    });
  }

  addQuestion() {
    this.questionsArr.push(this.newQuestion());
  }

  removeQuestion(index: number) {
    this.questionsArr.removeAt(index);
  }

  addAnswer(questionIndex: number) {
    const answersArray = this.questionsArr
      .at(questionIndex)
      .get('answers') as FormArray;
    answersArray.push(this.newAnswer());
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const answersArray = this.questionsArr
      .at(questionIndex)
      .get('answers') as FormArray;
    answersArray.removeAt(answerIndex);
  }

  close() {
    this.wizard.close();
    // this.opened = false;
  }

  save() {
    if (!this.quizForm.valid) {
      return;
    }
    // Build final object
    const fgControls = this.quizForm.controls;
    const newQuiz: Quiz = {
      id: this.quizId || undefined,
      title: fgControls.title.value,
      type: 'something', // @TODO ... maybe we don't need this anymore...
      shuffle: fgControls.shuffle.value,
      pool_size: fgControls.poolSize.value,
      max_attempts: fgControls.maxAttempts.value,
      success_threshold: fgControls.successThreshold.value,
      validation_type: fgControls.validationType.value,
      questions: fgControls.questions.controls.map((q) => {
        return {
          title: q.controls.title.value,
          description: q.controls.description.value,
          type: q.controls.type.value,
          shuffle: q.controls.shuffle.value,
          failure_message: q.controls.failureMessage.value,
          success_message: q.controls.successMessage.value,
          weight: q.controls.weight.value,
          answers: q.controls.answers.controls.map((a) => ({
            title: a.controls.title.value,
            correct: a.controls.correct.value,
          })),
        };
      }),
    };

    console.log('New Quiz: ', newQuiz);

    if (!this.editMode) {
      // Create
      this.quizService.create(newQuiz).subscribe({
        next: () => {
          this.close();
          this.refreshQuizzes.emit();
        },
        error: (err) => {
          // handle error
          console.error('Error creating quiz', err);
        },
      });
    } else {
      // Edit
      const id = this.quizId!;
      this.quizService.update(id, newQuiz).subscribe({
        next: () => {
          this.close();
          this.refreshQuizzes.emit();
        },
        error: (err) => {
          // handle error
          console.error('Error updating quiz', err);
        },
      });
    }
  }
}
