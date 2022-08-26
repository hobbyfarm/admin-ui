import { ValidationErrors, FormGroup } from '@angular/forms';

export function KeepaliveValidator(control: FormGroup): ValidationErrors | null {
  var keepalive_amount = control.get("keepalive_amount").value;
  var keepalive_unit = control.get("keepalive_unit").value;

  if (!Number(keepalive_amount)) {
    return { 'invalidKeepalivePeriod': true };
  }
  if (keepalive_amount && keepalive_unit) {
      if (keepalive_amount < 1 ) { 
        return { 'invalidKeepalivePeriod': true };
      }
  }
}