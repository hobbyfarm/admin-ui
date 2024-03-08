import { ValidationErrors } from '@angular/forms';
import { QuickSetEndTimeFormGroup } from '../data/forms';

export function QuicksetValidator(fg: QuickSetEndTimeFormGroup): ValidationErrors | null {
    const quickset_endtime = fg.controls.quickset_endtime.value;
    const quickset_unit = fg.controls.quickset_unit.value;

    if (quickset_endtime && quickset_unit) {
        if (quickset_endtime < 1) {
            return { 'invalidQuicksetAmount': true };
        } else if (!isInt(quickset_endtime)) {
            return { 'invalidNumber': true };
        }
    }
    return null;

    function isInt(n: number) {
        // Fallback for IE: n % 1 === 0
        return (Number.isInteger(n) || n % 1 === 0);
    }
}