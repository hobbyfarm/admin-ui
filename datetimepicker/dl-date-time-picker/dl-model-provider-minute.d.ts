/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
import { SimpleChanges } from '@angular/core';
import { DlDateTimePickerModel } from './dl-date-time-picker-model';
import { DlModelProvider } from './dl-model-provider';
/**
 * Default implementation for the `minute` view.
 */
export declare class DlMinuteModelProvider implements DlModelProvider {
    private step;
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
    onChanges(changes: SimpleChanges): void;
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
    getModel(milliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goDown(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goUp(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goLeft(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goRight(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    pageDown(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    pageUp(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goEnd(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goHome(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
}
