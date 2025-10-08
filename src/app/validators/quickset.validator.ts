import { AbstractControl } from '@angular/forms';
import { isQuickSetEndTimeFormGroup } from '../data/forms';

export function QuicksetValidator(fg: AbstractControl): {
  controlTypeMismatch?: string;
  invalidQuicksetAmount?: boolean;
  invalidNumber?: boolean;
} | null {
  if (!isQuickSetEndTimeFormGroup(fg)) {
    return {
      controlTypeMismatch: 'Expected QuickSetEndTimeFormGroup',
    };
  }
  const quickset_endtime = fg.controls.quickset_endtime.value;
  const quickset_unit = fg.controls.quickset_unit.value;

  if (quickset_endtime && quickset_unit) {
    if (quickset_endtime < 1) {
      return { invalidQuicksetAmount: true };
    } else if (!isInt(quickset_endtime)) {
      return { invalidNumber: true };
    }
  }
  return null;

  function isInt(n: number) {
    // Fallback for IE: n % 1 === 0
    return Number.isInteger(n) || n % 1 === 0;
  }
}
