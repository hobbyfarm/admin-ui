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
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ClrDatagridSortOrder, ClrWizard } from '@clr/angular';
import { finalize, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { QuizService, Quiz, QuizQuestion, QuizAnswer } from '../../data/quiz.service';
import { Validation } from '../Validation';
import { QuestionType } from '../QuestionType';

type AnswerFG = FormGroup<{
  title: FormControl<string>;
  correct: FormControl<boolean>;
}>;

type QuestionFG = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  type: FormControl<QuestionType>;
  shuffle: FormControl<boolean>;
  failure_message: FormControl<string>;
  success_message: FormControl<string>;
  weight: FormControl<number>;
  answers: FormArray<AnswerFG>;
}>;

type QuizFG = FormGroup<{
  title: FormControl<string>;
  type: FormControl<string>;
  shuffle: FormControl<boolean>;
  pool_size: FormControl<number>;
  max_attempts: FormControl<number>;
  success_threshold: FormControl<number>;
  validation_type: FormControl<Validation>;
  questions: FormArray<QuestionFG>;
}>;

@Component({
  selector: 'app-quiz-wizard',
  templateUrl: './quiz-wizard.component.html',
  styleUrls: ['./quiz-wizard.component.scss'],
})
export class QuizWizardComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('wiz', { static: false }) wiz!: ClrWizard;

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

  /** Dragula bag names */
  QUESTIONS_BAG = 'quiz-questions';
  ANSWERS_BAG = 'quiz-answers';

  private subs = new Subscription();

  constructor(
    private fb: NonNullableFormBuilder,
    private qs: QuizService,
    private dragula: DragulaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: this.fb.control('', { validators: [Validators.required] }),
      type: this.fb.control('default'),
      shuffle: this.fb.control(false),
      pool_size: this.fb.control(1, { validators: [Validators.min(1)] }),
      max_attempts: this.fb.control(1, { validators: [Validators.min(1)] }),
      success_threshold: this.fb.control(80, {
        validators: [Validators.min(0), Validators.max(100)],
      }),
      validation_type: this.fb.control<Validation>('standard'),
      questions: this.fb.array<QuestionFG>([]),
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
      })
    );

    // Reorder answers for the current question after a drop
    this.subs.add(
      this.dragula.drop(this.ANSWERS_BAG).subscribe(() => {
        if (this.editIdx === null) return;
        this.applyQuestionAnswersOrderToFormArray(this.editIdx);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['createTrigger'] && !changes['createTrigger'].firstChange) {
      this.openForCreate();
    }
    if (changes['editTrigger'] && !changes['editTrigger'].firstChange) {
      if (this.quizToEdit) this.openForEdit(this.quizToEdit);
    }
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
        validators: [Validators.required, Validators.min(1), Validators.max(1000)],
      }),
      answers: this.fb.array<AnswerFG>([this.newAnswer(), this.newAnswer()]),
    });
  }

  private resetFormForCreate(): void {
    this.form.reset({
      title: '',
      type: 'default',
      shuffle: false,
      pool_size: 0,
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
      type: q.type ?? 'default',
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
          })
        )
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
    const orderedCtrls = this.quizQuestions.map(v => v.ctrl);
    this.questionsFA.clear({ emitEvent: false });
    for (const c of orderedCtrls) this.questionsFA.push(c, { emitEvent: false });
  }

  private applyQuestionAnswersOrderToFormArray(qIdx: number): void {
    const fa = this.answersFA(qIdx);
    const ctrls = fa.controls.slice();
    fa.clear({ emitEvent: false });
    for (const c of ctrls) fa.push(c, { emitEvent: false });
  }

  private createOrResetGroup(name: string, options: any): void {
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
    this.questionModalOpen = true;
  }
  closeQuestionModal(): void {
    this.editIdx = null;
    this.questionAnswers = [];
    this.questionModalOpen = false;
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
  async save(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);

    const payload: Quiz = {
      title: this.form.value.title!,
      type: this.form.value.type!,
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
      this.qs.create(payload as any)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe((id: string) => {
          this.saved.emit({ id, quiz: payload });
          this.close();
        });
    } else {
      const id =
        (this.quizToEdit as any)?.id ||
        (this.quizToEdit as any)?.metadata?.name ||
        (this.quizToEdit as any)?.name;
      this.qs.update(id, payload as any)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe(() => {
          this.saved.emit({ id, quiz: payload });
          this.close();
        });
    }
  }
}
