import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ProgressViewMode } from './ProgressViewMode';

export type ChartDetailsFormGroup = FormGroup<{
  observationPeriod: FormControl<'daily' | 'weekly' | 'monthly'>;
  scenarios: FormControl<string[]>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
}>;

export type GenericKeyValueGroup<T extends string | number | boolean> =
  FormGroup<{
    key: FormControl<string>;
    value: FormControl<T>;
  }>;

export type CourseDetailFormGroup = FormGroup<{
  course_name: FormControl<string>;
  course_description: FormControl<string>;
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
  scenario_name: FormControl<string>;
  scenario_description: FormControl<string>;
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

export type SettingFormGroup = FormGroup<{
  terminal_theme: FormControl<
    | 'default'
    | 'Solarized_Light'
    | 'Solarized_Dark'
    | 'Solarized_Dark_Higher_Contrast'
    | 'GitHub'
    | 'Dichromatic'
  >;
  hide_usernames_status: FormControl<boolean>;
  theme: FormControl<'dark' | 'light' | 'system'>;
  progress_view_mode: FormControl<ProgressViewMode>;
  currency_symbol: FormControl<string>;
}>;

// This object type maps VMTemplate names to the number of requested VMs
// The key specifies the template name
// The FormControl holds the number of requested VMs
export type VmTemplateMappings = { [key: string]: FormControl<number> };

// This type holds (multiple) VMTemplateMappings within a FormGroup.
export type VmTemplatesFormGroup = FormGroup<VmTemplateMappings>;

// This type maps Environment names to the VMTemplateMappings of the respective environment wrapped in a FormGroup
// The key specifies the environment name
// The VMTemplatesFormGroup holds the VMTemplateMappings of the respective environment
export type EnvToVmTemplatesMappings = { [key: string]: VmTemplatesFormGroup };

// This type holds all Environment to VMTemplates mappings
export type VmCountFormGroup = FormGroup<EnvToVmTemplatesMappings>;

function isFormControlNumberArray(
  controls: AbstractControl[],
): controls is FormControl<number>[] {
  return controls.every(
    (ctrl) => ctrl instanceof FormControl && typeof ctrl.value === 'number',
  );
}

// check if an AbstractControl is of type FormArray<FormControl<number>>
export function isFormArrayOfNumbers(
  control: AbstractControl,
): control is FormArray<FormControl<number>> {
  return (
    control instanceof FormArray && isFormControlNumberArray(control.controls)
  );
}

export function isVmTemplatesFormGroup(
  control: AbstractControl,
): control is VmTemplatesFormGroup {
  return (
    control instanceof FormGroup &&
    isFormControlNumberArray(Object.values(control.controls))
  );
}

export function isVmCountFormGroup(
  control: AbstractControl,
): control is VmCountFormGroup {
  return (
    control instanceof FormGroup &&
    Object.values(control.controls).every((vmTemplatesFormGroup) =>
      isVmTemplatesFormGroup(vmTemplatesFormGroup),
    )
  );
}

export function isQuickSetEndTimeFormGroup(
  control: AbstractControl,
): control is QuickSetEndTimeFormGroup {
  return (
    control instanceof FormGroup &&
    control.controls.quickset_endtime instanceof FormControl &&
    typeof control.controls.quickset_endtime.value === 'number' &&
    control.controls.quickset_unit instanceof FormControl &&
    ['h', 'd', 'w', 'm'].includes(control.controls.quickset_unit.value)
  );
}

export function isCourseDetailFormGroup(
  formGroup: AbstractControl,
): formGroup is CourseDetailFormGroup {
  return (
    formGroup instanceof FormGroup &&
    formGroup.controls.course_name instanceof FormControl &&
    (typeof formGroup.controls.course_name.value === 'string' ||
      formGroup.controls.course_name.value === null) &&
    formGroup.controls.course_description instanceof FormControl &&
    (typeof formGroup.controls.course_description.value === 'string' ||
      formGroup.controls.course_description.value === null) &&
    formGroup.controls.keepalive_amount instanceof FormControl &&
    typeof formGroup.controls.keepalive_amount.value === 'number' &&
    formGroup.controls.keepalive_unit instanceof FormControl &&
    typeof formGroup.controls.keepalive_unit.value === 'string' &&
    formGroup.controls.pauseable instanceof FormControl &&
    typeof formGroup.controls.pauseable.value === 'boolean' &&
    formGroup.controls.keep_vm instanceof FormControl &&
    typeof formGroup.controls.keep_vm.value === 'boolean' &&
    formGroup.controls.pause_duration instanceof FormControl &&
    typeof formGroup.controls.pause_duration.value === 'number'
  );
}

export function isScenarioFormGroup(
  formGroup: AbstractControl,
): formGroup is ScenarioFormGroup {
  return (
    formGroup instanceof FormGroup &&
    formGroup.controls.scenario_name instanceof FormControl &&
    (typeof formGroup.controls.scenario_name.value === 'string' ||
      formGroup.controls.scenario_name.value === null) &&
    formGroup.controls.scenario_description instanceof FormControl &&
    (typeof formGroup.controls.scenario_description.value === 'string' ||
      formGroup.controls.scenario_description.value === null) &&
    formGroup.controls.keepalive_amount instanceof FormControl &&
    typeof formGroup.controls.keepalive_amount.value === 'number' &&
    formGroup.controls.keepalive_unit instanceof FormControl &&
    typeof formGroup.controls.keepalive_unit.value === 'string' &&
    formGroup.controls.pause_duration instanceof FormControl &&
    typeof formGroup.controls.pause_duration.value === 'number'
  );
}

export function isChartDetailsFormGroup(
  formGroup: AbstractControl,
): formGroup is ChartDetailsFormGroup {
  return (
    formGroup instanceof FormGroup &&
    formGroup.controls.observationPeriod instanceof FormControl &&
    ['daily', 'weekly', 'monthly'].includes(
      formGroup.controls.observationPeriod.value,
    ) &&
    formGroup.controls.scenarios instanceof FormControl &&
    Array.isArray(formGroup.controls.scenarios.value) &&
    formGroup.controls.scenarios.value.every(
      (item) => typeof item === 'string',
    ) &&
    formGroup.controls.startDate instanceof FormControl &&
    typeof formGroup.controls.startDate.value === 'string' &&
    formGroup.controls.endDate instanceof FormControl &&
    typeof formGroup.controls.endDate.value === 'string'
  );
}

export function isGenericFormControl(
  control: AbstractControl,
): control is GenericFormControl {
  return (
    control instanceof FormControl &&
    (typeof control.value === 'string' ||
      typeof control.value === 'number' ||
      typeof control.value === 'boolean')
  );
}

export function isGenericFormArray(control: any): control is GenericFormArray {
  return (
    control instanceof FormArray &&
    control.controls.every(
      (ctrl) =>
        ctrl instanceof FormControl &&
        (typeof ctrl.value === 'string' ||
          typeof ctrl.value === 'number' ||
          typeof ctrl.value === 'boolean'),
    )
  );
}
