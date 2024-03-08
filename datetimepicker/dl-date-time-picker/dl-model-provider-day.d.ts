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
 * Default implementation for the `day` view.
 */
export declare class DlDayModelProvider implements DlModelProvider {
    /**
     * Receives input changes detected by Angular.
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    onChanges(_changes: SimpleChanges): void;
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
    getModel(milliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goDown(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goUp(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goLeft(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goRight(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    pageDown(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    pageUp(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goEnd(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goHome(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
}
