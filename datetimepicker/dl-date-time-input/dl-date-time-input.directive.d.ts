import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import { DlDateAdapter } from '../core/public-api';
import { DlDateTimeInputChange } from './dl-date-time-input-change';
import * as i0 from "@angular/core";
/**
 *  This directive allows the user to enter dates, using the keyboard, into an input box and
 *  angular will then store a date value in the model.
 *
 *  The input format(s), display format, and model format are independent and fully customizable.
 */
export declare class DlDateTimeInputDirective<D> implements ControlValueAccessor, Validator {
    private _renderer;
    private _elementRef;
    private _dateAdapter;
    private readonly _displayFormat;
    private readonly _inputFormats;
    private _filterValidator;
    private _inputFilter;
    private _isValid;
    private _parseValidator;
    private _changed;
    private _touched;
    private _validator;
    private _onValidatorChange;
    private _value;
    /**
     * Emits when a `change` event when date/time is selected or
     * the value of the date/time picker changes.
     **/
    readonly dateChange: EventEmitter<DlDateTimeInputChange<D>>;
    /**
     * Constructs a new instance of this directive.
     * @param _renderer
     *  reference to the renderer.
     * @param _elementRef
     *  reference to this element.
     * @param _dateAdapter
     *  date adapter for the date type in the model.
     * @param _displayFormat
     *  from `DL_DATE_TIME_DISPLAY_FORMAT`, which defines the format to use for a valid date/time value.
     * @param _inputFormats
     *  from `DL_DATE_TIME_INPUT_FORMATS`, which defines the input formats that allowed as valid date/time values.
     *  NB: moment is always in strict parse mode for this directive.
     */
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _dateAdapter: DlDateAdapter<D>, _displayFormat: string, _inputFormats: string[]);
    /**
     * Set a function used to determine whether or not the `value` entered by the user is allowed.
     * @param inputFilterFunction
     *   a function that returns `true` if the `value` entered by the user is allowed, otherwise `false`.
     */
    set dlDateTimeInputFilter(inputFilterFunction: (value: D | null) => boolean);
    /**
     * Returns `D` value of the date/time input or `undefined` | `null` if no value is set.
     **/
    get value(): D;
    /**
     * Set the value of the date/time input to a value of `D` | `undefined` | `null`;
     * @param newValue
     *  the new value of the date/time input
     */
    set value(newValue: D | null | undefined);
    /**
     * Emit a `change` event when the value of the input changes.
     */
    _onChange(): void;
    /**
     * Format the input text using {@link DL_DATE_TIME_DISPLAY_FORMAT} and mark the control as touched.
     */
    _onBlur(): void;
    /**
     * Parse the user input into a possibly valid date.
     * The model value is not set if the input is NOT one of the {@link DL_DATE_TIME_INPUT_FORMATS}.
     * @param value
     *   Value of the input control.
     */
    _onInput(value: string | null | undefined): void;
    /**
     * @internal
     */
    private _setElementValue;
    /**
     * @internal
     */
    registerOnChange(onChange: (value: any) => void): void;
    /**
     * @internal
     */
    registerOnTouched(onTouched: () => void): void;
    /**
     * @internal
     */
    registerOnValidatorChange(validatorOnChange: () => void): void;
    /**
     * @internal
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * @internal
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * @internal
     */
    writeValue(value: D): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateTimeInputDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DlDateTimeInputDirective<any>, "input[dlDateTimeInput]", never, { "dlDateTimeInputFilter": "dlDateTimeInputFilter"; }, { "dateChange": "dateChange"; }, never>;
}
