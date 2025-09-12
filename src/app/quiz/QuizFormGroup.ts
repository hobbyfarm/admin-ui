import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Validation } from './Validation';
import { QuestionType } from './QuestionType';

export type QuizCheckboxFormGroup = FormGroup<{
  quiz: FormArray<FormControl<boolean>>;
}>;

export type QuizRadioFormGroup = FormGroup<{
  quiz: FormControl<number | null>;
}>;

export type AnswerFG = FormGroup<{
  title: FormControl<string>;
  correct: FormControl<boolean>;
}>

export type QuestionFG = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  type: FormControl<QuestionType>;
  shuffle: FormControl<boolean>;
  failure_message: FormControl<string>;
  success_message: FormControl<string>;
  weight: FormControl<number>;
  answers: FormArray<AnswerFG>;
}>

export type QuizFG = FormGroup<{
  title: FormControl<string>;
  issue_certificates: FormControl<boolean>;
  issuer: FormControl<string>;
  shuffle: FormControl<boolean>;
  pool_size: FormControl<number>;
  max_attempts: FormControl<number>;
  success_threshold: FormControl<number>;
  validation_type: FormControl<Validation>;
  questions: FormArray<QuestionFG>;
}>;
