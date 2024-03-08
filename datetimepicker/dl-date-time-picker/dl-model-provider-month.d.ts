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
 * Default implementation for the `month` view.
 */
export declare class DlMonthModelProvider implements DlModelProvider {
    /**
     * Receives input changes detected by Angular.
     *
     * @param changes
     *  the input changes detected by Angular.
     */
    onChanges(_changes: SimpleChanges): void;
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
    getModel(milliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goDown(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goUp(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goLeft(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goRight(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    pageDown(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    pageUp(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goEnd(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
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
    goHome(fromMilliseconds: number, selectedMilliseconds: number): DlDateTimePickerModel;
}
