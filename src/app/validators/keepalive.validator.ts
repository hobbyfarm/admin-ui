import { AbstractControl } from '@angular/forms';
import { isCourseDetailFormGroup, isScenarioFormGroup } from '../data/forms';

export function KeepaliveValidator(fg: AbstractControl): {
  controlTypeMismatch?: string;
  invalidKeepalivePeriod?: boolean;
} | null {
  if (!isCourseDetailFormGroup(fg) && !isScenarioFormGroup(fg)) {
    return {
      controlTypeMismatch:
        'Expected CourseDetailFormGroup or ScenarioFormGroup',
    };
  }
  const keepalive_amount = fg.controls.keepalive_amount.value;
  const keepalive_unit = fg.controls.keepalive_unit.value;

  if (
    Number.isNaN(keepalive_amount) ||
    (keepalive_unit != 'm' && keepalive_unit != 'h') ||
    keepalive_amount < 1
  ) {
    return { invalidKeepalivePeriod: true };
  }
  return null;
}
