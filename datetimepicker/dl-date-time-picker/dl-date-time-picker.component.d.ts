/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
import { ElementRef, EventEmitter, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DlDateAdapter } from '../core/public-api';
import { DlDateTimePickerChange } from './dl-date-time-picker-change';
import { DateButton } from './dl-date-time-picker-date-button';
import { DlDateTimePickerModel } from './dl-date-time-picker-model';
import { DlDayModelProvider } from './dl-model-provider-day';
import { DlHourModelProvider } from './dl-model-provider-hour';
import { DlMinuteModelProvider } from './dl-model-provider-minute';
import { DlMonthModelProvider } from './dl-model-provider-month';
import { DlYearModelProvider } from './dl-model-provider-year';
import * as i0 from "@angular/core";
/**
 * Component that provides all of the user facing functionality of the date/time picker.
 */
export declare class DlDateTimePickerComponent<D> implements OnChanges, OnInit, ControlValueAccessor {
    private _elementRef;
    private _ngZone;
    private _dateAdapter;
    private yearModelComponent;
    private monthModelComponent;
    private dayModelComponent;
    private hourModelComponent;
    private minuteModelComponent;
    /**
     * Change listener callback functions registered
     * via `registerOnChange`
     * @internal
     **/
    private _changed;
    /**
     * Model for the current view.
     *
     * @internal
     **/
    _model: DlDateTimePickerModel;
    /**
     * Maps view name to the next view (the view for the next smallest increment of time).
     * @internal
     **/
    private _nextView;
    /**
     * Maps view name to the previous view (the view for the next largest increment of time).
     * @internal
     **/
    private _previousView;
    /**
     * Touch listener callback functions registered
     * via `registerOnChange`
     * @internal
     **/
    private _touched;
    /**
     * Stores the selected value for this picker.
     * @internal
     **/
    private _value;
    /**
     * Maps view name to the model provider for that view.
     * @internal
     **/
    private readonly _viewToModelProvider;
    /**
     * Emits when a `change` event when date/time is selected or
     * the value of the date/time picker changes.
     **/
    readonly change: EventEmitter<DlDateTimePickerChange<D>>;
    /**
     * Specifies the classes used to display the left icon.
     *
     * This component uses OPENICONIC https://useiconic.com/open
     * by default but any icon library may be used.
     */
    leftIconClass: string | string[] | Set<string> | {};
    /**
     * The highest view that the date/time picker can show.
     * Setting this to a view less than year could make it more
     * difficult for the end-user to navigate to certain dates.
     */
    maxView: 'year' | 'month' | 'day' | 'hour' | 'minute';
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
    minView: 'year' | 'month' | 'day' | 'hour' | 'minute';
    /**
     * The number of minutes between each `.dl-abdtp-minute` button.
     *
     * Must be greater than `0` and less than `60`.
     */
    minuteStep: number;
    /**
     * Specifies the classes used to display the right icon.
     *
     * This component uses OPENICONIC https://useiconic.com/open
     * by default but any icon library may be used.
     */
    rightIconClass: string[];
    /**
     *  Determine whether or not the `DateButton` is selectable by the end user.
     */
    selectFilter: (dateButton: DateButton, viewName: string) => boolean;
    /**
     *  Start at the view containing startDate when no value is selected.
     */
    startDate: number;
    /**
     * The initial view that the date/time picker will show.
     * The picker will also return to this view after a date/time
     * is selected.
     *
     * NOTE: This must be set lower than or equal to `maxView'
     */
    startView: 'year' | 'month' | 'day' | 'hour' | 'minute';
    /**
     * Specifies the classes used to display the up icon.
     *
     * This component uses OPENICONIC https://useiconic.com/open
     * by default but any icon library may be used.
     */
    upIconClass: string[];
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
    constructor(_elementRef: ElementRef, _ngZone: NgZone, _dateAdapter: DlDateAdapter<D>, yearModelComponent: DlYearModelProvider, monthModelComponent: DlMonthModelProvider, dayModelComponent: DlDayModelProvider, hourModelComponent: DlHourModelProvider, minuteModelComponent: DlMinuteModelProvider);
    /**
     * Set's the model for the current view after applying the selection filter.
     *
     * @internal
     **/
    private set model(value);
    /**
     * Returns `D` value of the date/time picker or undefined/null if no value is set.
     **/
    get value(): D;
    /**
     * Sets value of the date/time picker and emits a change event if the
     * new value is different from the previous value.
     **/
    set value(value: D);
    /**
     * Returns `milliseconds` value of the date/time picker or undefined/null if no value is set.
     **/
    get valueOf(): number | null;
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
    private applySelectFilter;
    /**
     * Focuses the `.dl-abdtp-active` cell after the microtask queue is empty.
     * @internal
     **/
    private focusActiveCell;
    /**
     * Determines the start date for the picker.
     * @internal
     **/
    private getStartDate;
    /**
     * Determine the start view for the picker
     * @returns
     *  the largest time increment view between the `minView` or `minute` view and the `startView` or `day` view.
     */
    private getStartView;
    /**
     * Calls all registered `touch` callback functions.
     * @internal
     **/
    private onTouch;
    /**
     * Receives configuration changes detected by Angular and passes the changes on
     * to the model providers so the provider is aware of any necessary configuration
     * changes (i.e. minuteStep)
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Sets the initial model.
     *
     * @internal
     **/
    ngOnInit(): void;
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
    _onDateClick(dateButton: DateButton): void;
    /**
     * Handles click (and enter & space key down) events on the left button.
     *
     * Changes the displayed time range of the picker to the previous time range.
     * For example, in year view, the previous decade is displayed.
     *
     * @internal
     **/
    _onLeftClick(): void;
    /**
     * Handles click (and enter & space key down) events on the up button.
     *
     * Changes the view of the picker to the next largest time increment.
     * For example, in day view, the next view displayed will be month view.
     *
     * @internal
     **/
    _onUpClick(): void;
    /**
     * Handles click (and enter & space key down) events on the right button.
     *
     * Changes the displayed time range of the picker to the next time range.
     * For example, in year view, the next decade is displayed.
     *
     * @internal
     **/
    _onRightClick(): void;
    /**
     * Handles various key down events to move the `active date` around the calendar.
     *
     * @internal
     **/
    _handleKeyDown($event: KeyboardEvent): void;
    /**
     * Implements ControlValueAccessor.registerOnChange to register change listeners.
     * @internal
     **/
    registerOnChange(fn: (value: D) => void): void;
    /**
     * Implements ControlValueAccessor.registerOnTouched to register touch listeners.
     * @internal
     **/
    registerOnTouched(fn: () => void): void;
    /**
     * Implements ControlValueAccessor.writeValue to store the value from the model.
     * @internal
     **/
    writeValue(value: D): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateTimePickerComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DlDateTimePickerComponent<any>, "dl-date-time-picker", never, { "leftIconClass": "leftIconClass"; "maxView": "maxView"; "minView": "minView"; "minuteStep": "minuteStep"; "rightIconClass": "rightIconClass"; "selectFilter": "selectFilter"; "startDate": "startDate"; "startView": "startView"; "upIconClass": "upIconClass"; }, { "change": "change"; }, never, never>;
}
