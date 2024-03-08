/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';
import { take } from 'rxjs/operators';
import { DlDateTimePickerChange } from './dl-date-time-picker-change';
import * as i0 from "@angular/core";
import * as i1 from "../core/public-api";
import * as i2 from "./dl-model-provider-year";
import * as i3 from "./dl-model-provider-month";
import * as i4 from "./dl-model-provider-day";
import * as i5 from "./dl-model-provider-hour";
import * as i6 from "./dl-model-provider-minute";
import * as i7 from "@angular/common";
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
export class DlDateTimePickerComponent {
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
        return moment().valueOf();
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
DlDateTimePickerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.DlDateAdapter }, { token: i2.DlYearModelProvider }, { token: i3.DlMonthModelProvider }, { token: i4.DlDayModelProvider }, { token: i5.DlHourModelProvider }, { token: i6.DlMinuteModelProvider }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.DlDateAdapter }, { type: i2.DlYearModelProvider }, { type: i3.DlMonthModelProvider }, { type: i4.DlDayModelProvider }, { type: i5.DlHourModelProvider }, { type: i6.DlMinuteModelProvider }]; }, propDecorators: { change: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RsLWRhdGUtdGltZS1waWNrZXIvZGwtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi9zcmMvbGliL2RsLWRhdGUtdGltZS1waWNrZXIvZGwtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsWUFBWSxFQUNaLEtBQUssRUFJTCxNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sOEJBQThCLENBQUM7Ozs7Ozs7OztBQVVwRTs7Ozs7SUFLSTtBQUVKLE1BQU0sNEJBQTRCLEdBQUc7SUFDbkMsV0FBVyxFQUFFLFFBQVE7SUFDckIsV0FBVyxFQUFFLFFBQVE7SUFDckIsWUFBWSxFQUFFLFNBQVM7SUFDdkIsU0FBUyxFQUFFLE1BQU07SUFDakIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsS0FBSyxFQUFFLE9BQU87SUFDZCxNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixVQUFVLEVBQUUsVUFBVTtJQUN0QixRQUFRLEVBQUUsUUFBUTtJQUNsQixPQUFPLEVBQUUsU0FBUztJQUNsQixJQUFJLEVBQUUsTUFBTTtJQUNaLEVBQUUsRUFBRSxRQUFRO0lBQ1osRUFBRSxFQUFFLFVBQVU7SUFDZCxFQUFFLEVBQUUsT0FBTztJQUNYLEVBQUUsRUFBRSxRQUFRO0lBQ1osRUFB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QkFBeUI7a0JBZHJDLFNBQVM7c0NBQ1MsdUJBQXVCLENBQUMsTUFBTSx1QkFDMUIsS0FBSyxhQUNmO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsMkJBQTJCOzRCQUN0QyxLQUFLLEVBQUUsSUFBSTt5QkFDWjtxQkFDRixZQUNTLHFCQUFxQjs4VEFpRXRCLE1BQU07c0JBRGQsTUFBTTtnQkFTUCxhQUFhO3NCQURaLEtBQUs7Z0JBV04sT0FBTztzQkFETixLQUFLO2dCQWVOLE9BQU87c0JBRE4sS0FBSztnQkFRTixVQUFVO3NCQURULEtBQUs7Z0JBU04sY0FBYztzQkFEYixLQUFLO2dCQVdOLFlBQVk7c0JBRFgsS0FBSztnQkFPTixTQUFTO3NCQURSLEtBQUs7Z0JBV04sU0FBUztzQkFEUixLQUFLO2dCQVVOLFdBQVc7c0JBRFYsS0FBSzs7QUFvU1IsZ0JBQWdCO0FBQ2hCLFNBQVMsUUFBUSxDQUFDLEtBQVU7SUFDMUIsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQzVELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCBEYWxlIExvdHRzIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqIGh0dHA6Ly93d3cuZGFsZWxvdHRzLmNvbVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxyXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9kYWxlbG90dHMvYW5ndWxhci1ib290c3RyYXAtZGF0ZXRpbWVwaWNrZXIvYmxvYi9tYXN0ZXIvTElDRU5TRVxyXG4gKi9cclxuXHJcbmltcG9ydCB7XHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE5nWm9uZSxcclxuICBPbkNoYW5nZXMsXHJcbiAgT25Jbml0LFxyXG4gIE91dHB1dCxcclxuICBTaW1wbGVDaGFuZ2VzXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge0RsRGF0ZUFkYXB0ZXJ9IGZyb20gJy4uL2NvcmUvcHVibGljLWFwaSc7XHJcbmltcG9ydCB7RGxEYXRlVGltZVBpY2tlckNoYW5nZX0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtcGlja2VyLWNoYW5nZSc7XHJcbmltcG9ydCB7RGF0ZUJ1dHRvbn0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtcGlja2VyLWRhdGUtYnV0dG9uJztcclxuaW1wb3J0IHtEbERhdGVUaW1lUGlja2VyTW9kZWx9IGZyb20gJy4vZGwtZGF0ZS10aW1lLXBpY2tlci1tb2RlbCc7XHJcbmltcG9ydCB7RGxNb2RlbFByb3ZpZGVyfSBmcm9tICcuL2RsLW1vZGVsLXByb3ZpZGVyJztcclxuaW1wb3J0IHtEbERheU1vZGVsUHJvdmlkZXJ9IGZyb20gJy4vZGwtbW9kZWwtcHJvdmlkZXItZGF5JztcclxuaW1wb3J0IHtEbEhvdXJNb2RlbFByb3ZpZGVyfSBmcm9tICcuL2RsLW1vZGVsLXByb3ZpZGVyLWhvdXInO1xyXG5pbXBvcnQge0RsTWludXRlTW9kZWxQcm92aWRlcn0gZnJvbSAnLi9kbC1tb2RlbC1wcm92aWRlci1taW51dGUnO1xyXG5pbXBvcnQge0RsTW9udGhNb2RlbFByb3ZpZGVyfSBmcm9tICcuL2RsLW1vZGVsLXByb3ZpZGVyLW1vbnRoJztcclxuaW1wb3J0IHtEbFllYXJNb2RlbFByb3ZpZGVyfSBmcm9tICcuL2RsLW1vZGVsLXByb3ZpZGVyLXllYXInO1xyXG5cclxuLyoqXHJcbiAqIE1hcHMga2V5IGNvZGVzIHRvIHRoZSBtb2RlbCBwcm92aWRlciBmdW5jdGlvbiBuYW1lXHJcbiAqIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24uXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKiovXHJcblxyXG5jb25zdCBrZXlDb2RlVG9Nb2RlbFByb3ZpZGVyTWV0aG9kID0ge1xyXG4gICdBcnJvd0Rvd24nOiAnZ29Eb3duJyxcclxuICAnQXJyb3dMZWZ0JzogJ2dvTGVmdCcsXHJcbiAgJ0Fycm93UmlnaHQnOiAnZ29SaWdodCcsXHJcbiAgJ0Fycm93VXAnOiAnZ29VcCcsXHJcbiAgJ0Rvd24nOiAnZ29Eb3duJyxcclxuICAnRW5kJzogJ2dvRW5kJyxcclxuICAnSG9tZSc6ICdnb0hvbWUnLFxyXG4gICdMZWZ0JzogJ2dvTGVmdCcsXHJcbiAgJ1BhZ2VEb3duJzogJ3BhZ2VEb3duJyxcclxuICAnUGFnZVVwJzogJ3BhZ2VVcCcsXHJcbiAgJ1JpZ2h0JzogJ2dvUmlnaHQnLFxyXG4gICdVcCc6ICdnb1VwJyxcclxuICAzMzogJ3BhZ2VVcCcsXHJcbiAgMzQ6ICdwYWdlRG93bicsXHJcbiAgMzU6ICdnb0VuZCcsXHJcbiAgMzY6ICdnb0hvbWUnLFxyXG4gIDM3OiAnZ29MZWZ0JyxcclxuICAzODogJ2dvVXAnLFxyXG4gIDM5OiAnZ29SaWdodCcsXHJcbiAgNDA6ICdnb0Rvd24nLFxyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBMaXN0IG9mIHZpZXcgbmFtZXMgZm9yIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogVGhpcyBsaXN0IG11c3QgYmUgaW4gb3JkZXIgZnJvbVxyXG4gKiBzbWFsbGVzdCBpbmNyZW1lbnQgb2YgdGltZSB0byBsYXJnZXN0IGluY3JlbWVudCBvZiB0aW1lLlxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICoqL1xyXG5jb25zdCBWSUVXUyA9IFtcclxuICAnbWludXRlJyxcclxuICAnaG91cicsXHJcbiAgJ2RheScsXHJcbiAgJ21vbnRoJyxcclxuICAneWVhcidcclxuXTtcclxuXHJcbi8qKlxyXG4gKiBDb21wb25lbnQgdGhhdCBwcm92aWRlcyBhbGwgb2YgdGhlIHVzZXIgZmFjaW5nIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAqL1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICB1c2VFeGlzdGluZzogRGxEYXRlVGltZVBpY2tlckNvbXBvbmVudCxcclxuICAgICAgbXVsdGk6IHRydWVcclxuICAgIH1cclxuICBdLFxyXG4gIHNlbGVjdG9yOiAnZGwtZGF0ZS10aW1lLXBpY2tlcicsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGwtZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQuc2NzcyddLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kbC1kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIERsRGF0ZVRpbWVQaWNrZXJDb21wb25lbnQ8RD4gaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG5cclxuICAvKipcclxuICAgKiBDaGFuZ2UgbGlzdGVuZXIgY2FsbGJhY2sgZnVuY3Rpb25zIHJlZ2lzdGVyZWRcclxuICAgKiB2aWEgYHJlZ2lzdGVyT25DaGFuZ2VgXHJcbiAgICogQGludGVybmFsXHJcbiAgICoqL1xyXG4gIHByaXZhdGUgX2NoYW5nZWQ6ICgodmFsdWU6IEQpID0+IHZvaWQpW10gPSBbXTtcclxuICAvKipcclxuICAgKiBNb2RlbCBmb3IgdGhlIGN1cnJlbnQgdmlldy5cclxuICAgKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBfbW9kZWw6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbDtcclxuICAvKipcclxuICAgKiBNYXBzIHZpZXcgbmFtZSB0byB0aGUgbmV4dCB2aWV3ICh0aGUgdmlldyBmb3IgdGhlIG5leHQgc21hbGxlc3QgaW5jcmVtZW50IG9mIHRpbWUpLlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBwcml2YXRlIF9uZXh0VmlldyA9IHtcclxuICAgICd5ZWFyJzogJ21vbnRoJyxcclxuICAgICdtb250aCc6ICdkYXknLFxyXG4gICAgJ2RheSc6ICdob3VyJyxcclxuICAgICdob3VyJzogJ21pbnV0ZSdcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIE1hcHMgdmlldyBuYW1lIHRvIHRoZSBwcmV2aW91cyB2aWV3ICh0aGUgdmlldyBmb3IgdGhlIG5leHQgbGFyZ2VzdCBpbmNyZW1lbnQgb2YgdGltZSkuXHJcbiAgICogQGludGVybmFsXHJcbiAgICoqL1xyXG4gIHByaXZhdGUgX3ByZXZpb3VzVmlldyA9IHtcclxuICAgICdtaW51dGUnOiAnaG91cicsXHJcbiAgICAnaG91cic6ICdkYXknLFxyXG4gICAgJ2RheSc6ICdtb250aCcsXHJcbiAgICAnbW9udGgnOiAneWVhcidcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIFRvdWNoIGxpc3RlbmVyIGNhbGxiYWNrIGZ1bmN0aW9ucyByZWdpc3RlcmVkXHJcbiAgICogdmlhIGByZWdpc3Rlck9uQ2hhbmdlYFxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBwcml2YXRlIF90b3VjaGVkOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xyXG4gIC8qKlxyXG4gICAqIFN0b3JlcyB0aGUgc2VsZWN0ZWQgdmFsdWUgZm9yIHRoaXMgcGlja2VyLlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBwcml2YXRlIF92YWx1ZTogRDtcclxuICAvKipcclxuICAgKiBNYXBzIHZpZXcgbmFtZSB0byB0aGUgbW9kZWwgcHJvdmlkZXIgZm9yIHRoYXQgdmlldy5cclxuICAgKiBAaW50ZXJuYWxcclxuICAgKiovXHJcbiAgcHJpdmF0ZSByZWFkb25seSBfdmlld1RvTW9kZWxQcm92aWRlcjoge1xyXG4gICAgeWVhcjogRGxNb2RlbFByb3ZpZGVyO1xyXG4gICAgbW9udGg6IERsTW9kZWxQcm92aWRlcjtcclxuICAgIGRheTogRGxNb2RlbFByb3ZpZGVyO1xyXG4gICAgaG91cjogRGxNb2RlbFByb3ZpZGVyO1xyXG4gICAgbWludXRlOiBEbE1vZGVsUHJvdmlkZXI7XHJcbiAgfTtcclxuICAvKipcclxuICAgKiBFbWl0cyB3aGVuIGEgYGNoYW5nZWAgZXZlbnQgd2hlbiBkYXRlL3RpbWUgaXMgc2VsZWN0ZWQgb3JcclxuICAgKiB0aGUgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIgY2hhbmdlcy5cclxuICAgKiovXHJcbiAgQE91dHB1dCgpIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSAgQGFuZ3VsYXItZXNsaW50L25vLW91dHB1dC1uYXRpdmUgKi9cclxuICByZWFkb25seSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPERsRGF0ZVRpbWVQaWNrZXJDaGFuZ2U8RD4+KCk7XHJcbiAgLyoqXHJcbiAgICogU3BlY2lmaWVzIHRoZSBjbGFzc2VzIHVzZWQgdG8gZGlzcGxheSB0aGUgbGVmdCBpY29uLlxyXG4gICAqXHJcbiAgICogVGhpcyBjb21wb25lbnQgdXNlcyBPUEVOSUNPTklDIGh0dHBzOi8vdXNlaWNvbmljLmNvbS9vcGVuXHJcbiAgICogYnkgZGVmYXVsdCBidXQgYW55IGljb24gbGlicmFyeSBtYXkgYmUgdXNlZC5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIGxlZnRJY29uQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7fSA9IFtcclxuICAgICdvaScsXHJcbiAgICAnb2ktY2hldnJvbi1sZWZ0J1xyXG4gIF07XHJcbiAgLyoqXHJcbiAgICogVGhlIGhpZ2hlc3QgdmlldyB0aGF0IHRoZSBkYXRlL3RpbWUgcGlja2VyIGNhbiBzaG93LlxyXG4gICAqIFNldHRpbmcgdGhpcyB0byBhIHZpZXcgbGVzcyB0aGFuIHllYXIgY291bGQgbWFrZSBpdCBtb3JlXHJcbiAgICogZGlmZmljdWx0IGZvciB0aGUgZW5kLXVzZXIgdG8gbmF2aWdhdGUgdG8gY2VydGFpbiBkYXRlcy5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIG1heFZpZXc6ICd5ZWFyJyB8ICdtb250aCcgfCAnZGF5JyB8ICdob3VyJyB8ICdtaW51dGUnID0gJ3llYXInO1xyXG4gIC8qKlxyXG4gICAqIFRoZSB2aWV3IHRoYXQgd2lsbCBiZSB1c2VkIGZvciBkYXRlL3RpbWUgc2VsZWN0aW9uLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgb2YgYG1pbnV0ZSAgbWVhbnMgdGhhdCBzZWxlY3Rpb24gd2lsbCBub3QgaGFwcGVuXHJcbiAgICogdW50aWwgdGhlIGVuZC11c2VyIGNsaWNrcyBvbiBhIGNlbGwgaW4gdGhlIG1pbnV0ZSB2aWV3LlxyXG4gICAqXHJcbiAgICogZm9yIGV4YW1wbGUsIGlmIHlvdSB3YW50IHRoZSBlbmQtdXNlciB0byBzZWxlY3QgYSBvbmx5IGRheSAoZGF0ZSksXHJcbiAgICogc2V0dGluZyBgbWluVmlld2AgdG8gYGRheWAgd2lsbCBjYXVzZSBzZWxlY3Rpb24gdG8gaGFwcGVuIHdoZW4gdGhlXHJcbiAgICogZW5kLXVzZXIgc2VsZWN0cyBhIGNlbGwgaW4gdGhlIGRheSB2aWV3LlxyXG4gICAqXHJcbiAgICogTk9URTogVGhpcyBtdXN0IGJlIHNldCBsb3dlciB0aGFuIG9yIGVxdWFsIHRvIGBzdGFydFZpZXcnXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBtaW5WaWV3OiAneWVhcicgfCAnbW9udGgnIHwgJ2RheScgfCAnaG91cicgfCAnbWludXRlJyA9ICdtaW51dGUnO1xyXG4gIC8qKlxyXG4gICAqIFRoZSBudW1iZXIgb2YgbWludXRlcyBiZXR3ZWVuIGVhY2ggYC5kbC1hYmR0cC1taW51dGVgIGJ1dHRvbi5cclxuICAgKlxyXG4gICAqIE11c3QgYmUgZ3JlYXRlciB0aGFuIGAwYCBhbmQgbGVzcyB0aGFuIGA2MGAuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBtaW51dGVTdGVwID0gNTtcclxuICAvKipcclxuICAgKiBTcGVjaWZpZXMgdGhlIGNsYXNzZXMgdXNlZCB0byBkaXNwbGF5IHRoZSByaWdodCBpY29uLlxyXG4gICAqXHJcbiAgICogVGhpcyBjb21wb25lbnQgdXNlcyBPUEVOSUNPTklDIGh0dHBzOi8vdXNlaWNvbmljLmNvbS9vcGVuXHJcbiAgICogYnkgZGVmYXVsdCBidXQgYW55IGljb24gbGlicmFyeSBtYXkgYmUgdXNlZC5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHJpZ2h0SWNvbkNsYXNzID0gW1xyXG4gICAgJ29pJyxcclxuICAgICdvaS1jaGV2cm9uLXJpZ2h0J1xyXG4gIF07XHJcblxyXG4gIC8qIHRzbGludDpkaXNhYmxlOm1lbWJlci1vcmRlcmluZyAqL1xyXG4gIC8qKlxyXG4gICAqICBEZXRlcm1pbmUgd2hldGhlciBvciBub3QgdGhlIGBEYXRlQnV0dG9uYCBpcyBzZWxlY3RhYmxlIGJ5IHRoZSBlbmQgdXNlci5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHNlbGVjdEZpbHRlcjogKGRhdGVCdXR0b246IERhdGVCdXR0b24sIHZpZXdOYW1lOiBzdHJpbmcpID0+IGJvb2xlYW4gPSAoKSA9PiB0cnVlXHJcblxyXG4gIC8qKlxyXG4gICAqICBTdGFydCBhdCB0aGUgdmlldyBjb250YWluaW5nIHN0YXJ0RGF0ZSB3aGVuIG5vIHZhbHVlIGlzIHNlbGVjdGVkLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgc3RhcnREYXRlOiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBpbml0aWFsIHZpZXcgdGhhdCB0aGUgZGF0ZS90aW1lIHBpY2tlciB3aWxsIHNob3cuXHJcbiAgICogVGhlIHBpY2tlciB3aWxsIGFsc28gcmV0dXJuIHRvIHRoaXMgdmlldyBhZnRlciBhIGRhdGUvdGltZVxyXG4gICAqIGlzIHNlbGVjdGVkLlxyXG4gICAqXHJcbiAgICogTk9URTogVGhpcyBtdXN0IGJlIHNldCBsb3dlciB0aGFuIG9yIGVxdWFsIHRvIGBtYXhWaWV3J1xyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgc3RhcnRWaWV3OiAneWVhcicgfCAnbW9udGgnIHwgJ2RheScgfCAnaG91cicgfCAnbWludXRlJyA9ICdkYXknO1xyXG5cclxuICAvKipcclxuICAgKiBTcGVjaWZpZXMgdGhlIGNsYXNzZXMgdXNlZCB0byBkaXNwbGF5IHRoZSB1cCBpY29uLlxyXG4gICAqXHJcbiAgICogVGhpcyBjb21wb25lbnQgdXNlcyBPUEVOSUNPTklDIGh0dHBzOi8vdXNlaWNvbmljLmNvbS9vcGVuXHJcbiAgICogYnkgZGVmYXVsdCBidXQgYW55IGljb24gbGlicmFyeSBtYXkgYmUgdXNlZC5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHVwSWNvbkNsYXNzID0gW1xyXG4gICAgJ29pJyxcclxuICAgICdvaS1jaGV2cm9uLXRvcCdcclxuICBdO1xyXG5cclxuICAvKipcclxuICAgKiBVc2VkIHRvIGNvbnN0cnVjdCBhIG5ldyBpbnN0YW5jZSBvZiBhIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gX2VsZW1lbnRSZWZcclxuICAgKiAgcmVmZXJlbmNlIHRvIHRoaXMgZWxlbWVudC5cclxuICAgKiBAcGFyYW0gX25nWm9uZVxyXG4gICAqICByZWZlcmVuY2UgdG8gYW4gTmdab25lIGluc3RhbmNlIHVzZWQgdG8gc2VsZWN0IHRoZSBhY3RpdmUgZWxlbWVudCBvdXRzaWRlIG9mIGFuZ3VsYXIuXHJcbiAgICogQHBhcmFtIF9kYXRlQWRhcHRlclxyXG4gICAqICBkYXRlIGFkYXB0ZXIgZm9yIHRoZSBkYXRlIHR5cGUgaW4gdGhlIG1vZGVsLlxyXG4gICAqIEBwYXJhbSB5ZWFyTW9kZWxDb21wb25lbnRcclxuICAgKiAgcHJvdmlkZXIgZm9yIHRoZSB5ZWFyIHZpZXcgbW9kZWwuXHJcbiAgICogQHBhcmFtIG1vbnRoTW9kZWxDb21wb25lbnRcclxuICAgKiAgcHJvdmlkZXIgZm9yIHRoZSBtb250aCB2aWV3IG1vZGVsLlxyXG4gICAqIEBwYXJhbSBkYXlNb2RlbENvbXBvbmVudFxyXG4gICAqICBwcm92aWRlciBmb3IgdGhlIGRheSB2aWV3IG1vZGVsLlxyXG4gICAqIEBwYXJhbSBob3VyTW9kZWxDb21wb25lbnRcclxuICAgKiAgcHJvdmlkZXIgZm9yIHRoZSBob3VyIHZpZXcgbW9kZWwuXHJcbiAgICogQHBhcmFtIG1pbnV0ZU1vZGVsQ29tcG9uZW50XHJcbiAgICogIHByb3ZpZGVyIGZvciB0aGUgbWludXRlIHZpZXcgbW9kZWwuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGxEYXRlQWRhcHRlcjxEPixcclxuICAgICAgICAgICAgICBwcml2YXRlIHllYXJNb2RlbENvbXBvbmVudDogRGxZZWFyTW9kZWxQcm92aWRlcixcclxuICAgICAgICAgICAgICBwcml2YXRlIG1vbnRoTW9kZWxDb21wb25lbnQ6IERsTW9udGhNb2RlbFByb3ZpZGVyLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgZGF5TW9kZWxDb21wb25lbnQ6IERsRGF5TW9kZWxQcm92aWRlcixcclxuICAgICAgICAgICAgICBwcml2YXRlIGhvdXJNb2RlbENvbXBvbmVudDogRGxIb3VyTW9kZWxQcm92aWRlcixcclxuICAgICAgICAgICAgICBwcml2YXRlIG1pbnV0ZU1vZGVsQ29tcG9uZW50OiBEbE1pbnV0ZU1vZGVsUHJvdmlkZXIpIHtcclxuXHJcbiAgICB0aGlzLl92aWV3VG9Nb2RlbFByb3ZpZGVyID0ge1xyXG4gICAgICB5ZWFyOiB5ZWFyTW9kZWxDb21wb25lbnQsXHJcbiAgICAgIG1vbnRoOiBtb250aE1vZGVsQ29tcG9uZW50LFxyXG4gICAgICBkYXk6IGRheU1vZGVsQ29tcG9uZW50LFxyXG4gICAgICBob3VyOiBob3VyTW9kZWxDb21wb25lbnQsXHJcbiAgICAgIG1pbnV0ZTogbWludXRlTW9kZWxDb21wb25lbnQsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyogdHNsaW50OmVuYWJsZTptZW1iZXItb3JkZXJpbmcgKi9cclxuICAvKipcclxuICAgKiBTZXQncyB0aGUgbW9kZWwgZm9yIHRoZSBjdXJyZW50IHZpZXcgYWZ0ZXIgYXBwbHlpbmcgdGhlIHNlbGVjdGlvbiBmaWx0ZXIuXHJcbiAgICpcclxuICAgKiBAaW50ZXJuYWxcclxuICAgKiovXHJcbiAgcHJpdmF0ZSBzZXQgbW9kZWwobW9kZWw6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCkge1xyXG4gICAgdGhpcy5fbW9kZWwgPSB0aGlzLmFwcGx5U2VsZWN0RmlsdGVyKG1vZGVsKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYERgIHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyIG9yIHVuZGVmaW5lZC9udWxsIGlmIG5vIHZhbHVlIGlzIHNldC5cclxuICAgKiovXHJcbiAgZ2V0IHZhbHVlKCk6IEQge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlciBhbmQgZW1pdHMgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlXHJcbiAgICogbmV3IHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBwcmV2aW91cyB2YWx1ZS5cclxuICAgKiovXHJcbiAgc2V0IHZhbHVlKHZhbHVlOiBEKSB7XHJcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgIHRoaXMubW9kZWwgPSB0aGlzLl92aWV3VG9Nb2RlbFByb3ZpZGVyW3RoaXMuX21vZGVsLnZpZXdOYW1lXS5nZXRNb2RlbCh0aGlzLmdldFN0YXJ0RGF0ZSgpLCB0aGlzLnZhbHVlT2YpO1xyXG4gICAgICB0aGlzLl9jaGFuZ2VkLmZvckVhY2goZiA9PiBmKHZhbHVlKSk7XHJcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQobmV3IERsRGF0ZVRpbWVQaWNrZXJDaGFuZ2U8RD4odmFsdWUpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYG1pbGxpc2Vjb25kc2AgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIgb3IgdW5kZWZpbmVkL251bGwgaWYgbm8gdmFsdWUgaXMgc2V0LlxyXG4gICAqKi9cclxuICBnZXQgdmFsdWVPZigpOiBudW1iZXIgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRlQWRhcHRlci50b01pbGxpc2Vjb25kcyh0aGlzLl92YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBcHBsaWVzIHRoZSBgc2VsZWN0aW9uRmlsdGVyYCBieSBhZGRpbmcgdGhlIGBkbC1hYmR0cC1kaXNhYmxlZGBcclxuICAgKiBjbGFzcyB0byBhbnkgYERhdGVCdXR0b25gIHdoZXJlIGBzZWxlY3RGaWx0ZXJgIHJldHVybmVkIGZhbHNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1vZGVsXHJcbiAgICogIHRoZSBuZXcgbW9kZWxcclxuICAgKlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIHRoZSBzdXBwbGllZCBtb2RlbCB3aXRoIHplcm8gb3IgbW9yZSBgRGF0ZUJ1dHRvbmAnc1xyXG4gICAqICBoYXZpbmcgdGhlIGBkbC1hYmR0cC1kaXNhYmxlZGAgY2xhc3Mgc2V0IHRvIGB0cnVlYCBpZiB0aGVcclxuICAgKiAgc2VsZWN0aW9uIGZvciB0aGF0IGRhdGUgc2hvdWxkIGJlIGRpc2FibGVkLlxyXG4gICAqXHJcbiAgICogQGludGVybmFsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhcHBseVNlbGVjdEZpbHRlcihtb2RlbDogRGxEYXRlVGltZVBpY2tlck1vZGVsKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdEZpbHRlcikge1xyXG4gICAgICBtb2RlbC5yb3dzID0gbW9kZWwucm93cy5tYXAoKHJvdykgPT4ge1xyXG4gICAgICAgIHJvdy5jZWxscy5tYXAoKGRhdGVCdXR0b246IERhdGVCdXR0b24pID0+IHtcclxuICAgICAgICAgIGNvbnN0IGRpc2FibGVkID0gIXRoaXMuc2VsZWN0RmlsdGVyKGRhdGVCdXR0b24sIG1vZGVsLnZpZXdOYW1lKTtcclxuICAgICAgICAgIGRhdGVCdXR0b24uY2xhc3Nlc1snZGwtYWJkdHAtZGlzYWJsZWQnXSA9IGRpc2FibGVkO1xyXG4gICAgICAgICAgaWYgKGRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIGRhdGVCdXR0b24uY2xhc3Nlc1snYXJpYS1kaXNhYmxlZCddID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBkYXRlQnV0dG9uO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByb3c7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtb2RlbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvY3VzZXMgdGhlIGAuZGwtYWJkdHAtYWN0aXZlYCBjZWxsIGFmdGVyIHRoZSBtaWNyb3Rhc2sgcXVldWUgaXMgZW1wdHkuXHJcbiAgICogQGludGVybmFsXHJcbiAgICoqL1xyXG4gIHByaXZhdGUgZm9jdXNBY3RpdmVDZWxsKCkge1xyXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRsLWFiZHRwLWFjdGl2ZScpLmZvY3VzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIHRoZSBzdGFydCBkYXRlIGZvciB0aGUgcGlja2VyLlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBwcml2YXRlIGdldFN0YXJ0RGF0ZSgpIHtcclxuICAgIGlmIChoYXNWYWx1ZSh0aGlzLl92YWx1ZSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyLnRvTWlsbGlzZWNvbmRzKHRoaXMuX3ZhbHVlKTtcclxuICAgIH1cclxuICAgIGlmIChoYXNWYWx1ZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnREYXRlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1vbWVudCgpLnZhbHVlT2YoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZSB0aGUgc3RhcnQgdmlldyBmb3IgdGhlIHBpY2tlclxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIHRoZSBsYXJnZXN0IHRpbWUgaW5jcmVtZW50IHZpZXcgYmV0d2VlbiB0aGUgYG1pblZpZXdgIG9yIGBtaW51dGVgIHZpZXcgYW5kIHRoZSBgc3RhcnRWaWV3YCBvciBgZGF5YCB2aWV3LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0U3RhcnRWaWV3KCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gTWF0aC5tYXgoVklFV1MuaW5kZXhPZih0aGlzLm1pblZpZXcgfHwgJ21pbnV0ZScpLCBWSUVXUy5pbmRleE9mKHRoaXMuc3RhcnRWaWV3IHx8ICdkYXknKSk7XHJcbiAgICByZXR1cm4gVklFV1Nbc3RhcnRJbmRleF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxscyBhbGwgcmVnaXN0ZXJlZCBgdG91Y2hgIGNhbGxiYWNrIGZ1bmN0aW9ucy5cclxuICAgKiBAaW50ZXJuYWxcclxuICAgKiovXHJcbiAgcHJpdmF0ZSBvblRvdWNoKCkge1xyXG4gICAgdGhpcy5fdG91Y2hlZC5mb3JFYWNoKChvblRvdWNoZWQpID0+IG9uVG91Y2hlZCgpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlY2VpdmVzIGNvbmZpZ3VyYXRpb24gY2hhbmdlcyBkZXRlY3RlZCBieSBBbmd1bGFyIGFuZCBwYXNzZXMgdGhlIGNoYW5nZXMgb25cclxuICAgKiB0byB0aGUgbW9kZWwgcHJvdmlkZXJzIHNvIHRoZSBwcm92aWRlciBpcyBhd2FyZSBvZiBhbnkgbmVjZXNzYXJ5IGNvbmZpZ3VyYXRpb25cclxuICAgKiBjaGFuZ2VzIChpLmUuIG1pbnV0ZVN0ZXApXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY2hhbmdlc1xyXG4gICAqICB0aGUgaW5wdXQgY2hhbmdlcyBkZXRlY3RlZCBieSBBbmd1bGFyLlxyXG4gICAqL1xyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIE9iamVjdC52YWx1ZXModGhpcy5fdmlld1RvTW9kZWxQcm92aWRlcikuZm9yRWFjaCgocHJvdmlkZXI6IERsTW9kZWxQcm92aWRlcikgPT4gcHJvdmlkZXIub25DaGFuZ2VzKGNoYW5nZXMpKTtcclxuXHJcbiAgICBpZiAodGhpcy5fbW9kZWwpIHsgLy8gb25seSB1cGRhdGUgdGhlIG1vZGVsIGFmdGVyIG5nT25Jbml0IGhhcyBzZXQgaXQgdGhlIGZpcnN0IHRpbWUuXHJcbiAgICAgIHRoaXMubW9kZWwgPSB0aGlzLl92aWV3VG9Nb2RlbFByb3ZpZGVyW3RoaXMuX21vZGVsLnZpZXdOYW1lXS5nZXRNb2RlbCh0aGlzLl9tb2RlbC5hY3RpdmVEYXRlLCB0aGlzLnZhbHVlT2YpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgaW5pdGlhbCBtb2RlbC5cclxuICAgKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubW9kZWwgPSB0aGlzLl92aWV3VG9Nb2RlbFByb3ZpZGVyW3RoaXMuZ2V0U3RhcnRWaWV3KCldLmdldE1vZGVsKHRoaXMuZ2V0U3RhcnREYXRlKCksIHRoaXMudmFsdWVPZik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIGNsaWNrIChhbmQgZW50ZXIgJiBzcGFjZSBrZXkgZG93bikgZXZlbnRzIG9uIHRoZSBkYXRlIGVsZW1lbnRzLlxyXG4gICAqXHJcbiAgICogSWYgdGhlIGN1cnJlbnQgdmlldyBpcyB0aGUgbWluaW11bSB2aWV3IHRoZW4gdGhlIGRhdGUgdmFsdWUgaXMgc2VsZWN0ZWRcclxuICAgKiBhbmQgdGhlIHBpY2tlciByZXR1cm5zIHRvIHRoZSBzdGFydCB2aWV3LlxyXG4gICAqXHJcbiAgICogT3RoZXJ3aXNlIHRoZSBwaWNrZXIgZGlzcGxheXMgdGhlIG5leHQgdmlldyB3aXRoIHRoZSBuZXh0XHJcbiAgICogc21hbGxlc3QgdGltZSBpbmNyZW1lbnQuXHJcbiAgICpcclxuICAgKiBAaW50ZXJuYWxcclxuICAgKiovXHJcbiAgX29uRGF0ZUNsaWNrKGRhdGVCdXR0b246IERhdGVCdXR0b24pIHtcclxuICAgIGlmIChkYXRlQnV0dG9uLmNsYXNzZXNbJ2RsLWFiZHRwLWRpc2FibGVkJ10pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0VmlldyA9IHRoaXMuX25leHRWaWV3W3RoaXMuX21vZGVsLnZpZXdOYW1lXTtcclxuXHJcbiAgICBpZiAoKHRoaXMubWluVmlldyB8fCAnbWludXRlJykgPT09IHRoaXMuX21vZGVsLnZpZXdOYW1lKSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5mcm9tTWlsbGlzZWNvbmRzKGRhdGVCdXR0b24udmFsdWUpO1xyXG4gICAgICBuZXh0VmlldyA9IHRoaXMuc3RhcnRWaWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubW9kZWwgPSB0aGlzLl92aWV3VG9Nb2RlbFByb3ZpZGVyW25leHRWaWV3XS5nZXRNb2RlbChkYXRlQnV0dG9uLnZhbHVlLCB0aGlzLnZhbHVlT2YpO1xyXG5cclxuICAgIHRoaXMub25Ub3VjaCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyBjbGljayAoYW5kIGVudGVyICYgc3BhY2Uga2V5IGRvd24pIGV2ZW50cyBvbiB0aGUgbGVmdCBidXR0b24uXHJcbiAgICpcclxuICAgKiBDaGFuZ2VzIHRoZSBkaXNwbGF5ZWQgdGltZSByYW5nZSBvZiB0aGUgcGlja2VyIHRvIHRoZSBwcmV2aW91cyB0aW1lIHJhbmdlLlxyXG4gICAqIEZvciBleGFtcGxlLCBpbiB5ZWFyIHZpZXcsIHRoZSBwcmV2aW91cyBkZWNhZGUgaXMgZGlzcGxheWVkLlxyXG4gICAqXHJcbiAgICogQGludGVybmFsXHJcbiAgICoqL1xyXG4gIF9vbkxlZnRDbGljaygpIHtcclxuICAgIHRoaXMubW9kZWwgPSB0aGlzLl92aWV3VG9Nb2RlbFByb3ZpZGVyW3RoaXMuX21vZGVsLnZpZXdOYW1lXS5nZXRNb2RlbCh0aGlzLl9tb2RlbC5sZWZ0QnV0dG9uLnZhbHVlLCB0aGlzLnZhbHVlT2YpO1xyXG4gICAgdGhpcy5vblRvdWNoKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIGNsaWNrIChhbmQgZW50ZXIgJiBzcGFjZSBrZXkgZG93bikgZXZlbnRzIG9uIHRoZSB1cCBidXR0b24uXHJcbiAgICpcclxuICAgKiBDaGFuZ2VzIHRoZSB2aWV3IG9mIHRoZSBwaWNrZXIgdG8gdGhlIG5leHQgbGFyZ2VzdCB0aW1lIGluY3JlbWVudC5cclxuICAgKiBGb3IgZXhhbXBsZSwgaW4gZGF5IHZpZXcsIHRoZSBuZXh0IHZpZXcgZGlzcGxheWVkIHdpbGwgYmUgbW9udGggdmlldy5cclxuICAgKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBfb25VcENsaWNrKCkge1xyXG4gICAgdGhpcy5tb2RlbCA9IHRoaXMuX3ZpZXdUb01vZGVsUHJvdmlkZXJbdGhpcy5fcHJldmlvdXNWaWV3W3RoaXMuX21vZGVsLnZpZXdOYW1lXV0uZ2V0TW9kZWwodGhpcy5fbW9kZWwudXBCdXR0b24udmFsdWUsIHRoaXMudmFsdWVPZik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIGNsaWNrIChhbmQgZW50ZXIgJiBzcGFjZSBrZXkgZG93bikgZXZlbnRzIG9uIHRoZSByaWdodCBidXR0b24uXHJcbiAgICpcclxuICAgKiBDaGFuZ2VzIHRoZSBkaXNwbGF5ZWQgdGltZSByYW5nZSBvZiB0aGUgcGlja2VyIHRvIHRoZSBuZXh0IHRpbWUgcmFuZ2UuXHJcbiAgICogRm9yIGV4YW1wbGUsIGluIHllYXIgdmlldywgdGhlIG5leHQgZGVjYWRlIGlzIGRpc3BsYXllZC5cclxuICAgKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBfb25SaWdodENsaWNrKCkge1xyXG4gICAgdGhpcy5tb2RlbCA9IHRoaXMuX3ZpZXdUb01vZGVsUHJvdmlkZXJbdGhpcy5fbW9kZWwudmlld05hbWVdLmdldE1vZGVsKHRoaXMuX21vZGVsLnJpZ2h0QnV0dG9uLnZhbHVlLCB0aGlzLnZhbHVlT2YpO1xyXG4gICAgdGhpcy5vblRvdWNoKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIHZhcmlvdXMga2V5IGRvd24gZXZlbnRzIHRvIG1vdmUgdGhlIGBhY3RpdmUgZGF0ZWAgYXJvdW5kIHRoZSBjYWxlbmRhci5cclxuICAgKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICBfaGFuZGxlS2V5RG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGtleUNvZGVUb01vZGVsUHJvdmlkZXJNZXRob2RbJGV2ZW50LmtleV07XHJcblxyXG4gICAgaWYgKGZ1bmN0aW9uTmFtZSkge1xyXG4gICAgICBjb25zdCBtb2RlbFByb3ZpZGVyID0gdGhpcy5fdmlld1RvTW9kZWxQcm92aWRlclt0aGlzLl9tb2RlbC52aWV3TmFtZV07XHJcbiAgICAgIHRoaXMubW9kZWwgPSBtb2RlbFByb3ZpZGVyW2Z1bmN0aW9uTmFtZV0odGhpcy5fbW9kZWwuYWN0aXZlRGF0ZSwgdGhpcy52YWx1ZU9mKTtcclxuXHJcbiAgICAgIHRoaXMuZm9jdXNBY3RpdmVDZWxsKCk7XHJcbiAgICAgIC8vIFByZXZlbnQgdW5leHBlY3RlZCBkZWZhdWx0IGFjdGlvbnMgc3VjaCBhcyBmb3JtIHN1Ym1pc3Npb24uXHJcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uQ2hhbmdlIHRvIHJlZ2lzdGVyIGNoYW5nZSBsaXN0ZW5lcnMuXHJcbiAgICogQGludGVybmFsXHJcbiAgICoqL1xyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogRCkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5fY2hhbmdlZC5wdXNoKGZuKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPblRvdWNoZWQgdG8gcmVnaXN0ZXIgdG91Y2ggbGlzdGVuZXJzLlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqKi9cclxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5fdG91Y2hlZC5wdXNoKGZuKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Iud3JpdGVWYWx1ZSB0byBzdG9yZSB0aGUgdmFsdWUgZnJvbSB0aGUgbW9kZWwuXHJcbiAgICogQGludGVybmFsXHJcbiAgICoqL1xyXG4gIHdyaXRlVmFsdWUodmFsdWU6IEQpIHtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICB9XHJcblxyXG59XHJcblxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIGhhc1ZhbHVlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICByZXR1cm4gKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWx1ZSAhPT0gbnVsbCk7XHJcbn1cclxuIiwiPGRpdiBjbGFzcz1cInRleHQtY2VudGVyIGRsLWFiZHRwLXt7X21vZGVsLnZpZXdOYW1lfX0tdmlld1wiIFthdHRyLmRhdGEtZGwtYWJkdHAtdmlld109XCJfbW9kZWwudmlld05hbWVcIj5cclxuICA8ZGl2IGNsYXNzPVwicm93IGFsaWduLWl0ZW1zLWNlbnRlciBuby1ndXR0ZXJzXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiY29sIGRsLWFiZHRwLWxlZnQtYnV0dG9uIGFsaWduLWl0ZW1zLWNlbnRlclwiXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9tb2RlbC5sZWZ0QnV0dG9uLmFyaWFMYWJlbFwiXHJcbiAgICAgICAgICAgIFthdHRyLmRsLWFiZHRwLXZhbHVlXT1cIl9tb2RlbC5sZWZ0QnV0dG9uLnZhbHVlXCJcclxuICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiX21vZGVsLmxlZnRCdXR0b24uYXJpYUxhYmVsXCJcclxuICAgICAgICAgICAgKGNsaWNrKT1cIl9vbkxlZnRDbGljaygpXCJcclxuICAgID48c3BhbiBjbGFzcz1cImxlZnQtaWNvblwiIFtuZ0NsYXNzXT1cImxlZnRJY29uQ2xhc3NcIj48L3NwYW4+XHJcbiAgICA8L2J1dHRvbj5cclxuXHJcbiAgICA8ZGl2ICpuZ0lmPVwiX21vZGVsLnZpZXdOYW1lID09PSAodGhpcy5tYXhWaWV3IHx8ICd5ZWFyJyk7IHRoZW4gbWF4Vmlld0xhYmVsIGVsc2UgZGVmYXVsdFZpZXdMYWJlbDtcIj48L2Rpdj5cclxuXHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiY29sIGRsLWFiZHRwLXJpZ2h0LWJ1dHRvblwiXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9tb2RlbC5yaWdodEJ1dHRvbi5hcmlhTGFiZWxcIlxyXG4gICAgICAgICAgICBbYXR0ci5kbC1hYmR0cC12YWx1ZV09XCJfbW9kZWwucmlnaHRCdXR0b24udmFsdWVcIlxyXG4gICAgICAgICAgICBbYXR0ci50aXRsZV09XCJfbW9kZWwucmlnaHRCdXR0b24uYXJpYUxhYmVsXCJcclxuICAgICAgICAgICAgKGNsaWNrKT1cIl9vblJpZ2h0Q2xpY2soKVwiXHJcbiAgICA+PHNwYW4gY2xhc3M9XCJyaWdodC1pY29uXCIgW25nQ2xhc3NdPVwicmlnaHRJY29uQ2xhc3NcIj48L3NwYW4+XHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IChrZXlkb3duKT1cIl9oYW5kbGVLZXlEb3duKCRldmVudClcIj5cclxuICAgIDxkaXYgKm5nSWY9XCJfbW9kZWwucm93TGFiZWxzPy5sZW5ndGhcIiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzXCI+XHJcbiAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGxhYmVsIG9mIF9tb2RlbC5yb3dMYWJlbHNcIlxyXG4gICAgICAgICAgIGNsYXNzPVwiY29sIGFsaWduLWl0ZW1zLWNlbnRlciBuby1ndXR0ZXJzIGRsLWFiZHRwLWNvbC1sYWJlbFwiPnt7bGFiZWx9fTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCByb3cgb2YgX21vZGVsLnJvd3NcIiBjbGFzcz1cInJvdyBhbGlnbi1pdGVtcy1jZW50ZXIgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBjZWxsIG9mIHJvdy5jZWxsc1wiXHJcbiAgICAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcclxuICAgICAgICAgICBjbGFzcz1cImNvbCBkbC1hYmR0cC1kYXRlLWJ1dHRvbiBkbC1hYmR0cC17e19tb2RlbC52aWV3TmFtZX19XCJcclxuICAgICAgICAgICBbbmdDbGFzc109XCJjZWxsLmNsYXNzZXNcIlxyXG4gICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY2VsbC5hcmlhTGFiZWxcIlxyXG4gICAgICAgICAgIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwiY2VsbC5jbGFzc2VzWydkbC1hYmR0cC1kaXNhYmxlZCddXCJcclxuICAgICAgICAgICBbYXR0ci5kbC1hYmR0cC12YWx1ZV09XCJjZWxsLnZhbHVlXCJcclxuICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJjZWxsLmNsYXNzZXNbJ2RsLWFiZHRwLWFjdGl2ZSddID8gMCA6IC0xXCJcclxuICAgICAgICAgICAoY2xpY2spPVwiX29uRGF0ZUNsaWNrKGNlbGwpXCJcclxuICAgICAgICAgICAoa2V5ZG93bi5zcGFjZSk9XCJfb25EYXRlQ2xpY2soY2VsbClcIlxyXG4gICAgICAgICAgIChrZXlkb3duLmVudGVyKT1cIl9vbkRhdGVDbGljayhjZWxsKVwiXHJcbiAgICAgID57e2NlbGwuZGlzcGxheX19PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG48bmctdGVtcGxhdGUgI21heFZpZXdMYWJlbD5cclxuICA8ZGl2IGNsYXNzPVwiY29sLTEwIGRsLWFiZHRwLXZpZXctbGFiZWxcIj57e19tb2RlbC52aWV3TGFiZWx9fTwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgI2RlZmF1bHRWaWV3TGFiZWw+XHJcbiAgPGJ1dHRvbiBjbGFzcz1cImNvbC0xMCBkbC1hYmR0cC12aWV3LWxhYmVsIGRsLWFiZHRwLXVwLWJ1dHRvblwiXHJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX21vZGVsLnVwQnV0dG9uLmFyaWFMYWJlbFwiXHJcbiAgICAgICAgICBbYXR0ci5kbC1hYmR0cC12YWx1ZV09XCJfbW9kZWwudXBCdXR0b24udmFsdWVcIlxyXG4gICAgICAgICAgW2F0dHIudGl0bGVdPVwiX21vZGVsLnVwQnV0dG9uLmFyaWFMYWJlbFwiXHJcbiAgICAgICAgICAoY2xpY2spPVwiX29uVXBDbGljaygpXCJcclxuICAgICAgICAgIFtuZ0NsYXNzXT1cIl9tb2RlbC51cEJ1dHRvbi5jbGFzc2VzXCJcclxuICA+e3tfbW9kZWwudmlld0xhYmVsfX0mbmJzcDs8c3BhbiBjbGFzcz1cInVwLWljb25cIiBbbmdDbGFzc109XCJ1cEljb25DbGFzc1wiPjwvc3Bhbj5cclxuICA8L2J1dHRvbj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuIl19