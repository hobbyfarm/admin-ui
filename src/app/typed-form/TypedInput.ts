import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  GenericFormArray,
  GenericFormControl,
  GenericKeyValueGroup,
  GenericKeyValueMapArray,
  isGenericFormArray,
} from '../data/forms';
import { UniqueKeyValidator } from '../validators/uniquekey.validator';

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

type SettingsValueType =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | { [key: string]: string }
  | { [key: string]: number }
  | { [key: string]: boolean };

export class TypedInput {
  id: string; // id as of the metadata.name
  name: string; // Display name of the input
  category: string; // Category e.g. General, Provisioning etc.
  type: TypedInputType;
  representation: TypedInputRepresentation;
  validation: InputValidation;
  value: SettingsValueType;
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
    return (this.validation.enum && this.validation.enum.length > 0) ?? false;
  }

  isRequired(): boolean {
    return this.validation.required ?? false;
  }

  getMinLength(): number | undefined {
    return this.validation.minLength;
  }

  getMaxLength(): number | undefined {
    return this.validation.maxLength;
  }

  getMinimum(): number | undefined {
    return this.validation.minimum;
  }

  getMaximum(): number | undefined {
    return this.validation.maximum;
  }

  getTypedInputEnumValues() {
    const enumArray = this.validation.enum;
    if (!enumArray || enumArray.length <= 0) {
      return [];
    }
    return enumArray.map((v) => {
      return this.parseScalarValue(v);
    });
  }

  // This function returns a form control for the input type.
  // This also adds validators corresponding to the requirements from InputValidation.
  // If the input is an enum, this also checks if the value is valid otherwise will use the default value or the first valid enum value.
  getTypedInputFormControl(value: string): FormControl<string>;
  getTypedInputFormControl(value: number): FormControl<number>;
  getTypedInputFormControl(value: boolean): FormControl<boolean>;
  getTypedInputFormControl(
    value: string | number | boolean,
  ): GenericFormControl;
  getTypedInputFormControl(value: string | number | boolean) {
    // TODO what is format vs pattern?

    let control: GenericFormControl;
    const parsedValue = this.getTypedInputScalarValue(value);

    switch (typeof parsedValue) {
      case 'string':
        control = new FormControl<string>(parsedValue, { nonNullable: true });
        break;
      case 'number':
        control = new FormControl<number>(parsedValue, {
          validators: [Validators.required],
          nonNullable: true,
        });
        if (this.type === TypedInputType.INTEGER) {
          control.setValidators([
            ...(control.validator ? [control.validator] : []),
            Validators.pattern('^[0-9]*$'),
          ]);
        }
        break;
      case 'boolean':
        control = new FormControl<boolean>(parsedValue, { nonNullable: true });
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

    const minLength = this.getMinLength();
    if (
      minLength &&
      minLength != 0 &&
      this.type === TypedInputType.STRING &&
      !this.isArrayType()
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.minLength(minLength),
      ]);
    }

    const maxLength = this.getMaxLength();
    if (
      maxLength &&
      maxLength != 0 &&
      this.type === TypedInputType.STRING &&
      !this.isArrayType()
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.maxLength(maxLength),
      ]);
    }

    const minVal = this.getMinimum();
    if (
      minVal &&
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT)
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.min(minVal),
      ]);
    }

    const maxVal = this.getMaximum();
    if (
      maxVal &&
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT)
    ) {
      control.setValidators([
        ...(control.validator ? [control.validator] : []),
        Validators.max(maxVal),
      ]);
    }

    return control;
  }

  /**
   * Generic function to retrieve the FormControl representation for arrays
   * @param value accepts only the specific array types string[], number[] or boolean[]. Union types are not permitted.
   * @returns FormArray<FormControl<string>>, FormArray<FormControl<number>> or FormArray<FormControl<boolean>>
   */
  getTypedInputFormArray<T extends string | number | boolean>(value: T[]) {
    // Using the generic constraint T extends string | number | boolean ensures,
    // that T can be either string, number, or boolean, but not a mix of them.
    // Thus, when mapping over value of type T[], each item is consistently of type T.
    // Although TypeScript infers the return type of the map as (FormControl<string> | FormControl<number> | FormControl<boolean>)[],
    // this is overly conservative due to the potential values of T.
    // In reality, given our constraints on T, the result is always FormControl<T>[].
    // The type assertion corrects this inference.
    const controls = value.map((val: T) =>
      this.getTypedInputFormControl(val),
    ) as FormControl<T>[];
    return new FormArray<FormControl<T>>(controls);
  }

  /**
   * Generic function to retrieve the FormControl representation for maps
   * @param value accepts only the specific map, e.g. { [key: string]: string }. Union types are not permitted.
   * @returns FormArray<GenericKeyValueGroup<string>>, FormArray<GenericKeyValueGroup<number>> or FormArray<GenericKeyValueGroup<boolean>>
   */
  getTypedInputMap<T extends string | number | boolean>(value: {
    [key: string]: T;
  }) {
    const mapControls: GenericKeyValueGroup<T>[] = [];
    if (value) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const mapControl = new FormGroup({
            key: new FormControl<string>(key, {
              validators: [Validators.required, UniqueKeyValidator],
              nonNullable: true,
            }),
            value: this.getTypedInputFormControl(value[key]) as FormControl<T>,
          });
          mapControls.push(mapControl);
        }
      }
    }
    return new FormArray<GenericKeyValueGroup<T>>(mapControls);
  }

  getTypedInputScalarValue(value: string | number | boolean) {
    // Set to default if this is empty
    if (value === '' && this.validation.default) {
      value = this.validation.default;
    }

    // Parse the value
    // let parsedValue = this.parseScalarValue(value);

    // If this is an enum, check that this value is valid
    if (this.isEnum() && !this.getTypedInputEnumValues().includes(value)) {
      value = this.getTypedInputEnumValues()[0]; // otherwise set to first valid enum value
    }

    return value;
  }

  getTypedInputRawArray<T extends string | number | boolean>(
    fa: FormArray<FormControl<T>>,
  ) {
    return fa.controls.map(
      (control: FormControl<T>) =>
        this.getTypedInputScalarValue(control.value) as T,
    );
  }

  getTypedInputRawMap<T extends string | number | boolean>(
    fa: FormArray<GenericKeyValueGroup<T>>,
  ) {
    const result: { [key: string]: T } = {};
    fa.controls.forEach((group: GenericKeyValueGroup<T>) => {
      const key = group.controls['key'].value;
      const value: T = this.getTypedInputScalarValue(
        group.controls['value'].value,
      ) as T;
      result[key] = value;
    });
    return result;
  }

  getPlaceholder() {
    if (this.validation.default) {
      return this.validation.default;
    }
    return 'value';
  }

  parseScalarValue(value: string): string | number | boolean {
    switch (this.type) {
      case TypedInputType.BOOLEAN:
        const parsedBool = /^true$/i.test(value);
        return parsedBool;
      case TypedInputType.FLOAT:
        const parsedFloat = +value;
        if (isNaN(parsedFloat)) {
          return 0.0;
        }
        return parsedFloat;
      case TypedInputType.INTEGER:
        const parsedInt = parseInt(value, 10);
        if (isNaN(parsedInt)) {
          return 0;
        }
        return parsedInt;
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
    const parent = control.parent;
    if (!isGenericFormArray(parent)) {
      return {
        controlTypeMismatch:
          'Expected control.parent to be of type GenericFormArray',
      };
    }
    const siblings = parent.controls;
    const values = siblings.map(
      (
        sibling:
          | FormControl<string>
          | FormControl<number>
          | FormControl<boolean>,
      ) => sibling.value,
    );
    const duplicates = values.filter((v) => v === control.value);
    return duplicates.length > 1 ? { duplicatearrayvalue: true } : null;
  }

  isScalar(_value: SettingsValueType): _value is string | boolean | number {
    return this.isScalarType();
  }
  isString(_value: SettingsValueType): _value is string {
    return this.type === TypedInputType.STRING && this.isScalarType();
  }
  isBoolean(_value: SettingsValueType): _value is boolean {
    return this.type === TypedInputType.BOOLEAN && this.isScalarType();
  }
  isNumber(_value: SettingsValueType): _value is number {
    return (
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT) &&
      this.isScalarType()
    );
  }
  isArray(
    _value: SettingsValueType,
  ): _value is string[] | number[] | boolean[] {
    return this.isArrayType();
  }
  isStringArray(_value: SettingsValueType): _value is string[] {
    return this.type === TypedInputType.STRING && this.isArrayType();
  }
  isNumberArray(_value: SettingsValueType): _value is number[] {
    return (
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT) &&
      this.isArrayType()
    );
  }
  isBooleanArray(_value: SettingsValueType): _value is boolean[] {
    return this.type === TypedInputType.BOOLEAN && this.isArrayType();
  }
  isMap(
    _value: SettingsValueType,
  ): _value is
    | { [key: string]: string }
    | { [key: string]: number }
    | { [key: string]: boolean } {
    return this.isMapType();
  }
  isStringMap(_value: SettingsValueType): _value is { [key: string]: string } {
    return this.type === TypedInputType.STRING && this.isMapType();
  }
  isNumberMap(_value: SettingsValueType): _value is { [key: string]: number } {
    return (
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT) &&
      this.isMapType()
    );
  }
  isBooleanMap(
    _value: SettingsValueType,
  ): _value is { [key: string]: boolean } {
    return this.type === TypedInputType.BOOLEAN && this.isMapType();
  }

  isGenericFormControl(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is GenericFormControl {
    return this.isScalarType();
  }

  isGenericFormArray(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is GenericFormArray {
    return this.isArrayType();
  }

  isFormArrayString(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is FormArray<FormControl<string>> {
    return this.type === TypedInputType.STRING && this.isArrayType();
  }

  isFormArrayNumber(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is FormArray<FormControl<number>> {
    return (
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT) &&
      this.isArrayType()
    );
  }

  isFormArrayBoolean(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is FormArray<FormControl<boolean>> {
    return this.type === TypedInputType.BOOLEAN && this.isArrayType();
  }

  isGenericKeyValueMapArray(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is GenericKeyValueMapArray {
    return this.isMapType();
  }

  isKeyValueMapArrayString(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is FormArray<GenericKeyValueGroup<string>> {
    return this.type === TypedInputType.STRING && this.isMapType();
  }

  isKeyValueMapArrayNumber(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is FormArray<GenericKeyValueGroup<number>> {
    return (
      (this.type === TypedInputType.INTEGER ||
        this.type === TypedInputType.FLOAT) &&
      this.isMapType()
    );
  }

  isKeyValueMapArrayBoolean(
    _control: GenericFormControl | GenericFormArray | GenericKeyValueMapArray,
  ): _control is FormArray<GenericKeyValueGroup<boolean>> {
    return this.type === TypedInputType.BOOLEAN && this.isMapType();
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
