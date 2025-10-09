import { FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { GenericKeyValueGroup } from '../data/forms';

export function UniqueKeyValidator(
  control: FormControl<string>,
): ValidationErrors | null {
  type ParentGroup =
    | GenericKeyValueGroup<string>
    | GenericKeyValueGroup<number>
    | GenericKeyValueGroup<boolean>;
  type ParentArray = FormArray<ParentGroup>;
  const parent: ParentGroup = control.parent as ParentGroup;
  if (!parent) return null;
  const key = control.value;
  const siblings: ParentGroup[] = (parent.parent as ParentArray).controls;
  const keys = siblings.map((sibling) => sibling.controls.key.value);
  const duplicates = keys.filter((k) => k === key);
  return duplicates.length > 1 ? { duplicate: true } : null;
}
