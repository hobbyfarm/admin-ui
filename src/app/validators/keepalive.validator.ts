import { ValidationErrors } from '@angular/forms';
import { CourseDetailFormGroup, ScenarioFormGroup } from '../data/forms';

export function KeepaliveValidator(
  fg: CourseDetailFormGroup | ScenarioFormGroup
): ValidationErrors | null {
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
