import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// TODO: Type reactive forms

export enum TypedInputType {
  STRING,
  INTEGER,
  FLOAT,
  BOOLEAN,
  // COLOR or other possible custom input types
}

export enum TypedInputRepresentation {
  SCALAR,
  ARRAY,
  MAP,
}

export enum FormGroupType {
  LIST, // Display all settings in a grouped list
  TABS, // Group form inputs, display groups in horizontal tabs (default)
  TABS_VERTICAL, // Group form inputs, display groups in vertical tabs
}

export class TypedInput {
  id: string; // id as of the metadata.name
  name: string; // Display name of the input
  category: string; // Category e.g. General, Provisioning etc.
  type: TypedInputType;
  representation: TypedInputRepresentation;
  validation: InputValidation;
  value: any;
  weight: number; // Weight of setting in it's category

  constructor(init?: Partial<TypedInput>) {
    Object.assign(this, init);
  }

  isScalarType(): boolean {
    return this.representation === TypedInputRepresentation.SCALAR;
  }

  isMapType(): boolean {
    return this.representation === TypedInputRepresentation.MAP;
  }

  isArrayType(): boolean {
    return this.representation === TypedInputRepresentation.ARRAY;
  }

  isEnum(): boolean {
    return this.validation.enum && this.validation.enum.length > 0;
  }

  isRequired(): boolean {
    return this.validation.required;
  }

  getMinLength(): number {
    return this.validation.minLength;
  }

  getMaxLength(): number {
    return this.validation.maxLength;
  }

  getMinimum(): number {
    return this.validation.minimum;
  }

  getMaximum(): number {
    return this.validation.maximum;
  }

  getTypedInputEnumValues(): any[] {
    if (!this.isEnum()) {
      return [];
    }
    return this.validation.enum.map((v) => {
      return this.parseScalarValue(v);
    });
  }

  // This function returns a form control for the input type.
  // This also adds validators corresponding to the requirements from InputValidation.
  // If the input is an enum, this also checks if the value is valid otherwise will use the default value or the first valid enum value.
  getTypedInputFormControl(value: any) {
    // TODO what is format vs pattern?

    let control: UntypedFormControl | UntypedFormArray;
    value = this.getTypedInputScalarValue(value);

    switch (this.type) {
      case TypedInputType.STRING:
        control = new UntypedFormControl(value);
        break;
      case TypedInputType.FLOAT:
        control = new UntypedFormControl(value, [Validators.required]);
        break;
      case TypedInputType.INTEGER:
        control = new UntypedFormControl(value, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]);
        break;
      case TypedInputType.BOOLEAN:
        control = new UntypedFormControl(value);
        break;
    }

    if (this.isEnum()) {
      // When it's an ENUM type, add a custom validator to check if the value is included in the enum values
      control.setValidators([
        ...(control.validator ? [control.validator] : []), // Preserve the existing validators
        this.enumValueValidator(this.getTypedInputEnumValues()), // Add the custom validator
      ]);
    }

    if (this.validation.required || this.isArrayType()) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.required,
      ]);
    }

    if (this.validation.pattern && this.type === TypedInputType.STRING) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.pattern(this.validation.pattern),
      ]);
    }

    if (this.validation.uniqueItems && this.isArrayType()) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        this.uniqueArrayValueValidator,
      ]);
    }

    if (
      this.getMinLength() != 0 &&
      this.type === TypedInputType.STRING &&
      !this.isArrayType()
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.minLength(this.getMinLength()),
      ]);
    }

    if (
      this.getMaxLength() != 0 &&
      this.type === TypedInputType.STRING &&
      !this.isArrayType()
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.maxLength(this.getMaxLength()),
      ]);
    }

    if (
      this.getMinimum() &&
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT)
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.min(this.getMinimum()),
      ]);
    }

    if (
      this.getMaximum() &&
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT)
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.max(this.getMaximum()),
      ]);
    }

    return control;
  }

  getTypedInputScalarValue(value: any) {
    // Set to default if this is empty
    if (value === '' && this.validation.default) {
      value = this.validation.default;
    }

    // Parse the value
    value = this.parseScalarValue(value);

    // If this is an enum, check that this value is valid
    if (this.isEnum() && !this.getTypedInputEnumValues().includes(value)) {
      value = this.getTypedInputEnumValues()[0]; // otherwise set to first valid enum value
    }

    return value;
  }

  getPlaceholder() {
    if (this.validation.default) {
      return this.validation.default;
    }
    return 'value';
  }

  private parseScalarValue(value: any) {
    switch (this.type) {
      case TypedInputType.BOOLEAN:
        return value;
      case TypedInputType.FLOAT:
        return +value;
      case TypedInputType.INTEGER:
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
          return 0;
        }
        return parsed;
      case TypedInputType.STRING:
        return value;
    }
  }

  private enumValueValidator(enumValues: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return enumValues.includes(this.parseScalarValue(control.value))
        ? null
        : { invalidenumvalue: { value: control.value } };
    };
  }

  uniqueArrayValueValidator(control: AbstractControl): ValidationErrors | null {
    const siblings = (control.parent as UntypedFormArray).controls as UntypedFormControl[];
    const values = siblings.map((sibling) => sibling.value);
    const duplicates = values.filter((v) => v === control.value);
    return duplicates.length > 1 ? { duplicatearrayvalue: true } : null;
  }
}

export class InputValidation {
  required?: boolean;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  format?: string;
  pattern?: string;
  enum?: string[];
  default?: string;
  uniqueItems?: boolean;
}
