import * as moment from 'moment';
import moment__default from 'moment';
import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, NgModule, EventEmitter, Directive, Output, Input, HostListener, Component, ChangeDetectionStrategy } from '@angular/core';
import { Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import * as i7 from '@angular/common';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';

/**
 * Determines the model type of the Date/Time picker another type.
 */
class DlDateAdapter {
}

/**
 * Adapts `moment` to be usable as a date by date/time components that work with dates.
 **/
class DlDateAdapterMoment extends DlDateAdapter {
    /**
     * Create a new instance of a `moment` type from milliseconds.
     * @param milliseconds
     *  a time value as milliseconds (local time zone)
     * @returns
     *  an instance of `moment` for the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return moment__default(milliseconds);
    }
    /**
     * Returns a moment in time value as milliseconds (local time zone).
     * @param value
     *  a moment or `null`.
     * @returns
     *  a `moment.valueOf()` result for the specified `moment` or `null`
     */
    toMilliseconds(value) {
        return (value) ? value.valueOf() : undefined;
    }
}

/**
 * Adapts `Date` to be usable as a date by date/time components that work with dates.
 **/
class DlDateAdapterNative extends DlDateAdapter {
    /**
     * Create a new instance of a `moment` type from milliseconds.
     * @param milliseconds
     *  a time value as milliseconds (local time zone)
     * @returns
     *  an instance of `moment` for the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return new Date(milliseconds);
    }
    /**
     * Returns a moment in time value as milliseconds (local time zone).
     * @param value
     *  a Date or null.
     * @returns
     *  a `value.getTime()` result for the specified `Date` or `null`.
     */
    toMilliseconds(value) {
        return (value) ? value.getTime() : undefined;
    }
}

/**
 * Adapts `number` to be usable as a date by date/time components that work with dates.
 * No op adapter.
 **/
class DlDateAdapterNumber extends DlDateAdapter {
    /**
     * Returns the specified number.
     * @param milliseconds
     *  a moment time time.
     * @returns
     *  the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return milliseconds;
    }
    /**
     * Returns the specified number.
     * @param value
     *  a moment time time or `null`
     * @returns
     *  the specified moment in time or `null`
     */
    toMilliseconds(value) {
        return value;
    }
}

/**
 * InjectionToken for string dates that can be used to override default model format.
 **/
const DL_DATE_TIME_DISPLAY_FORMAT = new InjectionToken('DL_DATE_TIME_DISPLAY_FORMAT');
/**
 * `Moment`'s long date format `lll` used as the default output format
 * for string date's
 */
const DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT = moment.localeData().longDateFormat('lll');
/**
 * InjectionToken for string dates that can be used to override default input formats.
 **/
const DL_DATE_TIME_INPUT_FORMATS = new InjectionToken('DL_DATE__TIME_INPUT_FORMATS');
/**
 *  Default input format's used by `DlDateAdapterString`
 */
const DL_DATE_TIME_INPUT_FORMATS_DEFAULT = [
    'YYYY-MM-DDTHH:mm',
    'YYYY-MM-DDTHH:mm:ss',
    'YYYY-MM-DDTHH:mm:ss.SSS',
    'YYYY-MM-DD',
    'M/D/YYYY h:m:s A',
    'M/D/YYYY h:m A',
    'M/D/YYYY h:m A',
    'M/D/YYYY hh:mm A',
    'M/D/YYYY',
    'M/D/YY h:m:s A',
    'M/D/YY h:m A',
    'M/D/YY h A',
    'M/D/YY',
    DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT,
    moment.ISO_8601,
];
/**
 * InjectionToken for string dates that can be used to override default model format.
 **/
const DL_DATE_TIME_MODEL_FORMAT = new InjectionToken('DL_DATE_TIME_MODEL_FORMAT');
/**
 *  Default model format (ISO 8601)`
 */
const DL_DATE_TIME_MODEL_FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

/**
 * Adapts `string` to be usable as a date by date/time components that work with dates.
 **/
class DlDateAdapterString extends DlDateAdapter {
    /**
     *  Constructs a new instance of this class.
     *
     * @param inputFormats
     *  see {@link DL_DATE_TIME_INPUT_FORMATS}
     * @param modelFormat
     *  see {@link DL_DATE_TIME_MODEL_FORMAT}
     */
    constructor(inputFormats, modelFormat) {
        super();
        this.inputFormats = inputFormats;
        this.modelFormat = modelFormat;
    }
    /**
     * Returns the specified number.
     * @param milliseconds
     *  a moment time time.
     * @returns
     *  the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return moment__default(milliseconds).format(this.modelFormat);
    }
    /**
     * Returns the specified number.
     * @param value
     *  a moment time time or `null`
     * @returns
     *  the milliseconds for the specified value or `null`
     *  `null` is returned when value is not a valid input date string
     */
    toMilliseconds(value) {
        if (value !== undefined && value !== null) {
            const newMoment = moment__default(value, this.inputFormats, true);
            return newMoment.isValid() ? newMoment.valueOf() : undefined;
        }
    }
}
DlDateAdapterString.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateAdapterString, deps: [{ token: DL_DATE_TIME_INPUT_FORMATS }, { token: DL_DATE_TIME_MODEL_FORMAT }], target: i0.ɵɵFactoryTarget.Injectable });
DlDateAdapterString.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateAdapterString, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateAdapterString, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DL_DATE_TIME_INPUT_FORMATS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DL_DATE_TIME_MODEL_FORMAT]
                }] }]; } });

/**
 * Import this module to supply your own `DateAdapter` provider.
 * @internal
 **/
class DlDateTimeCoreModule {
}
DlDateTimeCoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeCoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule });
DlDateTimeCoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule, providers: [
        { provide: DL_DATE_TIME_DISPLAY_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_MODEL_FORMAT_DEFAULT }
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [
                        { provide: DL_DATE_TIME_DISPLAY_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
                        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
                        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_MODEL_FORMAT_DEFAULT }
                    ]
                }]
        }] });
/**
 * Import this module to store `milliseconds` in the model.
 * @internal
 */
class DlDateTimeNumberModule {
}
DlDateTimeNumberModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeNumberModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, imports: [DlDateTimeCoreModule], exports: [DlDateTimeCoreModule] });
DlDateTimeNumberModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, providers: [
        { provide: DlDateAdapter, useClass: DlDateAdapterNumber }
    ], imports: [[DlDateTimeCoreModule], DlDateTimeCoreModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DlDateAdapter, useClass: DlDateAdapterNumber }
                    ],
                    exports: [DlDateTimeCoreModule]
                }]
        }] });
/**
 * Import this module to store a native JavaScript `Date` in the model.
 * @internal
 */
class DlDateTimeDateModule {
}
DlDateTimeDateModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeDateModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, imports: [DlDateTimeCoreModule] });
DlDateTimeDateModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, providers: [
        { provide: DlDateAdapter, useClass: DlDateAdapterNative }
    ], imports: [[DlDateTimeCoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DlDateAdapter, useClass: DlDateAdapterNative }
                    ],
                }]
        }] });
/**
 * Import this module to store a `moment` in the model.
 * @internal
 */
class DlDateTimeMomentModule {
}
DlDateTimeMomentModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeMomentModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, imports: [DlDateTimeCoreModule] });
DlDateTimeMomentModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, providers: [
        { provide: DlDateAdapter, useClass: DlDateAdapterMoment }
    ], imports: [[DlDateTimeCoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DlDateAdapter, useClass: DlDateAdapterMoment }
                    ],
                }]
        }] });
/**
 * Import this module to store a `string` in the model.
 * @internal
 */
class DlDateTimeStringModule {
}
DlDateTimeStringModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeStringModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, imports: [DlDateTimeCoreModule] });
DlDateTimeStringModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, providers: [
        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
        { provide: DlDateAdapter, useClass: DlDateAdapterString }
    ], imports: [[DlDateTimeCoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
                        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
                        { provide: DlDateAdapter, useClass: DlDateAdapterString }
                    ],
                }]
        }] });

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Emitted when the value of a date/time input changes.
 */
class DlDateTimeInputChange {
    /**
     * Constructs a new instance.
     * @param newValue
     *  the new value of the date/time picker.
     */
    constructor(newValue) {
        this._value = newValue;
    }
    /**
     * Get the new value of the date/time picker.
     * @returns the new value or null.
     */
    get value() {
        return this._value;
    }
}

/**
 *  This directive allows the user to enter dates, using the keyboard, into an input box and
 *  angular will then store a date value in the model.
 *
 *  The input format(s), display format, and model format are independent and fully customizable.
 */
class DlDateTimeInputDirective {
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
            : moment__default(value, this._inputFormats, true);
        this._isValid = testDate && testDate.isValid();
        this.value = this._isValid ? this._dateAdapter.fromMilliseconds(testDate.valueOf()) : undefined;
    }
    /**
     * @internal
     */
    _setElementValue(value) {
        if (value !== null && value !== undefined) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', moment__default(value).format(this._displayFormat));
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
DlDateTimeInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: DlDateAdapter }, { token: DL_DATE_TIME_DISPLAY_FORMAT }, { token: DL_DATE_TIME_INPUT_FORMATS }], target: i0.ɵɵFactoryTarget.Directive });
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
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: DlDateAdapter }, { type: undefined, decorators: [{
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

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Import this module to allow date/time input.
 * @internal
 **/
class DlDateTimeInputModule {
}
DlDateTimeInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, declarations: [DlDateTimeInputDirective], imports: [CommonModule], exports: [DlDateTimeInputDirective] });
DlDateTimeInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DlDateTimeInputDirective],
                    imports: [CommonModule],
                    exports: [DlDateTimeInputDirective],
                }]
        }] });

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Emitted when the value of a date/time picker changes.
 */
class DlDateTimePickerChange {
    /**
     * Constructs a new instance.
     * @param newValue
     *  the new value of the date/time picker.
     */
    constructor(newValue) {
        this._value = newValue;
    }
    /**
     * Get the new value of the date/time picker.
     * @returns the new value or null.
     */
    get value() {
        return this._value;
    }
}

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Default implementation for the `year` view.
 */
class DlYearModelProvider {
    /**
     * Create a moment at midnight january 1 at the start of the current decade.
     * The start of the decade is always a year ending in zero.
     *
     * @param fromMilliseconds
     *  the moment in time from which the start of the decade will be determined.
     * @returns
     *  moment at midnight january 1 at the start of the current decade.
     * @internal
     */
    static getStartOfDecade(fromMilliseconds) {
        // Truncate the last digit from the current year to get the start of the decade
        const startDecade = (Math.trunc(moment__default(fromMilliseconds).year() / 10) * 10);
        return moment__default({ year: startDecade }).startOf('year');
    }
    /**
     * Receives input changes detected by Angular.
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    onChanges(_changes) { }
    /**
     * Returns the `year` model for the specified moment in `local` time with the
     * `active` year set to January 1 of the specified year.
     *
     * The `year` model represents a decade (10 years) as two rows with five columns.
     *
     * The decade always starts on a year ending with zero.
     *
     * Each cell represents midnight January 1 of the indicated year.
     *
     * The `active` year will be the January 1 of year of the specified milliseconds.
     *
     * @param milliseconds
     *  the moment in time from which the year model will be created.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  the model representing the specified moment in time.
     */
    getModel(milliseconds, selectedMilliseconds) {
        const rowNumbers = [0, 1];
        const columnNumbers = [0, 1, 2, 3, 4];
        const startYear = moment__default(milliseconds).startOf('year');
        const startDate = DlYearModelProvider.getStartOfDecade(milliseconds);
        const futureYear = startDate.year() + 9;
        const pastYear = startDate.year();
        const activeValue = startYear.valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment__default(selectedMilliseconds).startOf('year').valueOf();
        return {
            viewName: 'year',
            viewLabel: `${pastYear}-${futureYear}`,
            activeDate: activeValue,
            leftButton: {
                value: moment__default(startDate).subtract(10, 'years').valueOf(),
                ariaLabel: `Go to ${pastYear - 10}-${pastYear - 1}`,
                classes: {},
            },
            rightButton: {
                value: moment__default(startDate).add(10, 'years').valueOf(),
                ariaLabel: `Go to ${futureYear + 1}-${futureYear + 10}`,
                classes: {},
            },
            rows: rowNumbers.map(rowOfYears.bind(this))
        };
        function rowOfYears(rowNumber) {
            const currentMoment = moment__default();
            const cells = columnNumbers.map((columnNumber) => {
                const yearMoment = moment__default(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'years');
                return {
                    display: yearMoment.format('YYYY'),
                    value: yearMoment.valueOf(),
                    classes: {
                        'dl-abdtp-active': activeValue === yearMoment.valueOf(),
                        'dl-abdtp-selected': selectedValue === yearMoment.valueOf(),
                        'dl-abdtp-now': yearMoment.isSame(currentMoment, 'year'),
                    }
                };
            });
            return { cells };
        }
    }
    /**
     * Move the active `year` one row `down` from the specified moment in time.
     *
     * The `active` year will be the January 1 `five (5) years after` the specified milliseconds.
     * This moves the `active` date one row `down` in the current `year` view.
     *
     * Moving `down` can result in the `active` year being part of a different decade than
     * the specified `fromMilliseconds`, in this case the decade represented by the model
     * will change to show the correct decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `year` model `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `year` one row `down` from the specified moment in time.
     */
    goDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(5, 'year').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `year` one row `up` from the specified moment in time.
     *
     * The `active` year will be the January 1 `five (5) years before` the specified milliseconds.
     * This moves the `active` date one row `up` in the current `year` view.
     *
     * Moving `up` can result in the `active` year being part of a different decade than
     * the specified `fromMilliseconds`, in this case the decade represented by the model
     * will change to show the correct decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the previous `year` model `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `year` one row `up` from the specified moment in time.
     */
    goUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(5, 'year').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `year` one (1) year to the `left` of the specified moment in time.
     *
     * The `active` year will be the January 1 `one (1) year before` the specified milliseconds.
     * This moves the `active` date one year `left` in the current `year` view.
     *
     * Moving `left` can result in the `active` year being part of a different decade than
     * the specified `fromMilliseconds`, in this case the decade represented by the model
     * will change to show the correct decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `year` model to the `left` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `year` one year to the `left` of the specified moment in time.
     */
    goLeft(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(1, 'year').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `year` one (1) year to the `right` of the specified moment in time.
     *
     * The `active` year will be the January 1 `one (1) year after` the specified milliseconds.
     * This moves the `active` date one year `right` in the current `year` view.
     *
     * Moving `right` can result in the `active` year being part of a different decade than
     * the specified `fromMilliseconds`, in this case the decade represented by the model
     * will change to show the correct decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `year` model to the `right` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `year` one year to the `right` of the specified moment in time.
     */
    goRight(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(1, 'year').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `year` one decade `down` from the specified moment in time.
     *
     * The `active` year will be the January 1 `ten (10) years after` the specified milliseconds.
     * This moves the `active` date one `page` `down` from the current `year` view.
     *
     * Paging `down` will result in the `active` year being part of a different decade than
     * the specified `fromMilliseconds`. As a result, the decade represented by the model
     * will change to show the correct decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `year` model page `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `year` one decade `down` from the specified moment in time.
     */
    pageDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(10, 'year').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `year` one decade `up` from the specified moment in time.
     *
     * The `active` year will be the January 1 `ten (10) years before` the specified milliseconds.
     * This moves the `active` date one `page-up` from the current `year` view.
     *
     * Paging `up` will result in the `active` year being part of a different decade than
     * the specified `fromMilliseconds`. As a result, the decade represented by the model
     * will change to show the correct decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `year` model page `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `year` one decade `up` from the specified moment in time.
     */
    pageUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(10, 'year').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `year` to the `last` year in the decade.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different decade than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `last` active `year` will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the `last` cell in the view as the active `year`.
     */
    goEnd(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(DlYearModelProvider.getStartOfDecade(fromMilliseconds)
            .add(9, 'years')
            .endOf('year')
            .valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `year` to the `first` year in the decade.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different decade than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `first` active `year` will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the `first` cell in the view as the active `year`.
     */
    goHome(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(DlYearModelProvider.getStartOfDecade(fromMilliseconds)
            .startOf('year')
            .valueOf(), selectedMilliseconds);
    }
}

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Default implementation for the `month` view.
 */
class DlMonthModelProvider {
    /**
     * Receives input changes detected by Angular.
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    onChanges(_changes) { }
    /**
     * Returns the `month` model for the specified moment in `local` time with the
     * `active` month set to the first day of the specified month.
     *
     * The `month` model represents a year (12 months) as three rows with four columns.
     *
     * The year always starts in January.
     *
     * Each cell represents midnight on the 1st day of the month.
     *
     * The `active` month will be the January of year of the specified milliseconds.
     *
     * @param milliseconds
     *  the moment in time from which the month model will be created.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  the model representing the specified moment in time.
     */
    getModel(milliseconds, selectedMilliseconds) {
        const startDate = moment__default(milliseconds).startOf('year');
        const rowNumbers = [0, 1, 2];
        const columnNumbers = [0, 1, 2, 3];
        const previousYear = moment__default(startDate).subtract(1, 'year');
        const nextYear = moment__default(startDate).add(1, 'year');
        const activeValue = moment__default(milliseconds).startOf('month').valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment__default(selectedMilliseconds).startOf('month').valueOf();
        return {
            viewName: 'month',
            viewLabel: startDate.format('YYYY'),
            activeDate: activeValue,
            leftButton: {
                value: previousYear.valueOf(),
                ariaLabel: `Go to ${previousYear.format('YYYY')}`,
                classes: {},
            },
            upButton: {
                value: startDate.valueOf(),
                ariaLabel: `Go to ${startDate.format('YYYY')}`,
                classes: {},
            },
            rightButton: {
                value: nextYear.valueOf(),
                ariaLabel: `Go to ${nextYear.format('YYYY')}`,
                classes: {},
            },
            rows: rowNumbers.map(rowOfMonths)
        };
        function rowOfMonths(rowNumber) {
            const currentMoment = moment__default();
            const cells = columnNumbers.map((columnNumber) => {
                const monthMoment = moment__default(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'months');
                return {
                    display: monthMoment.format('MMM'),
                    ariaLabel: monthMoment.format('MMM YYYY'),
                    value: monthMoment.valueOf(),
                    classes: {
                        'dl-abdtp-active': activeValue === monthMoment.valueOf(),
                        'dl-abdtp-selected': selectedValue === monthMoment.valueOf(),
                        'dl-abdtp-now': monthMoment.isSame(currentMoment, 'month'),
                    }
                };
            });
            return { cells };
        }
    }
    /**
     * Move the active `month` one row `down` from the specified moment in time.
     *
     * Moving `down` can result in the `active` month being part of a different year than
     * the specified `fromMilliseconds`, in this case the year represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `month` model `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one row `down` from the specified moment in time.
     */
    goDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(4, 'month').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `month` one row `up` from the specified moment in time.
     *
     * Moving `up` can result in the `active` month being part of a different year than
     * the specified `fromMilliseconds`, in this case the year represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the previous `month` model `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one row `up` from the specified moment in time.
     */
    goUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(4, 'month').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `month` one (1) month to the `left` of the specified moment in time.
     *
     * Moving `left` can result in the `active` month being part of a different year than
     * the specified `fromMilliseconds`, in this case the year represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `month` model to the `left` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one month to the `left` of the specified moment in time.
     */
    goLeft(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(1, 'month').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `month` one (1) month to the `right` of the specified moment in time.
     *
     * The `active` month will be `one (1) month after` the specified milliseconds.
     * This moves the `active` date one month `right` in the current `month` view.
     *
     * Moving `right` can result in the `active` month being part of a different year than
     * the specified `fromMilliseconds`, in this case the year represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `month` model to the `right` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one year to the `right` of the specified moment in time.
     */
    goRight(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(1, 'month').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `month` one year `down` from the specified moment in time.
     *
     * Paging `down` will result in the `active` month being part of a different year than
     * the specified `fromMilliseconds`. As a result, the year represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `month` model page `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one year `down` from the specified moment in time.
     */
    pageDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(12, 'months').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `month` one year `down` from the specified moment in time.
     *
     * Paging `up` will result in the `active` month being part of a different year than
     * the specified `fromMilliseconds`. As a result, the year represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `month` model page `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one year `up` from the specified moment in time.
     */
    pageUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(12, 'months').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `month` to `December` of the current year.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different year than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which `December 1` will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the `December` cell in the view as the active `month`.
     */
    goEnd(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).endOf('year').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `month` to `January` of the current year.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different year than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which `January 1` will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the `January` cell in the view as the active `month`.
     */
    goHome(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).startOf('year').valueOf(), selectedMilliseconds);
    }
}

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Default implementation for the `day` view.
 */
class DlDayModelProvider {
    /**
     * Receives input changes detected by Angular.
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    onChanges(_changes) { }
    /**
     * Returns the `day` model for the specified moment in `local` time with the
     * `active` day set to the first day of the month.
     *
     * The `day` model represents a month (42 days) as six rows with seven columns
     * and each cell representing one-day increments.
     *
     * The `day` always starts at midnight.
     *
     * Each cell represents a one-day increment at midnight.
     *
     * @param milliseconds
     *  the moment in time from which the minute model will be created.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  the model representing the specified moment in time.
     */
    getModel(milliseconds, selectedMilliseconds) {
        const startOfMonth = moment__default(milliseconds).startOf('month');
        const endOfMonth = moment__default(milliseconds).endOf('month');
        const startOfView = moment__default(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');
        const rowNumbers = [0, 1, 2, 3, 4, 5];
        const columnNumbers = [0, 1, 2, 3, 4, 5, 6];
        const previousMonth = moment__default(startOfMonth).subtract(1, 'month');
        const nextMonth = moment__default(startOfMonth).add(1, 'month');
        const activeValue = moment__default(milliseconds).startOf('day').valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment__default(selectedMilliseconds).startOf('day').valueOf();
        return {
            viewName: 'day',
            viewLabel: startOfMonth.format('MMM YYYY'),
            activeDate: activeValue,
            leftButton: {
                value: previousMonth.valueOf(),
                ariaLabel: `Go to ${previousMonth.format('MMM YYYY')}`,
                classes: {},
            },
            upButton: {
                value: startOfMonth.valueOf(),
                ariaLabel: `Go to month view`,
                classes: {},
            },
            rightButton: {
                value: nextMonth.valueOf(),
                ariaLabel: `Go to ${nextMonth.format('MMM YYYY')}`,
                classes: {},
            },
            rowLabels: columnNumbers.map((column) => moment__default().weekday(column).format('dd')),
            rows: rowNumbers.map(rowOfDays)
        };
        function rowOfDays(rowNumber) {
            const currentMoment = moment__default();
            const cells = columnNumbers.map((columnNumber) => {
                const dayMoment = moment__default(startOfView).add((rowNumber * columnNumbers.length) + columnNumber, 'days');
                return {
                    display: dayMoment.format('D'),
                    ariaLabel: dayMoment.format('ll'),
                    value: dayMoment.valueOf(),
                    classes: {
                        'dl-abdtp-active': activeValue === dayMoment.valueOf(),
                        'dl-abdtp-future': dayMoment.isAfter(endOfMonth),
                        'dl-abdtp-past': dayMoment.isBefore(startOfMonth),
                        'dl-abdtp-selected': selectedValue === dayMoment.valueOf(),
                        'dl-abdtp-now': dayMoment.isSame(currentMoment, 'day'),
                    }
                };
            });
            return { cells };
        }
    }
    /**
     * Move the active `day` one row `down` from the specified moment in time.
     *
     * Moving `down` can result in the `active` day being part of a different month than
     * the specified `fromMilliseconds`, in this case the month represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `day` model `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `day` one row `down` from the specified moment in time.
     */
    goDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(7, 'days').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `day` one row `up` from the specified moment in time.
     *
     * Moving `up` can result in the `active` day being part of a different month than
     * the specified `fromMilliseconds`, in this case the month represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `day` model `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `day` one row `up` from the specified moment in time.
     */
    goUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(7, 'days').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` day one cell `left` in the current `day` view.
     *
     * Moving `left` can result in the `active` day being part of a different month than
     * the specified `fromMilliseconds`, in this case the month represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `day` model to the `left` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `day` one cell to the `left` of the specified moment in time.
     */
    goLeft(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(1, 'day').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` day one cell `right` in the current `day` view.
     *
     * Moving `right` can result in the `active` day being part of a different month than
     * the specified `fromMilliseconds`, in this case the month represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `day` model to the `right` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `day` one cell to the `right` of the specified moment in time.
     */
    goRight(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(1, 'day').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `day` one month `down` from the specified moment in time.
     *
     * Paging `down` will result in the `active` day being part of a different month than
     * the specified `fromMilliseconds`. As a result, the month represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `day` model page `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `day` one month `down` from the specified moment in time.
     */
    pageDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(1, 'month').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `day` one month `up` from the specified moment in time.
     *
     * Paging `up` will result in the `active` day being part of a different month than
     * the specified `fromMilliseconds`. As a result, the month represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `day` model page `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `day` one month `up` from the specified moment in time.
     */
    pageUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(1, 'month').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `day` to the last day of the month.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different day than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the last day of the month will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the last cell in the view as the active `day`.
     */
    goEnd(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds)
            .endOf('month').startOf('day').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `day` to the first day of the month.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different day than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the first day of the month will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the first cell in the view as the active `day`.
     */
    goHome(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).startOf('month').valueOf(), selectedMilliseconds);
    }
}

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Default implementation for the `hour` view.
 */
class DlHourModelProvider {
    /**
     * Receives input changes detected by Angular.
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    onChanges(_changes) { }
    /**
     * Returns the `hour` model for the specified moment in `local` time with the
     * `active` hour set to the beginning of the day.
     *
     * The `hour` model represents a day (24 hours) as six rows with four columns
     * and each cell representing one-hour increments.
     *
     * The hour always starts at the beginning of the hour.
     *
     * Each cell represents a one-hour increment starting at midnight.
     *
     * @param milliseconds
     *  the moment in time from which the minute model will be created.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  the model representing the specified moment in time.
     */
    getModel(milliseconds, selectedMilliseconds) {
        const startDate = moment__default(milliseconds).startOf('day');
        const rowNumbers = [0, 1, 2, 3, 4, 5];
        const columnNumbers = [0, 1, 2, 3];
        const previousDay = moment__default(startDate).subtract(1, 'day');
        const nextDay = moment__default(startDate).add(1, 'day');
        const activeValue = moment__default(milliseconds).startOf('hour').valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment__default(selectedMilliseconds).startOf('hour').valueOf();
        return {
            viewName: 'hour',
            viewLabel: startDate.format('ll'),
            activeDate: activeValue,
            leftButton: {
                value: previousDay.valueOf(),
                ariaLabel: `Go to ${previousDay.format('ll')}`,
                classes: {},
            },
            upButton: {
                value: startDate.valueOf(),
                ariaLabel: `Go to ${startDate.format('MMM YYYY')}`,
                classes: {},
            },
            rightButton: {
                value: nextDay.valueOf(),
                ariaLabel: `Go to ${nextDay.format('ll')}`,
                classes: {},
            },
            rows: rowNumbers.map(rowOfHours)
        };
        function rowOfHours(rowNumber) {
            const currentMoment = moment__default();
            const cells = columnNumbers.map((columnNumber) => {
                const hourMoment = moment__default(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'hours');
                return {
                    display: hourMoment.format('LT'),
                    ariaLabel: hourMoment.format('LLL'),
                    value: hourMoment.valueOf(),
                    classes: {
                        'dl-abdtp-active': activeValue === hourMoment.valueOf(),
                        'dl-abdtp-selected': selectedValue === hourMoment.valueOf(),
                        'dl-abdtp-now': hourMoment.isSame(currentMoment, 'hour'),
                    }
                };
            });
            return { cells };
        }
    }
    /**
     * Move the active `hour` one row `down` from the specified moment in time.
     *
     * Moving `down` can result in the `active` hour being part of a different day than
     * the specified `fromMilliseconds`, in this case the day represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `hour` model `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `hour` one row `down` from the specified moment in time.
     */
    goDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(4, 'hour').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `hour` one row `up` from the specified moment in time.
     *
     * Moving `up` can result in the `active` hour being part of a different day than
     * the specified `fromMilliseconds`, in this case the day represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `hour` model `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `hour` one row `up` from the specified moment in time.
     */
    goUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(4, 'hour').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` hour one cell `left` in the current `hour` view.
     *
     * Moving `left` can result in the `active` hour being part of a different day than
     * the specified `fromMilliseconds`, in this case the day represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `hour` model to the `left` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `hour` one cell to the `left` of the specified moment in time.
     */
    goLeft(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(1, 'hour').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` hour one cell `right` in the current `hour` view.
     *
     * Moving `right` can result in the `active` hour being part of a different day than
     * the specified `fromMilliseconds`, in this case the day represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `hour` model to the `right` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `hour` one cell to the `right` of the specified moment in time.
     */
    goRight(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(1, 'hour').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `hour` one day `down` from the specified moment in time.
     *
     * Paging `down` will result in the `active` hour being part of a different day than
     * the specified `fromMilliseconds`. As a result, the day represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `hour` model page `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `hour` one day `down` from the specified moment in time.
     */
    pageDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(1, 'day').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `hour` one day `up` from the specified moment in time.
     *
     * Paging `up` will result in the `active` hour being part of a different day than
     * the specified `fromMilliseconds`. As a result, the day represented by the model
     * will change to show the correct year.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `hour` model page `up` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `hour` one day `up` from the specified moment in time.
     */
    pageUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(1, 'day').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `hour` to `11:00 pm` of the current day.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different day than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which `11:00 pm` will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the `11:00 pm` cell in the view as the active `hour`.
     */
    goEnd(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds)
            .endOf('day')
            .startOf('hour')
            .valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `hour` to `midnight` of the current day.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different day than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which `midnight` will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the `midnight` cell in the view as the active `hour`.
     */
    goHome(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).startOf('day').valueOf(), selectedMilliseconds);
    }
}

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Default implementation for the `minute` view.
 */
class DlMinuteModelProvider {
    constructor() {
        this.step = 5;
    }
    /**
     * Receives `minuteStep` configuration changes detected by Angular.
     *
     * Changes where the value has not changed are ignored.
     *
     * Setting `minuteStep` to `null` or `undefined` will result in a
     * minuteStep of `5`.
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    onChanges(changes) {
        const minuteStepChange = changes['minuteStep'];
        if (minuteStepChange
            && (minuteStepChange.previousValue !== minuteStepChange.currentValue)) {
            this.step = minuteStepChange.currentValue;
            if (this.step === null || this.step === undefined) {
                this.step = 5;
            }
        }
    }
    /**
     * Returns the `minute` model for the specified moment in `local` time with the
     * `active` minute set to the beginning of the hour.
     *
     * The `minute` model represents an hour (60 minutes) as three rows with four columns
     * and each cell representing 5-minute increments.
     *
     * The hour always starts at midnight.
     *
     * Each cell represents a 5-minute increment starting at midnight.
     *
     * The `active` minute will be the 5-minute increments less than or equal to the specified milliseconds.
     *
     * @param milliseconds
     *  the moment in time from which the minute model will be created.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  the model representing the specified moment in time.
     */
    getModel(milliseconds, selectedMilliseconds) {
        const startDate = moment__default(milliseconds).startOf('hour');
        const currentMilliseconds = moment__default().valueOf();
        const minuteSteps = new Array(Math.ceil(60 / this.step)).fill(0).map((zero, index) => zero + index * this.step);
        const minuteValues = minuteSteps.map((minutesToAdd) => moment__default(startDate).add(minutesToAdd, 'minutes').valueOf());
        const activeValue = moment__default(minuteValues.filter((value) => value <= milliseconds).pop()).valueOf();
        const nowValue = currentMilliseconds >= startDate.valueOf() && currentMilliseconds <= moment__default(startDate).endOf('hour').valueOf()
            ? moment__default(minuteValues.filter((value) => value <= currentMilliseconds).pop()).valueOf()
            : null;
        const previousHour = moment__default(startDate).subtract(1, 'hour');
        const nextHour = moment__default(startDate).add(1, 'hour');
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment__default(minuteValues.filter((value) => value <= selectedMilliseconds).pop()).valueOf();
        const rows = new Array(Math.ceil(minuteSteps.length / 4))
            .fill(0)
            .map((zero, index) => zero + index)
            .map((value) => {
            return { cells: minuteSteps.slice((value * 4), (value * 4) + 4).map(rowOfMinutes) };
        });
        return {
            viewName: 'minute',
            viewLabel: startDate.format('lll'),
            activeDate: activeValue,
            leftButton: {
                value: previousHour.valueOf(),
                ariaLabel: `Go to ${previousHour.format('lll')}`,
                classes: {},
            },
            upButton: {
                value: startDate.valueOf(),
                ariaLabel: `Go to ${startDate.format('ll')}`,
                classes: {},
            },
            rightButton: {
                value: nextHour.valueOf(),
                ariaLabel: `Go to ${nextHour.format('lll')}`,
                classes: {},
            },
            rows
        };
        function rowOfMinutes(stepMinutes) {
            const minuteMoment = moment__default(startDate).add(stepMinutes, 'minutes');
            return {
                display: minuteMoment.format('LT'),
                ariaLabel: minuteMoment.format('LLL'),
                value: minuteMoment.valueOf(),
                classes: {
                    'dl-abdtp-active': activeValue === minuteMoment.valueOf(),
                    'dl-abdtp-selected': selectedValue === minuteMoment.valueOf(),
                    'dl-abdtp-now': nowValue === minuteMoment.valueOf(),
                }
            };
        }
    }
    /**
     * Move the active `minute` one row `down` from the specified moment in time.
     *
     * Moving `down` can result in the `active` minute being part of a different hour than
     * the specified `fromMilliseconds`, in this case the hour represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `minute` model `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `minute` one row `down` from the specified moment in time.
     */
    goDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(this.step * 4, 'minutes').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `minute` one row `down` from the specified moment in time.
     *
     * Moving `down` can result in the `active` minute being part of a different hour than
     * the specified `fromMilliseconds`, in this case the hour represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `minute` model `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `minute` one row `down` from the specified moment in time.
     */
    goUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(this.step * 4, 'minutes').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` date one cell to `left` in the current `minute` view.
     *
     * Moving `left` can result in the `active` hour being part of a different hour than
     * the specified `fromMilliseconds`, in this case the hour represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `minute` model to the `left` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `minute` one cell to the `left` of the specified moment in time.
     */
    goLeft(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(this.step, 'minutes').valueOf(), selectedMilliseconds);
    }
    /**
     * Move `active` minute one cell to `right` in the current `minute` view.
     *
     * Moving `right` can result in the `active` hour being part of a different hour than
     * the specified `fromMilliseconds`, in this case the hour represented by the model
     * will change to show the correct hour.
     *
     * @param fromMilliseconds
     *  the moment in time from which the `minute` model to the `right` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `minute` one cell to the `right` of the specified moment in time.
     */
    goRight(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(this.step, 'minutes').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `minute` one hour `down` from the specified moment in time.
     *
     * The `active` minute will be `one (1) hour after` the specified milliseconds.
     * This moves the `active` date one `page` `down` from the current `minute` view.
     *
     * The next cell `page-down` will be in a different hour than the currently
     * displayed view and the model time range will include the new active cell.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `month` model page `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one year `down` from the specified moment in time.
     */
    pageDown(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).add(1, 'hour').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the active `minute` one hour `up` from the specified moment in time.
     *
     * The `active` minute will be `one (1) hour before` the specified milliseconds.
     * This moves the `active` date one `page` `down` from the current `minute` view.
     *
     * The next cell `page-up` will be in a different hour than the currently
     * displayed view and the model time range will include the new active cell.
     *
     * @param fromMilliseconds
     *  the moment in time from which the next `month` model page `down` will be constructed.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  model containing an `active` `month` one year `down` from the specified moment in time.
     */
    pageUp(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).subtract(1, 'hour').valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `minute` to the last cell of the current hour.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different hour than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the last cell will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the last cell in the view as the active `minute`.
     */
    goEnd(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds)
            .endOf('hour')
            .valueOf(), selectedMilliseconds);
    }
    /**
     * Move the `active` `minute` to the first cell of the current hour.
     *
     * The view or time range will not change unless the `fromMilliseconds` value
     * is in a different hour than the displayed decade.
     *
     * @param fromMilliseconds
     *  the moment in time from which the first cell will be calculated.
     * @param selectedMilliseconds
     *  the current value of the date/time picker.
     * @returns
     *  a model with the first cell in the view as the active `minute`.
     */
    goHome(fromMilliseconds, selectedMilliseconds) {
        return this.getModel(moment__default(fromMilliseconds).startOf('hour').valueOf(), selectedMilliseconds);
    }
}

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Maps key codes to the model provider function name
 * that should be called to perform the action.
 *
 * @internal
 **/
const keyCodeToModelProviderMethod = {
    'ArrowDown': 'goDown',
    'ArrowLeft': 'goLeft',
    'ArrowRight': 'goRight',
    'ArrowUp': 'goUp',
    'Down': 'goDown',
    'End': 'goEnd',
    'Home': 'goHome',
    'Left': 'goLeft',
    'PageDown': 'pageDown',
    'PageUp': 'pageUp',
    'Right': 'goRight',
    'Up': 'goUp',
    33: 'pageUp',
    34: 'pageDown',
    35: 'goEnd',
    36: 'goHome',
    37: 'goLeft',
    38: 'goUp',
    39: 'goRight',
    40: 'goDown',
};
/**
 * List of view names for the calendar.
 *
 * This list must be in order from
 * smallest increment of time to largest increment of time.
 *
 * @internal
 **/
const VIEWS = [
    'minute',
    'hour',
    'day',
    'month',
    'year'
];
/**
 * Component that provides all of the user facing functionality of the date/time picker.
 */
class DlDateTimePickerComponent {
    /**
     * Used to construct a new instance of a date/time picker.
     *
     * @param _elementRef
     *  reference to this element.
     * @param _ngZone
     *  reference to an NgZone instance used to select the active element outside of angular.
     * @param _dateAdapter
     *  date adapter for the date type in the model.
     * @param yearModelComponent
     *  provider for the year view model.
     * @param monthModelComponent
     *  provider for the month view model.
     * @param dayModelComponent
     *  provider for the day view model.
     * @param hourModelComponent
     *  provider for the hour view model.
     * @param minuteModelComponent
     *  provider for the minute view model.
     */
    constructor(_elementRef, _ngZone, _dateAdapter, yearModelComponent, monthModelComponent, dayModelComponent, hourModelComponent, minuteModelComponent) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._dateAdapter = _dateAdapter;
        this.yearModelComponent = yearModelComponent;
        this.monthModelComponent = monthModelComponent;
        this.dayModelComponent = dayModelComponent;
        this.hourModelComponent = hourModelComponent;
        this.minuteModelComponent = minuteModelComponent;
        /**
         * Change listener callback functions registered
         * via `registerOnChange`
         * @internal
         **/
        this._changed = [];
        /**
         * Maps view name to the next view (the view for the next smallest increment of time).
         * @internal
         **/
        this._nextView = {
            'year': 'month',
            'month': 'day',
            'day': 'hour',
            'hour': 'minute'
        };
        /**
         * Maps view name to the previous view (the view for the next largest increment of time).
         * @internal
         **/
        this._previousView = {
            'minute': 'hour',
            'hour': 'day',
            'day': 'month',
            'month': 'year'
        };
        /**
         * Touch listener callback functions registered
         * via `registerOnChange`
         * @internal
         **/
        this._touched = [];
        /**
         * Emits when a `change` event when date/time is selected or
         * the value of the date/time picker changes.
         **/
        this.change = new EventEmitter();
        /**
         * Specifies the classes used to display the left icon.
         *
         * This component uses OPENICONIC https://useiconic.com/open
         * by default but any icon library may be used.
         */
        this.leftIconClass = [
            'oi',
            'oi-chevron-left'
        ];
        /**
         * The highest view that the date/time picker can show.
         * Setting this to a view less than year could make it more
         * difficult for the end-user to navigate to certain dates.
         */
        this.maxView = 'year';
        /**
         * The view that will be used for date/time selection.
         *
         * The default of `minute  means that selection will not happen
         * until the end-user clicks on a cell in the minute view.
         *
         * for example, if you want the end-user to select a only day (date),
         * setting `minView` to `day` will cause selection to happen when the
         * end-user selects a cell in the day view.
         *
         * NOTE: This must be set lower than or equal to `startView'
         */
        this.minView = 'minute';
        /**
         * The number of minutes between each `.dl-abdtp-minute` button.
         *
         * Must be greater than `0` and less than `60`.
         */
        this.minuteStep = 5;
        /**
         * Specifies the classes used to display the right icon.
         *
         * This component uses OPENICONIC https://useiconic.com/open
         * by default but any icon library may be used.
         */
        this.rightIconClass = [
            'oi',
            'oi-chevron-right'
        ];
        /* tslint:disable:member-ordering */
        /**
         *  Determine whether or not the `DateButton` is selectable by the end user.
         */
        this.selectFilter = () => true;
        /**
         * The initial view that the date/time picker will show.
         * The picker will also return to this view after a date/time
         * is selected.
         *
         * NOTE: This must be set lower than or equal to `maxView'
         */
        this.startView = 'day';
        /**
         * Specifies the classes used to display the up icon.
         *
         * This component uses OPENICONIC https://useiconic.com/open
         * by default but any icon library may be used.
         */
        this.upIconClass = [
            'oi',
            'oi-chevron-top'
        ];
        this._viewToModelProvider = {
            year: yearModelComponent,
            month: monthModelComponent,
            day: dayModelComponent,
            hour: hourModelComponent,
            minute: minuteModelComponent,
        };
    }
    /* tslint:enable:member-ordering */
    /**
     * Set's the model for the current view after applying the selection filter.
     *
     * @internal
     **/
    set model(model) {
        this._model = this.applySelectFilter(model);
    }
    /**
     * Returns `D` value of the date/time picker or undefined/null if no value is set.
     **/
    get value() {
        return this._value;
    }
    /**
     * Sets value of the date/time picker and emits a change event if the
     * new value is different from the previous value.
     **/
    set value(value) {
        if (this._value !== value) {
            this._value = value;
            this.model = this._viewToModelProvider[this._model.viewName].getModel(this.getStartDate(), this.valueOf);
            this._changed.forEach(f => f(value));
            this.change.emit(new DlDateTimePickerChange(value));
        }
    }
    /**
     * Returns `milliseconds` value of the date/time picker or undefined/null if no value is set.
     **/
    get valueOf() {
        return this._dateAdapter.toMilliseconds(this._value);
    }
    /**
     * Applies the `selectionFilter` by adding the `dl-abdtp-disabled`
     * class to any `DateButton` where `selectFilter` returned false.
     *
     * @param model
     *  the new model
     *
     * @returns
     *  the supplied model with zero or more `DateButton`'s
     *  having the `dl-abdtp-disabled` class set to `true` if the
     *  selection for that date should be disabled.
     *
     * @internal
     */
    applySelectFilter(model) {
        if (this.selectFilter) {
            model.rows = model.rows.map((row) => {
                row.cells.map((dateButton) => {
                    const disabled = !this.selectFilter(dateButton, model.viewName);
                    dateButton.classes['dl-abdtp-disabled'] = disabled;
                    if (disabled) {
                        dateButton.classes['aria-disabled'] = true;
                    }
                    return dateButton;
                });
                return row;
            });
        }
        return model;
    }
    /**
     * Focuses the `.dl-abdtp-active` cell after the microtask queue is empty.
     * @internal
     **/
    focusActiveCell() {
        this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                this._elementRef.nativeElement.querySelector('.dl-abdtp-active').focus();
            });
        });
    }
    /**
     * Determines the start date for the picker.
     * @internal
     **/
    getStartDate() {
        if (hasValue(this._value)) {
            return this._dateAdapter.toMilliseconds(this._value);
        }
        if (hasValue(this.startDate)) {
            return this.startDate;
        }
        return moment__default().valueOf();
    }
    /**
     * Determine the start view for the picker
     * @returns
     *  the largest time increment view between the `minView` or `minute` view and the `startView` or `day` view.
     */
    getStartView() {
        const startIndex = Math.max(VIEWS.indexOf(this.minView || 'minute'), VIEWS.indexOf(this.startView || 'day'));
        return VIEWS[startIndex];
    }
    /**
     * Calls all registered `touch` callback functions.
     * @internal
     **/
    onTouch() {
        this._touched.forEach((onTouched) => onTouched());
    }
    /**
     * Receives configuration changes detected by Angular and passes the changes on
     * to the model providers so the provider is aware of any necessary configuration
     * changes (i.e. minuteStep)
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    ngOnChanges(changes) {
        Object.values(this._viewToModelProvider).forEach((provider) => provider.onChanges(changes));
        if (this._model) { // only update the model after ngOnInit has set it the first time.
            this.model = this._viewToModelProvider[this._model.viewName].getModel(this._model.activeDate, this.valueOf);
        }
    }
    /**
     * Sets the initial model.
     *
     * @internal
     **/
    ngOnInit() {
        this.model = this._viewToModelProvider[this.getStartView()].getModel(this.getStartDate(), this.valueOf);
    }
    /**
     * Handles click (and enter & space key down) events on the date elements.
     *
     * If the current view is the minimum view then the date value is selected
     * and the picker returns to the start view.
     *
     * Otherwise the picker displays the next view with the next
     * smallest time increment.
     *
     * @internal
     **/
    _onDateClick(dateButton) {
        if (dateButton.classes['dl-abdtp-disabled']) {
            return;
        }
        let nextView = this._nextView[this._model.viewName];
        if ((this.minView || 'minute') === this._model.viewName) {
            this.value = this._dateAdapter.fromMilliseconds(dateButton.value);
            nextView = this.startView;
        }
        this.model = this._viewToModelProvider[nextView].getModel(dateButton.value, this.valueOf);
        this.onTouch();
    }
    /**
     * Handles click (and enter & space key down) events on the left button.
     *
     * Changes the displayed time range of the picker to the previous time range.
     * For example, in year view, the previous decade is displayed.
     *
     * @internal
     **/
    _onLeftClick() {
        this.model = this._viewToModelProvider[this._model.viewName].getModel(this._model.leftButton.value, this.valueOf);
        this.onTouch();
    }
    /**
     * Handles click (and enter & space key down) events on the up button.
     *
     * Changes the view of the picker to the next largest time increment.
     * For example, in day view, the next view displayed will be month view.
     *
     * @internal
     **/
    _onUpClick() {
        this.model = this._viewToModelProvider[this._previousView[this._model.viewName]].getModel(this._model.upButton.value, this.valueOf);
    }
    /**
     * Handles click (and enter & space key down) events on the right button.
     *
     * Changes the displayed time range of the picker to the next time range.
     * For example, in year view, the next decade is displayed.
     *
     * @internal
     **/
    _onRightClick() {
        this.model = this._viewToModelProvider[this._model.viewName].getModel(this._model.rightButton.value, this.valueOf);
        this.onTouch();
    }
    /**
     * Handles various key down events to move the `active date` around the calendar.
     *
     * @internal
     **/
    _handleKeyDown($event) {
        const functionName = keyCodeToModelProviderMethod[$event.key];
        if (functionName) {
            const modelProvider = this._viewToModelProvider[this._model.viewName];
            this.model = modelProvider[functionName](this._model.activeDate, this.valueOf);
            this.focusActiveCell();
            // Prevent unexpected default actions such as form submission.
            $event.preventDefault();
        }
    }
    /**
     * Implements ControlValueAccessor.registerOnChange to register change listeners.
     * @internal
     **/
    registerOnChange(fn) {
        this._changed.push(fn);
    }
    /**
     * Implements ControlValueAccessor.registerOnTouched to register touch listeners.
     * @internal
     **/
    registerOnTouched(fn) {
        this._touched.push(fn);
    }
    /**
     * Implements ControlValueAccessor.writeValue to store the value from the model.
     * @internal
     **/
    writeValue(value) {
        this.value = value;
    }
}
DlDateTimePickerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DlDateAdapter }, { token: DlYearModelProvider }, { token: DlMonthModelProvider }, { token: DlDayModelProvider }, { token: DlHourModelProvider }, { token: DlMinuteModelProvider }], target: i0.ɵɵFactoryTarget.Component });
DlDateTimePickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.4.0", type: DlDateTimePickerComponent, selector: "dl-date-time-picker", inputs: { leftIconClass: "leftIconClass", maxView: "maxView", minView: "minView", minuteStep: "minuteStep", rightIconClass: "rightIconClass", selectFilter: "selectFilter", startDate: "startDate", startView: "startView", upIconClass: "upIconClass" }, outputs: { change: "change" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DlDateTimePickerComponent,
            multi: true
        }
    ], usesOnChanges: true, ngImport: i0, template: "<div class=\"text-center dl-abdtp-{{_model.viewName}}-view\" [attr.data-dl-abdtp-view]=\"_model.viewName\">\r\n  <div class=\"row align-items-center no-gutters\">\r\n    <button class=\"col dl-abdtp-left-button align-items-center\"\r\n            type=\"button\"\r\n            [attr.aria-label]=\"_model.leftButton.ariaLabel\"\r\n            [attr.dl-abdtp-value]=\"_model.leftButton.value\"\r\n            [attr.title]=\"_model.leftButton.ariaLabel\"\r\n            (click)=\"_onLeftClick()\"\r\n    ><span class=\"left-icon\" [ngClass]=\"leftIconClass\"></span>\r\n    </button>\r\n\r\n    <div *ngIf=\"_model.viewName === (this.maxView || 'year'); then maxViewLabel else defaultViewLabel;\"></div>\r\n\r\n    <button class=\"col dl-abdtp-right-button\"\r\n            type=\"button\"\r\n            [attr.aria-label]=\"_model.rightButton.ariaLabel\"\r\n            [attr.dl-abdtp-value]=\"_model.rightButton.value\"\r\n            [attr.title]=\"_model.rightButton.ariaLabel\"\r\n            (click)=\"_onRightClick()\"\r\n    ><span class=\"right-icon\" [ngClass]=\"rightIconClass\"></span>\r\n    </button>\r\n  </div>\r\n  <div (keydown)=\"_handleKeyDown($event)\">\r\n    <div *ngIf=\"_model.rowLabels?.length\" class=\"row no-gutters\">\r\n      <div *ngFor=\"let label of _model.rowLabels\"\r\n           class=\"col align-items-center no-gutters dl-abdtp-col-label\">{{label}}</div>\r\n    </div>\r\n    <div *ngFor=\"let row of _model.rows\" class=\"row align-items-center no-gutters\">\r\n      <div *ngFor=\"let cell of row.cells\"\r\n           role=\"gridcell\"\r\n           class=\"col dl-abdtp-date-button dl-abdtp-{{_model.viewName}}\"\r\n           [ngClass]=\"cell.classes\"\r\n           [attr.aria-label]=\"cell.ariaLabel\"\r\n           [attr.aria-disabled]=\"cell.classes['dl-abdtp-disabled']\"\r\n           [attr.dl-abdtp-value]=\"cell.value\"\r\n           [attr.tabindex]=\"cell.classes['dl-abdtp-active'] ? 0 : -1\"\r\n           (click)=\"_onDateClick(cell)\"\r\n           (keydown.space)=\"_onDateClick(cell)\"\r\n           (keydown.enter)=\"_onDateClick(cell)\"\r\n      >{{cell.display}}</div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<ng-template #maxViewLabel>\r\n  <div class=\"col-10 dl-abdtp-view-label\">{{_model.viewLabel}}</div>\r\n</ng-template>\r\n<ng-template #defaultViewLabel>\r\n  <button class=\"col-10 dl-abdtp-view-label dl-abdtp-up-button\"\r\n          type=\"button\"\r\n          [attr.aria-label]=\"_model.upButton.ariaLabel\"\r\n          [attr.dl-abdtp-value]=\"_model.upButton.value\"\r\n          [attr.title]=\"_model.upButton.ariaLabel\"\r\n          (click)=\"_onUpClick()\"\r\n          [ngClass]=\"_model.upButton.classes\"\r\n  >{{_model.viewLabel}}&nbsp;<span class=\"up-icon\" [ngClass]=\"upIconClass\"></span>\r\n  </button>\r\n</ng-template>\r\n", styles: [":host{-webkit-user-select:none;user-select:none}.dl-abdtp-col-label,.dl-abdtp-view-label{font-weight:700}.dl-abdtp-view-label,.dl-abdtp-left-button,.dl-abdtp-right-button,.dl-abdtp-date-button{padding:5px;border-radius:999px;cursor:pointer;color:#000000de;outline:0}.dl-abdtp-left-button,.dl-abdtp-up-button,.dl-abdtp-right-button,.dl-abdtp-date-button{border-width:0}.dl-abdtp-active:focus,.dl-abdtp-date-button:focus,.dl-abdtp-date-button:hover,.dl-abdtp-left-button:focus,.dl-abdtp-left-button:hover,.dl-abdtp-right-button:focus,.dl-abdtp-right-button:hover,.dl-abdtp-up-button:focus,.dl-abdtp-up-button:hover,.dl-abdtp-view-label:focus{background:rgba(0,0,0,.04)}.dl-abdtp-past,.dl-abdtp-future{color:#0000000a}.dl-abdtp-now,.dl-abdtp-now:hover,.dl-abdtp-now.disabled,.dl-abdtp-now.disabled:hover{border-width:1px;border-style:solid;border-radius:999px;border-color:#00000040}.dl-abdtp-selected{color:#fff;background:rgba(0,82,204,.75)}.dl-abdtp-selected:focus,.dl-abdtp-selected:hover{background:#0052cc}.dl-abdtp-disabled{cursor:default;color:#00000040}\n"], directives: [{ type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i7.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: DlDateTimePickerComponent,
                            multi: true
                        }
                    ], selector: 'dl-date-time-picker', template: "<div class=\"text-center dl-abdtp-{{_model.viewName}}-view\" [attr.data-dl-abdtp-view]=\"_model.viewName\">\r\n  <div class=\"row align-items-center no-gutters\">\r\n    <button class=\"col dl-abdtp-left-button align-items-center\"\r\n            type=\"button\"\r\n            [attr.aria-label]=\"_model.leftButton.ariaLabel\"\r\n            [attr.dl-abdtp-value]=\"_model.leftButton.value\"\r\n            [attr.title]=\"_model.leftButton.ariaLabel\"\r\n            (click)=\"_onLeftClick()\"\r\n    ><span class=\"left-icon\" [ngClass]=\"leftIconClass\"></span>\r\n    </button>\r\n\r\n    <div *ngIf=\"_model.viewName === (this.maxView || 'year'); then maxViewLabel else defaultViewLabel;\"></div>\r\n\r\n    <button class=\"col dl-abdtp-right-button\"\r\n            type=\"button\"\r\n            [attr.aria-label]=\"_model.rightButton.ariaLabel\"\r\n            [attr.dl-abdtp-value]=\"_model.rightButton.value\"\r\n            [attr.title]=\"_model.rightButton.ariaLabel\"\r\n            (click)=\"_onRightClick()\"\r\n    ><span class=\"right-icon\" [ngClass]=\"rightIconClass\"></span>\r\n    </button>\r\n  </div>\r\n  <div (keydown)=\"_handleKeyDown($event)\">\r\n    <div *ngIf=\"_model.rowLabels?.length\" class=\"row no-gutters\">\r\n      <div *ngFor=\"let label of _model.rowLabels\"\r\n           class=\"col align-items-center no-gutters dl-abdtp-col-label\">{{label}}</div>\r\n    </div>\r\n    <div *ngFor=\"let row of _model.rows\" class=\"row align-items-center no-gutters\">\r\n      <div *ngFor=\"let cell of row.cells\"\r\n           role=\"gridcell\"\r\n           class=\"col dl-abdtp-date-button dl-abdtp-{{_model.viewName}}\"\r\n           [ngClass]=\"cell.classes\"\r\n           [attr.aria-label]=\"cell.ariaLabel\"\r\n           [attr.aria-disabled]=\"cell.classes['dl-abdtp-disabled']\"\r\n           [attr.dl-abdtp-value]=\"cell.value\"\r\n           [attr.tabindex]=\"cell.classes['dl-abdtp-active'] ? 0 : -1\"\r\n           (click)=\"_onDateClick(cell)\"\r\n           (keydown.space)=\"_onDateClick(cell)\"\r\n           (keydown.enter)=\"_onDateClick(cell)\"\r\n      >{{cell.display}}</div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<ng-template #maxViewLabel>\r\n  <div class=\"col-10 dl-abdtp-view-label\">{{_model.viewLabel}}</div>\r\n</ng-template>\r\n<ng-template #defaultViewLabel>\r\n  <button class=\"col-10 dl-abdtp-view-label dl-abdtp-up-button\"\r\n          type=\"button\"\r\n          [attr.aria-label]=\"_model.upButton.ariaLabel\"\r\n          [attr.dl-abdtp-value]=\"_model.upButton.value\"\r\n          [attr.title]=\"_model.upButton.ariaLabel\"\r\n          (click)=\"_onUpClick()\"\r\n          [ngClass]=\"_model.upButton.classes\"\r\n  >{{_model.viewLabel}}&nbsp;<span class=\"up-icon\" [ngClass]=\"upIconClass\"></span>\r\n  </button>\r\n</ng-template>\r\n", styles: [":host{-webkit-user-select:none;user-select:none}.dl-abdtp-col-label,.dl-abdtp-view-label{font-weight:700}.dl-abdtp-view-label,.dl-abdtp-left-button,.dl-abdtp-right-button,.dl-abdtp-date-button{padding:5px;border-radius:999px;cursor:pointer;color:#000000de;outline:0}.dl-abdtp-left-button,.dl-abdtp-up-button,.dl-abdtp-right-button,.dl-abdtp-date-button{border-width:0}.dl-abdtp-active:focus,.dl-abdtp-date-button:focus,.dl-abdtp-date-button:hover,.dl-abdtp-left-button:focus,.dl-abdtp-left-button:hover,.dl-abdtp-right-button:focus,.dl-abdtp-right-button:hover,.dl-abdtp-up-button:focus,.dl-abdtp-up-button:hover,.dl-abdtp-view-label:focus{background:rgba(0,0,0,.04)}.dl-abdtp-past,.dl-abdtp-future{color:#0000000a}.dl-abdtp-now,.dl-abdtp-now:hover,.dl-abdtp-now.disabled,.dl-abdtp-now.disabled:hover{border-width:1px;border-style:solid;border-radius:999px;border-color:#00000040}.dl-abdtp-selected{color:#fff;background:rgba(0,82,204,.75)}.dl-abdtp-selected:focus,.dl-abdtp-selected:hover{background:#0052cc}.dl-abdtp-disabled{cursor:default;color:#00000040}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DlDateAdapter }, { type: DlYearModelProvider }, { type: DlMonthModelProvider }, { type: DlDayModelProvider }, { type: DlHourModelProvider }, { type: DlMinuteModelProvider }]; }, propDecorators: { change: [{
                type: Output
            }], leftIconClass: [{
                type: Input
            }], maxView: [{
                type: Input
            }], minView: [{
                type: Input
            }], minuteStep: [{
                type: Input
            }], rightIconClass: [{
                type: Input
            }], selectFilter: [{
                type: Input
            }], startDate: [{
                type: Input
            }], startView: [{
                type: Input
            }], upIconClass: [{
                type: Input
            }] } });
/** @internal */
function hasValue(value) {
    return (typeof value !== 'undefined') && (value !== null);
}

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Import this module to supply your own `DateAdapter` provider.
 * @internal
 **/
class DlDateTimePickerModule {
}
DlDateTimePickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimePickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, declarations: [DlDateTimePickerComponent], imports: [CommonModule], exports: [DlDateTimePickerComponent] });
DlDateTimePickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, providers: [
        DlYearModelProvider,
        DlMonthModelProvider,
        DlDayModelProvider,
        DlHourModelProvider,
        DlMinuteModelProvider
    ], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DlDateTimePickerComponent],
                    imports: [CommonModule],
                    exports: [DlDateTimePickerComponent],
                    providers: [
                        DlYearModelProvider,
                        DlMonthModelProvider,
                        DlDayModelProvider,
                        DlHourModelProvider,
                        DlMinuteModelProvider
                    ],
                }]
        }] });

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DL_DATE_TIME_DISPLAY_FORMAT, DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT, DL_DATE_TIME_INPUT_FORMATS, DL_DATE_TIME_INPUT_FORMATS_DEFAULT, DL_DATE_TIME_MODEL_FORMAT, DL_DATE_TIME_MODEL_FORMAT_DEFAULT, DlDateAdapter, DlDateAdapterMoment, DlDateAdapterNative, DlDateAdapterNumber, DlDateAdapterString, DlDateTimeCoreModule, DlDateTimeDateModule, DlDateTimeInputChange, DlDateTimeInputDirective, DlDateTimeInputModule, DlDateTimeMomentModule, DlDateTimeNumberModule, DlDateTimePickerChange, DlDateTimePickerComponent, DlDateTimePickerModule, DlDateTimeStringModule, DlDayModelProvider, DlHourModelProvider, DlMinuteModelProvider, DlMonthModelProvider, DlYearModelProvider };
//# sourceMappingURL=angular-bootstrap-datetimepicker.mjs.map
