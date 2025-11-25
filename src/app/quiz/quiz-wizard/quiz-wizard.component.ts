import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  signal,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ClrDatagridSortOrder, ClrWizard } from '@clr/angular';
import { finalize, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import {
  QuizService,
  Quiz,
  QuizQuestion,
  QuizAnswer,
} from '../../data/quiz.service';
import { Validation } from '../Validation';
import { QuestionType } from '../QuestionType';
import { AnswerFG, QuestionFG, QuizFG } from '../QuizFormGroup';
import { AlertComponent } from 'src/app/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';

type QuestionBackup = ReturnType<QuestionFG['getRawValue']>;

@Component({
  selector: 'app-quiz-wizard',
  templateUrl: './quiz-wizard.component.html',
  styleUrls: ['./quiz-wizard.component.scss'],
})
export class QuizWizardComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('wiz', { static: false }) wiz!: ClrWizard;
  @ViewChild('alertCmp') alert!: AlertComponent;

  @Input() createTrigger = 0;
  @Input() editTrigger = 0;
  @Input() quizToEdit: Quiz | null = null;

  @Output() saved = new EventEmitter<{ id: string; quiz: Quiz }>();

  mode: 'create' | 'edit' = 'create';
  isOpen = false;

  form!: QuizFG;
  loading = signal(false);
  saving = signal(false);

  sortByWeight = ClrDatagridSortOrder.ASC;
  editIdx: number | null = null;
  questionModalOpen = false;

  quizQuestions: { key: string; ctrl: QuestionFG }[] = [];
  questionAnswers: { key: string }[] = [];
  private questionBackup: QuestionBackup | null = null;

  issuerSub?: Subscription;
  issuerCache = '';

  /** Dragula bag names */
  QUESTIONS_BAG = 'quiz-questions';
  ANSWERS_BAG = 'quiz-answers';

  private subs = new Subscription();

  constructor(
    private fb: NonNullableFormBuilder,
    private qs: QuizService,
    private dragula: DragulaService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: this.fb.control('', { validators: [Validators.required] }),
      issue_certificates: this.fb.control(false),
      issuer: this.fb.control('', { validators: [this.validateIssuer()] }),
      shuffle: this.fb.control(false),
      pool_size: this.fb.control(1, { validators: [Validators.min(1)] }),
      max_attempts: this.fb.control(1, { validators: [Validators.min(1)] }),
      success_threshold: this.fb.control(80, {
        validators: [Validators.min(0), Validators.max(100)],
      }),
      validation_type: this.fb.control<Validation>('standard'),
      questions: this.fb.array<QuestionFG>([]),
    });

    this.issuerSub =
      this.form.controls.issue_certificates.valueChanges.subscribe((val) => {
        if (!val) {
          this.issuerCache = this.form.controls.issuer.value;
          this.form.controls.issuer.patchValue('', { emitEvent: false });
        } else {
          this.form.controls.issuer.patchValue(this.issuerCache, {
            emitEvent: false,
          });
          this.issuerCache = '';
        }
      });

    this.addQuestion(); // per default ... creating a question to prevent empty quiz
    this.rebuildQuestions();

    // --- Dragula group setup ---
    this.createOrResetGroup(this.QUESTIONS_BAG, {
      moves: (_el: Element, _cont: Element, handle?: Element) =>
        !!handle && handle.classList.contains('handle'),
    });

    this.createOrResetGroup(this.ANSWERS_BAG, {
      moves: (_el: Element, _cont: Element, handle?: Element) =>
        !!handle && handle.classList.contains('handle'),
    });

    // Reorder FormArray after a drop for questions
    this.subs.add(
      this.dragula.drop(this.QUESTIONS_BAG).subscribe(() => {
        this.applyQuizQuestionsOrderToFormArray();
      }),
    );

    // Reorder answers for the current question after a drop
    this.subs.add(
      this.dragula.drop(this.ANSWERS_BAG).subscribe(() => {
        if (this.editIdx === null) return;
        this.applyQuestionAnswersOrderToFormArray(this.editIdx);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.issuerSub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['createTrigger'] && !changes['createTrigger'].firstChange) {
      this.openForCreate();
    }
    if (changes['editTrigger'] && !changes['editTrigger'].firstChange) {
      if (this.quizToEdit) this.openForEdit(this.quizToEdit);
    }
  }

  private validateIssuer(): ValidatorFn {
    return (issuerControl: AbstractControl) => {
      const quizForm = issuerControl.parent as QuizFG | null;
      if (!quizForm) return null;
      if (quizForm.controls.issue_certificates.value && !issuerControl.value) {
        return {
          required: true,
        };
      }
      return null;
    };
  }

  openForCreate(): void {
    this.mode = 'create';
    this.quizToEdit = null;
    this.resetFormForCreate();
    this.isOpen = true;
    this.wiz?.reset();
  }

  openForEdit(quiz: Quiz): void {
    this.mode = 'edit';
    this.quizToEdit = quiz;
    this.patchFormForEdit(quiz);
    this.isOpen = true;
    this.wiz?.reset();
  }

  close(): void {
    this.isOpen = false;
    this.editIdx = null;
    this.questionModalOpen = false;
    this.questionAnswers = [];
  }

  // ---------- accessors ----------
  get questionsFA(): FormArray<QuestionFG> {
    return this.form.get('questions') as FormArray<QuestionFG>;
  }
  answersFA(qIdx: number): FormArray<AnswerFG> {
    return this.questionsFA.at(qIdx).get('answers') as FormArray<AnswerFG>;
  }
  trackByIndex = (i: number) => i;

  // ---------- builders ----------
  private newAnswer(): AnswerFG {
    return this.fb.group({
      title: this.fb.control('', { validators: [Validators.required] }),
      correct: this.fb.control(false),
    });
  }
  private newQuestion(): QuestionFG {
    return this.fb.group({
      title: this.fb.control('', { validators: [Validators.required] }),
      description: this.fb.control(''),
      type: this.fb.control<QuestionType>('checkbox'),
      shuffle: this.fb.control(false),
      failure_message: this.fb.control(''),
      success_message: this.fb.control(''),
      // enforcing 1 to 1000 here
      weight: this.fb.control(1, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(1000),
        ],
      }),
      answers: this.fb.array<AnswerFG>([this.newAnswer(), this.newAnswer()]),
    });
  }

  private resetFormForCreate(): void {
    this.form.reset({
      title: '',
      issuer: '',
      shuffle: false,
      pool_size: 1,
      max_attempts: 1,
      success_threshold: 80,
      validation_type: 'standard' as Validation,
    });

    while (this.questionsFA.length) this.questionsFA.removeAt(0);
    this.addQuestion();
    this.rebuildQuestions();
  }

  private patchFormForEdit(q: Quiz): void {
    this.form.patchValue({
      title: q.title ?? '',
      issue_certificates: !!q.issuer,
      issuer: q.issuer ?? '',
      shuffle: !!q.shuffle,
      pool_size: q.pool_size ?? 1,
      max_attempts: q.max_attempts ?? 1,
      success_threshold: q.success_threshold ?? 80,
      validation_type: q.validation_type ?? 'standard',
    });

    while (this.questionsFA.length) this.questionsFA.removeAt(0);

    (q.questions || []).forEach((qq: QuizQuestion) => {
      const fg = this.newQuestion();
      fg.patchValue({
        title: qq.title ?? '',
        description: qq.description ?? '',
        type: qq.type ?? 'checkbox',
        shuffle: !!qq.shuffle,
        failure_message: qq.failure_message ?? '',
        success_message: qq.success_message ?? '',
        weight: Math.max(1, Math.min(1000, Number(qq.weight ?? 1))),
      });
      const answersFA = fg.get('answers') as FormArray<AnswerFG>;
      while (answersFA.length) answersFA.removeAt(0);
      (qq.answers || []).forEach((a: QuizAnswer) =>
        answersFA.push(
          this.fb.group({
            title: this.fb.control(a.title ?? ''),
            correct: this.fb.control(!!a.correct),
          }),
        ),
      );
      this.questionsFA.push(fg);
    });

    if (this.questionsFA.length === 0) this.addQuestion();
    this.rebuildQuestions();
  }

  // ---------- Drag helpers ----------
  private rebuildQuestions(): void {
    this.quizQuestions = this.questionsFA.controls.map((ctrl, i) => ({
      key: `q-${i}-${Math.random().toString(36).slice(2, 6)}`,
      ctrl,
    }));
  }

  private rebuildAnswers(qIdx: number): void {
    const len = this.answersFA(qIdx).length;
    this.questionAnswers = Array.from({ length: len }, (_, i) => ({
      key: `a-${i}-${Math.random().toString(36).slice(2, 6)}`,
    }));
  }

  /** Rebuild questions FormArray in the order reflected by quizQuestions */
  private applyQuizQuestionsOrderToFormArray(): void {
    const orderedCtrls = this.quizQuestions.map((v) => v.ctrl);
    this.questionsFA.clear({ emitEvent: false });
    for (const c of orderedCtrls)
      this.questionsFA.push(c, { emitEvent: false });
  }

  private applyQuestionAnswersOrderToFormArray(qIdx: number): void {
    const fa = this.answersFA(qIdx);
    const ctrls = fa.controls.slice();
    fa.clear({ emitEvent: false });
    for (const c of ctrls) fa.push(c, { emitEvent: false });
  }

  private createOrResetGroup(
    name: string,
    options: Readonly<Record<string, unknown>>,
  ): void {
    const existing = this.dragula.find(name);
    if (existing) this.dragula.destroy(name);
    this.dragula.createGroup(name, options);
  }

  // ---------- actions ----------
  addQuestion(): void {
    this.questionsFA.push(this.newQuestion());
    this.rebuildQuestions();
  }

  removeQuestion(i: number): void {
    this.questionsFA.removeAt(i);
    this.rebuildQuestions();
    if (this.editIdx === i) this.closeQuestionModal();
  }

  openQuestionModal(i: number): void {
    this.editIdx = i;
    this.rebuildAnswers(i);

    const fg = this.questionsFA.at(i);
    this.questionBackup = fg.getRawValue();

    this.questionModalOpen = true;
  }

  closeQuestionModal(): void {
    this.editIdx = null;
    this.questionAnswers = [];
    this.questionModalOpen = false;
    this.questionBackup = null;
  }

  cancelQuestionModal(): void {
    if (this.editIdx !== null && this.questionBackup) {
      const fg = this.questionsFA.at(this.editIdx);
      fg.reset(this.questionBackup);
    }

    this.editIdx = null;
    this.questionAnswers = [];
    this.questionModalOpen = false;
    this.questionBackup = null;
  }

  addAnswer(qIdx: number): void {
    this.answersFA(qIdx).push(this.newAnswer());
    if (this.editIdx === qIdx) this.rebuildAnswers(qIdx);
  }
  removeAnswer(qIdx: number, aIdx: number): void {
    this.answersFA(qIdx).removeAt(aIdx);
    if (this.editIdx === qIdx) this.rebuildAnswers(qIdx);
  }

  // ---------- save ----------
  private extractId(src: unknown): string | null {
    if (src && typeof src === 'object') {
      const obj = src as Record<string, unknown>;
      if (typeof obj['id'] === 'string') return obj['id'];
      const meta = obj['metadata'] as Record<string, unknown> | undefined;
      if (meta && typeof meta['name'] === 'string') return meta['name'];
      if (typeof obj['name'] === 'string') return obj['name'];
    }
    return null;
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert?.warning(
        'Please check the form – some fields are invalid.',
        true,
        5000,
      );

      return;
    }
    this.saving.set(true);

    const payload: Quiz = {
      title: this.form.value.title!,
      issuer: this.form.value.issuer!,
      shuffle: this.form.value.shuffle!,
      pool_size: this.form.value.pool_size!,
      max_attempts: this.form.value.max_attempts!,
      success_threshold: this.form.value.success_threshold!,
      validation_type: this.form.value.validation_type!,
      questions: (this.form.value.questions || []).map((q) => ({
        title: q!.title!,
        description: q!.description!,
        type: q!.type!,
        shuffle: q!.shuffle!,
        failure_message: q!.failure_message!,
        success_message: q!.success_message!,
        weight: q!.weight!,
        answers: (q!.answers || []).map((a) => ({
          title: a!.title!,
          correct: a!.correct!,
        })),
      })),
    };

    if (this.mode === 'create') {
      this.qs
        .create(payload)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (id: string) => {
            this.alert?.success('Quiz created successfully.', true, 5000);
            this.saved.emit({ id, quiz: payload });
            this.close();
          },
          error: (err) => {
            const msg = this.getServerMessage(err) ?? 'Failed to create quiz.';
            this.alert?.danger(msg, true);
          },
        });
    } else {
      const id = this.extractId(this.quizToEdit);
      if (!id) {
        this.saving.set(false);
        this.alert?.danger('Could not determine quiz ID for update.', true);
        return;
      }
      this.qs
        .update(id, payload)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => {
            this.alert?.success('Quiz updated successfully.', true, 5000);
            this.saved.emit({ id, quiz: payload });
            this.close();
          },
          error: (err) => {
            const msg = this.getServerMessage(err) ?? 'Failed to update quiz.';
            this.alert?.danger(msg, true);
          },
        });
    }
  }
  private getServerMessage(
    error: HttpErrorResponse | string | null | undefined,
  ): string | null {
    if (!error) return null;

    if (typeof error === 'string') return error;

    const inner = error.error;

    if (typeof inner === 'string') {
      return inner;
    }

    if (inner && typeof inner === 'object') {
      const maybeMessage = (inner as { message?: unknown }).message;
      if (typeof maybeMessage === 'string') {
        return maybeMessage;
      }
    }

    if (typeof error.message === 'string') {
      return error.message;
    }

    return null;
  }
}
