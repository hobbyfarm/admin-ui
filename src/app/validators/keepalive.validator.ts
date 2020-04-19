import { ValidationErrors, FormGroup } from '@angular/forms';

export function KeepaliveValidator(control: FormGroup): ValidationErrors | null {
  var keepalive_amount = control.get("keepalive_amount").value;
  var keepalive_unit = control.get("keepalive_unit").value;

  if (keepalive_amount && keepalive_unit) {
    if (keepalive_unit == 'm') {
      if (keepalive_amount > 2880 || keepalive_amount < 1) { // 48 hours
        return { 'invalidKeepalivePeriod': true };
      }
    } else if (keepalive_unit == 'h') {
      if (keepalive_amount > 48) {
        return { 'invalidKeepalivePeriod': true };
      }
    }
  }
}