import { ValidationErrors, FormGroup } from '@angular/forms';

export function QuicksetValidator(control: FormGroup): ValidationErrors | null {
    var quickset_endtime = control.get("quickset_endtime").value;
    var quickset_unit = control.get("quickset_unit").value;

    if (quickset_endtime && quickset_unit) {
        if (quickset_endtime < 1) {
            return { 'invalidQuicksetAmount': true };
        } else if (!isInt(quickset_endtime)) {
            return { 'invalidNumber': true };
        }
    }

    function isInt(n: any) {
        // Fallback for IE: n % 1 === 0 
        return Number(n) === n && (Number.isInteger(n) || n % 1 === 0);
    }
}