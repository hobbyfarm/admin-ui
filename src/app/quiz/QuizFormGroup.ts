import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Validation } from './Validation';

export type QuizCheckboxFormGroup = FormGroup<{
  quiz: FormArray<FormControl<boolean>>;
}>;

export type QuizRadioFormGroup = FormGroup<{
  quiz: FormControl<number | null>;
}>;

export type QuizAnswerFormGroup = FormGroup<{
  title: FormControl<string>;
  correct: FormControl<boolean>;
}>

export type QuizQuestionFormGroup = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  type: FormControl<'checkbox' | 'radio'>;
  shuffle: FormControl<boolean>;
  failureMessage: FormControl<string>;
  successMessage: FormControl<string>;
  weight: FormControl<number>;
  answers: FormArray<QuizAnswerFormGroup>;
}>

export type QuizFormGroup = FormGroup<{
  title: FormControl<string>;
  // type: FormControl<string>;
  shuffle: FormControl<boolean>;
  poolSize: FormControl<number>;
  maxAttempts: FormControl<number>;
  successThreshold: FormControl<number>;
  validationType: FormControl<Validation>;
  questions: FormArray<QuizQuestionFormGroup>
}>;
