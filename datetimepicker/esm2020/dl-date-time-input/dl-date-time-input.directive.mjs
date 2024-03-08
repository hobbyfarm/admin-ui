import { Directive, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, } from '@angular/forms';
import moment from 'moment';
import { DL_DATE_TIME_DISPLAY_FORMAT, DL_DATE_TIME_INPUT_FORMATS } from '../core/public-api';
import { DlDateTimeInputChange } from './dl-date-time-input-change';
import * as i0 from "@angular/core";
import * as i1 from "../core/public-api";
/**
 *  This directive allows the user to enter dates, using the keyboard, into an input box and
 *  angular will then store a date value in the model.
 *
 *  The input format(s), display format, and model format are independent and fully customizable.
 */
export class DlDateTimeInputDirective {
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
    constructor(_renderer, _elementRef, _dateAdapter, _displayFormat, _inputFormats) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._displayFormat = _displayFormat;
        this._inputFormats = _inputFormats;
        /* tslint:disable:member-ordering */
        this._filterValidator = (control) => {
            return (this._inputFilter || (() => true))(this._value) ?
                null : { 'dlDateTimeInputFilter': { 'value': control.value } };
        };
        this._inputFilter = () => true;
        this._isValid = true;
        this._parseValidator = () => {
            return this._isValid ?
                null : { 'dlDateTimeInputParse': { 'text': this._elementRef.nativeElement.value } };
        };
        this._changed = [];
        this._touched = [];
        this._validator = Validators.compose([this._parseValidator, this._filterValidator]);
        this._onValidatorChange = () => { };
        this._value = undefined;
        /**
         * Emits when a `change` event when date/time is selected or
         * the value of the date/time picker changes.
         **/
        this.dateChange = new EventEmitter();
    }
    /**
     * Set a function used to determine whether or not the `value` entered by the user is allowed.
     * @param inputFilterFunction
     *   a function that returns `true` if the `value` entered by the user is allowed, otherwise `false`.
     */
    set dlDateTimeInputFilter(inputFilterFunction) {
        this._inputFilter = inputFilterFunction || (() => true);
        this._onValidatorChange();
    }
    /* tslint:enable:member-ordering */
    /**
     * Returns `D` value of the date/time input or `undefined` | `null` if no value is set.
     **/
    get value() {
        return this._value;
    }
    /**
     * Set the value of the date/time input to a value of `D` | `undefined` | `null`;
     * @param newValue
     *  the new value of the date/time input
     */
    set value(newValue) {
        if (newValue !== this._value) {
            this._value = newValue;
            this._changed.forEach(onChanged => onChanged(this._value));
        }
    }
    /**
     * Emit a `change` event when the value of the input changes.
     */
    _onChange() {
        this.dateChange.emit(new DlDateTimeInputChange(this._value));
    }
    /**
     * Format the input text using {@link DL_DATE_TIME_DISPLAY_FORMAT} and mark the control as touched.
     */
    _onBlur() {
        if (this._value) {
            this._setElementValue(this._value);
        }
        this._touched.forEach(onTouched => onTouched());
    }
    /**
     * Parse the user input into a possibly valid date.
     * The model value is not set if the input is NOT one of the {@link DL_DATE_TIME_INPUT_FORMATS}.
     * @param value
     *   Value of the input control.
     */
    _onInput(value) {
        const testDate = value === null || value === undefined || value === ''
            ? undefined
            : moment(value, this._inputFormats, true);
        this._isValid = testDate && testDate.isValid();
        this.value = this._isValid ? this._dateAdapter.fromMilliseconds(testDate.valueOf()) : undefined;
    }
    /**
     * @internal
     */
    _setElementValue(value) {
        if (value !== null && value !== undefined) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', moment(value).format(this._displayFormat));
        }
    }
    /**
     * @internal
     */
    registerOnChange(onChange) {
        this._changed.push(onChange);
    }
    /**
     * @internal
     */
    registerOnTouched(onTouched) {
        this._touched.push(onTouched);
    }
    /**
     * @internal
     */
    registerOnValidatorChange(validatorOnChange) {
        this._onValidatorChange = validatorOnChange;
    }
    /**
     * @internal
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * @internal
     */
    validate(control) {
        return this._validator(control);
    }
    /**
     * @internal
     */
    writeValue(value) {
        this._isValid = true;
        this.value = value;
        this._setElementValue(value);
    }
}
DlDateTimeInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.DlDateAdapter }, { token: DL_DATE_TIME_DISPLAY_FORMAT }, { token: DL_DATE_TIME_INPUT_FORMATS }], target: i0.ɵɵFactoryTarget.Directive });
DlDateTimeInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.4.0", type: DlDateTimeInputDirective, selector: "input[dlDateTimeInput]", inputs: { dlDateTimeInputFilter: "dlDateTimeInputFilter" }, outputs: { dateChange: "dateChange" }, host: { listeners: { "change": "_onChange()", "blur": "_onBlur()", "input": "_onInput($event.target.value)" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: DlDateTimeInputDirective, multi: true },
        { provide: NG_VALIDATORS, useExisting: DlDateTimeInputDirective, multi: true }
    ], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[dlDateTimeInput]',
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: DlDateTimeInputDirective, multi: true },
                        { provide: NG_VALIDATORS, useExisting: DlDateTimeInputDirective, multi: true }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.DlDateAdapter }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DL_DATE_TIME_DISPLAY_FORMAT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DL_DATE_TIME_INPUT_FORMATS]
                }] }]; }, propDecorators: { dateChange: [{
                type: Output
            }], dlDateTimeInputFilter: [{
                type: Input
            }], _onChange: [{
                type: HostListener,
                args: ['change']
            }], _onBlur: [{
                type: HostListener,
                args: ['blur']
            }], _onInput: [{
                type: HostListener,
                args: ['input', ['$event.target.value']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS10aW1lLWlucHV0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGwtZGF0ZS10aW1lLWlucHV0L2RsLWRhdGUtdGltZS1pbnB1dC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBYyxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ2xILE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBSWpCLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsMkJBQTJCLEVBQUUsMEJBQTBCLEVBQWdCLE1BQU0sb0JBQW9CLENBQUM7QUFDMUcsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7OztBQUVsRTs7Ozs7R0FLRztBQVFILE1BQU0sT0FBTyx3QkFBd0I7SUEwQm5DOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxZQUNVLFNBQW9CLEVBQ3BCLFdBQXVCLEVBQ3ZCLFlBQThCLEVBQ2dCLGNBQXNCLEVBQ3ZCLGFBQXVCO1FBSnBFLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIsaUJBQVksR0FBWixZQUFZLENBQWtCO1FBQ2dCLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUFVO1FBM0M5RSxvQ0FBb0M7UUFDNUIscUJBQWdCLEdBQWdCLENBQUMsT0FBd0IsRUFBMkIsRUFBRTtZQUM1RixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELElBQUks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LENBQUMsQ0FBQztJQUMvQixDQUFDOztxSEFwS1Usd0JBQXdCLGtHQTRDekIsMkJBQTJCLGFBQzNCLDBCQUEwQjt5R0E3Q3pCLHdCQUF3QixxUUFMeEI7UUFDVCxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUcsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztRQUNqRixFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFHLHdCQUF3QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7S0FDOUU7MkZBRVUsd0JBQXdCO2tCQVBwQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLDBCQUEyQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7d0JBQ2pGLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLDBCQUEyQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7cUJBQzlFO2lCQUNGOzswQkE2Q0ksTUFBTTsyQkFBQywyQkFBMkI7OzBCQUNsQyxNQUFNOzJCQUFDLDBCQUEwQjs0Q0FyQjNCLFVBQVU7c0JBRGxCLE1BQU07Z0JBK0JILHFCQUFxQjtzQkFEeEIsS0FBSztnQkErQmtCLFNBQVM7c0JBQWhDLFlBQVk7dUJBQUMsUUFBUTtnQkFPQSxPQUFPO3NCQUE1QixZQUFZO3VCQUFDLE1BQU07Z0JBYTRCLFFBQVE7c0JBQXZELFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIEluamVjdCwgSW5wdXQsIE91dHB1dCwgUmVuZGVyZXIyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICBBYnN0cmFjdENvbnRyb2wsXHJcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXHJcbiAgTkdfVkFMSURBVE9SUyxcclxuICBOR19WQUxVRV9BQ0NFU1NPUixcclxuICBWYWxpZGF0aW9uRXJyb3JzLFxyXG4gIFZhbGlkYXRvcixcclxuICBWYWxpZGF0b3JGbixcclxuICBWYWxpZGF0b3JzLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQge0RMX0RBVEVfVElNRV9ESVNQTEFZX0ZPUk1BVCwgRExfREFURV9USU1FX0lOUFVUX0ZPUk1BVFMsIERsRGF0ZUFkYXB0ZXJ9IGZyb20gJy4uL2NvcmUvcHVibGljLWFwaSc7XHJcbmltcG9ydCB7RGxEYXRlVGltZUlucHV0Q2hhbmdlfSBmcm9tICcuL2RsLWRhdGUtdGltZS1pbnB1dC1jaGFuZ2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGRpcmVjdGl2ZSBhbGxvd3MgdGhlIHVzZXIgdG8gZW50ZXIgZGF0ZXMsIHVzaW5nIHRoZSBrZXlib2FyZCwgaW50byBhbiBpbnB1dCBib3ggYW5kXHJcbiAqICBhbmd1bGFyIHdpbGwgdGhlbiBzdG9yZSBhIGRhdGUgdmFsdWUgaW4gdGhlIG1vZGVsLlxyXG4gKlxyXG4gKiAgVGhlIGlucHV0IGZvcm1hdChzKSwgZGlzcGxheSBmb3JtYXQsIGFuZCBtb2RlbCBmb3JtYXQgYXJlIGluZGVwZW5kZW50IGFuZCBmdWxseSBjdXN0b21pemFibGUuXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ2lucHV0W2RsRGF0ZVRpbWVJbnB1dF0nLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogIERsRGF0ZVRpbWVJbnB1dERpcmVjdGl2ZSwgbXVsdGk6IHRydWV9LFxyXG4gICAge3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiAgRGxEYXRlVGltZUlucHV0RGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1cclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lSW5wdXREaXJlY3RpdmU8RD4gaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcclxuXHJcbiAgLyogdHNsaW50OmRpc2FibGU6bWVtYmVyLW9yZGVyaW5nICovXHJcbiAgcHJpdmF0ZSBfZmlsdGVyVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XHJcbiAgICByZXR1cm4gKHRoaXMuX2lucHV0RmlsdGVyIHx8ICgoKSA9PiB0cnVlKSkodGhpcy5fdmFsdWUpID9cclxuICAgICAgbnVsbCA6IHsnZGxEYXRlVGltZUlucHV0RmlsdGVyJzogeyd2YWx1ZSc6IGNvbnRyb2wudmFsdWV9fTtcclxuICB9XHJcbiAgcHJpdmF0ZSBfaW5wdXRGaWx0ZXI6ICh2YWx1ZTogKEQgfCBudWxsKSkgPT4gYm9vbGVhbiA9ICgpID0+IHRydWU7XHJcbiAgcHJpdmF0ZSBfaXNWYWxpZCA9IHRydWU7XHJcbiAgcHJpdmF0ZSBfcGFyc2VWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcclxuICAgIHJldHVybiB0aGlzLl9pc1ZhbGlkID9cclxuICAgICAgbnVsbCA6IHsnZGxEYXRlVGltZUlucHV0UGFyc2UnOiB7J3RleHQnOiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWV9fTtcclxuICB9XHJcbiAgcHJpdmF0ZSBfY2hhbmdlZDogKCh2YWx1ZTogRCkgPT4gdm9pZClbXSA9IFtdO1xyXG4gIHByaXZhdGUgX3RvdWNoZWQ6ICgoKSA9PiB2b2lkKVtdID0gW107XHJcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFt0aGlzLl9wYXJzZVZhbGlkYXRvciwgdGhpcy5fZmlsdGVyVmFsaWRhdG9yXSk7XHJcbiAgcHJpdmF0ZSBfb25WYWxpZGF0b3JDaGFuZ2U6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcclxuICBwcml2YXRlIF92YWx1ZTogRCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgd2hlbiBhIGBjaGFuZ2VgIGV2ZW50IHdoZW4gZGF0ZS90aW1lIGlzIHNlbGVjdGVkIG9yXHJcbiAgICogdGhlIHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyIGNoYW5nZXMuXHJcbiAgICoqL1xyXG4gIEBPdXRwdXQoKVxyXG4gIHJlYWRvbmx5IGRhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPERsRGF0ZVRpbWVJbnB1dENoYW5nZTxEPj4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGRpcmVjdGl2ZS5cclxuICAgKiBAcGFyYW0gX3JlbmRlcmVyXHJcbiAgICogIHJlZmVyZW5jZSB0byB0aGUgcmVuZGVyZXIuXHJcbiAgICogQHBhcmFtIF9lbGVtZW50UmVmXHJcbiAgICogIHJlZmVyZW5jZSB0byB0aGlzIGVsZW1lbnQuXHJcbiAgICogQHBhcmFtIF9kYXRlQWRhcHRlclxyXG4gICAqICBkYXRlIGFkYXB0ZXIgZm9yIHRoZSBkYXRlIHR5cGUgaW4gdGhlIG1vZGVsLlxyXG4gICAqIEBwYXJhbSBfZGlzcGxheUZvcm1hdFxyXG4gICAqICBmcm9tIGBETF9EQVRFX1RJTUVfRElTUExBWV9GT1JNQVRgLCB3aGljaCBkZWZpbmVzIHRoZSBmb3JtYXQgdG8gdXNlIGZvciBhIHZhbGlkIGRhdGUvdGltZSB2YWx1ZS5cclxuICAgKiBAcGFyYW0gX2lucHV0Rm9ybWF0c1xyXG4gICAqICBmcm9tIGBETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUU2AsIHdoaWNoIGRlZmluZXMgdGhlIGlucHV0IGZvcm1hdHMgdGhhdCBhbGxvd2VkIGFzIHZhbGlkIGRhdGUvdGltZSB2YWx1ZXMuXHJcbiAgICogIE5COiBtb21lbnQgaXMgYWx3YXlzIGluIHN0cmljdCBwYXJzZSBtb2RlIGZvciB0aGlzIGRpcmVjdGl2ZS5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERsRGF0ZUFkYXB0ZXI8RD4sXHJcbiAgICBASW5qZWN0KERMX0RBVEVfVElNRV9ESVNQTEFZX0ZPUk1BVCkgcHJpdmF0ZSByZWFkb25seSBfZGlzcGxheUZvcm1hdDogc3RyaW5nLFxyXG4gICAgQEluamVjdChETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUUykgcHJpdmF0ZSByZWFkb25seSBfaW5wdXRGb3JtYXRzOiBzdHJpbmdbXVxyXG4gICkge31cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGEgZnVuY3Rpb24gdXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdGhlIGB2YWx1ZWAgZW50ZXJlZCBieSB0aGUgdXNlciBpcyBhbGxvd2VkLlxyXG4gICAqIEBwYXJhbSBpbnB1dEZpbHRlckZ1bmN0aW9uXHJcbiAgICogICBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgZW50ZXJlZCBieSB0aGUgdXNlciBpcyBhbGxvd2VkLCBvdGhlcndpc2UgYGZhbHNlYC5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHNldCBkbERhdGVUaW1lSW5wdXRGaWx0ZXIoaW5wdXRGaWx0ZXJGdW5jdGlvbjogKHZhbHVlOiBEIHwgbnVsbCkgPT4gYm9vbGVhbikge1xyXG4gICAgdGhpcy5faW5wdXRGaWx0ZXIgPSBpbnB1dEZpbHRlckZ1bmN0aW9uIHx8ICgoKSA9PiB0cnVlKTtcclxuICAgIHRoaXMuX29uVmFsaWRhdG9yQ2hhbmdlKCk7XHJcbiAgfVxyXG5cclxuICAvKiB0c2xpbnQ6ZW5hYmxlOm1lbWJlci1vcmRlcmluZyAqL1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGBEYCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIGlucHV0IG9yIGB1bmRlZmluZWRgIHwgYG51bGxgIGlmIG5vIHZhbHVlIGlzIHNldC5cclxuICAgKiovXHJcbiAgZ2V0IHZhbHVlKCk6IEQge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIGlucHV0IHRvIGEgdmFsdWUgb2YgYERgIHwgYHVuZGVmaW5lZGAgfCBgbnVsbGA7XHJcbiAgICogQHBhcmFtIG5ld1ZhbHVlXHJcbiAgICogIHRoZSBuZXcgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBpbnB1dFxyXG4gICAqL1xyXG5cclxuICBzZXQgdmFsdWUobmV3VmFsdWU6IEQgfCBudWxsIHwgdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX3ZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgIHRoaXMuX2NoYW5nZWQuZm9yRWFjaChvbkNoYW5nZWQgPT4gb25DaGFuZ2VkKHRoaXMuX3ZhbHVlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbWl0IGEgYGNoYW5nZWAgZXZlbnQgd2hlbiB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGNoYW5nZXMuXHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJykgX29uQ2hhbmdlKCkge1xyXG4gICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQobmV3IERsRGF0ZVRpbWVJbnB1dENoYW5nZSh0aGlzLl92YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRm9ybWF0IHRoZSBpbnB1dCB0ZXh0IHVzaW5nIHtAbGluayBETF9EQVRFX1RJTUVfRElTUExBWV9GT1JNQVR9IGFuZCBtYXJrIHRoZSBjb250cm9sIGFzIHRvdWNoZWQuXHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpIF9vbkJsdXIoKSB7XHJcbiAgICBpZiAodGhpcy5fdmFsdWUpIHtcclxuICAgICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKHRoaXMuX3ZhbHVlKTtcclxuICAgIH1cclxuICAgIHRoaXMuX3RvdWNoZWQuZm9yRWFjaChvblRvdWNoZWQgPT4gb25Ub3VjaGVkKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFyc2UgdGhlIHVzZXIgaW5wdXQgaW50byBhIHBvc3NpYmx5IHZhbGlkIGRhdGUuXHJcbiAgICogVGhlIG1vZGVsIHZhbHVlIGlzIG5vdCBzZXQgaWYgdGhlIGlucHV0IGlzIE5PVCBvbmUgb2YgdGhlIHtAbGluayBETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUU30uXHJcbiAgICogQHBhcmFtIHZhbHVlXHJcbiAgICogICBWYWx1ZSBvZiB0aGUgaW5wdXQgY29udHJvbC5cclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50LnRhcmdldC52YWx1ZSddKSBfb25JbnB1dCh2YWx1ZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgY29uc3QgdGVzdERhdGUgPSB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJ1xyXG4gICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICA6IG1vbWVudCh2YWx1ZSwgdGhpcy5faW5wdXRGb3JtYXRzLCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLl9pc1ZhbGlkID0gdGVzdERhdGUgJiYgdGVzdERhdGUuaXNWYWxpZCgpO1xyXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuX2lzVmFsaWQgPyB0aGlzLl9kYXRlQWRhcHRlci5mcm9tTWlsbGlzZWNvbmRzKHRlc3REYXRlLnZhbHVlT2YoKSkgOiB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAaW50ZXJuYWxcclxuICAgKi9cclxuICBwcml2YXRlIF9zZXRFbGVtZW50VmFsdWUodmFsdWU6IEQpIHtcclxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgbW9tZW50KHZhbHVlKS5mb3JtYXQodGhpcy5fZGlzcGxheUZvcm1hdCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGludGVybmFsXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMuX2NoYW5nZWQucHVzaChvbkNoYW5nZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAaW50ZXJuYWxcclxuICAgKi9cclxuICByZWdpc3Rlck9uVG91Y2hlZChvblRvdWNoZWQ6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMuX3RvdWNoZWQucHVzaChvblRvdWNoZWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGludGVybmFsXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZSh2YWxpZGF0b3JPbkNoYW5nZTogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgdGhpcy5fb25WYWxpZGF0b3JDaGFuZ2UgPSB2YWxpZGF0b3JPbkNoYW5nZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqL1xyXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqL1xyXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IoY29udHJvbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAaW50ZXJuYWxcclxuICAgKi9cclxuICB3cml0ZVZhbHVlKHZhbHVlOiBEKTogdm9pZCB7XHJcbiAgICB0aGlzLl9pc1ZhbGlkID0gdHJ1ZTtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==