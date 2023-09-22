import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type GenericKeyValueGroup<T extends string | number | boolean> = FormGroup<{
  key: FormControl<string>;
  value: FormControl<T>;
}>;

export type CourseDetailFormGroup = FormGroup<{
  course_name: FormControl<string | null>;
  course_description: FormControl<string | null>;
  keepalive_amount: FormControl<number>;
  keepalive_unit: FormControl<string>;
  pauseable: FormControl<boolean>;
  keep_vm: FormControl<boolean>;
  pause_duration: FormControl<number>;
}>;

export type QuickSetEndTimeFormGroup = FormGroup<{
  quickset_endtime: FormControl<number>;
  quickset_unit: FormControl<'h' | 'd' | 'w' | 'm'>;
}>;

export type ScenarioFormGroup = FormGroup<{
  scenario_name: FormControl<string | null>;
  scenario_description: FormControl<string | null>;
  keepalive_amount: FormControl<number>;
  keepalive_unit: FormControl<string>;
  pause_duration: FormControl<number>;
}>;

export type CategoryFormGroup = FormGroup<{
  category: FormControl<string | null>;
}>;

export type GenericFormControl =
  | FormControl<string>
  | FormControl<number>
  | FormControl<boolean>;

export type GenericFormArray =
  | FormArray<FormControl<string>>
  | FormArray<FormControl<number>>
  | FormArray<FormControl<boolean>>;

export type GenericKeyValueMapArray =
  | FormArray<GenericKeyValueGroup<string>>
  | FormArray<GenericKeyValueGroup<number>>
  | FormArray<GenericKeyValueGroup<boolean>>;
