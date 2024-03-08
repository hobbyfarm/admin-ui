/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
import moment from 'moment';
/**
 * Default implementation for the `year` view.
 */
export class DlYearModelProvider {
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
        const startDecade = (Math.trunc(moment(fromMilliseconds).year() / 10) * 10);
        return moment({ year: startDecade }).startOf('year');
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
        const startYear = moment(milliseconds).startOf('year');
        const startDate = DlYearModelProvider.getStartOfDecade(milliseconds);
        const futureYear = startDate.year() + 9;
        const pastYear = startDate.year();
        const activeValue = startYear.valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment(selectedMilliseconds).startOf('year').valueOf();
        return {
            viewName: 'year',
            viewLabel: `${pastYear}-${futureYear}`,
            activeDate: activeValue,
            leftButton: {
                value: moment(startDate).subtract(10, 'years').valueOf(),
                ariaLabel: `Go to ${pastYear - 10}-${pastYear - 1}`,
                classes: {},
            },
            rightButton: {
                value: moment(startDate).add(10, 'years').valueOf(),
                ariaLabel: `Go to ${futureYear + 1}-${futureYear + 10}`,
                classes: {},
            },
            rows: rowNumbers.map(rowOfYears.bind(this))
        };
        function rowOfYears(rowNumber) {
            const currentMoment = moment();
            const cells = columnNumbers.map((columnNumber) => {
                const yearMoment = moment(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'years');
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
        return this.getModel(moment(fromMilliseconds).add(5, 'year').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(5, 'year').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(1, 'year').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(1, 'year').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(10, 'year').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(10, 'year').valueOf(), selectedMilliseconds);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtbW9kZWwtcHJvdmlkZXIteWVhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGwtZGF0ZS10aW1lLXBpY2tlci9kbC1tb2RlbC1wcm92aWRlci15ZWFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7QUFHSCxPQUFPLE1BQWdCLE1BQU0sUUFBUSxDQUFDO0FBSXRDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLG1CQUFtQjtJQUU5Qjs7Ozs7Ozs7O09BU0c7SUFDSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsZ0JBQXdCO1FBQ3RELCtFQUErRTtRQUMvRSxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDNUUsT0FBTyxNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUNQLFFBQXVCLElBQ2hCLENBQUM7SUFFVjs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0JHO0lBQ0gsUUFBUSxDQUFDLFlBQW9CLEVBQUUsb0JBQTRCO1FBQ3pELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsTUFBTSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFckUsTUFB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LElBQUksQ0FBQyxRQUFRLENBQ2xCLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO2FBQ25ELEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDO2FBQ2YsS0FBSyxDQUFDLE1BQU0sQ0FBQzthQUNiLE9BQU8sRUFBRSxFQUNaLG9CQUFvQixDQUNyQixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILE1BQU0sQ0FBQyxnQkFBd0IsRUFBRSxvQkFBNEI7UUFDM0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUNsQixtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQzthQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQ2YsT0FBTyxFQUFFLEVBQ1osb0JBQW9CLENBQ3JCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCBEYWxlIExvdHRzIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqIGh0dHA6Ly93d3cuZGFsZWxvdHRzLmNvbVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxyXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9kYWxlbG90dHMvYW5ndWxhci1ib290c3RyYXAtZGF0ZXRpbWVwaWNrZXIvYmxvYi9tYXN0ZXIvTElDRU5TRVxyXG4gKi9cclxuXHJcbmltcG9ydCB7U2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCBtb21lbnQsIHtNb21lbnR9IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCB7RGxEYXRlVGltZVBpY2tlck1vZGVsfSBmcm9tICcuL2RsLWRhdGUtdGltZS1waWNrZXItbW9kZWwnO1xyXG5pbXBvcnQge0RsTW9kZWxQcm92aWRlcn0gZnJvbSAnLi9kbC1tb2RlbC1wcm92aWRlcic7XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIGB5ZWFyYCB2aWV3LlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERsWWVhck1vZGVsUHJvdmlkZXIgaW1wbGVtZW50cyBEbE1vZGVsUHJvdmlkZXIge1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBtb21lbnQgYXQgbWlkbmlnaHQgamFudWFyeSAxIGF0IHRoZSBzdGFydCBvZiB0aGUgY3VycmVudCBkZWNhZGUuXHJcbiAgICogVGhlIHN0YXJ0IG9mIHRoZSBkZWNhZGUgaXMgYWx3YXlzIGEgeWVhciBlbmRpbmcgaW4gemVyby5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBzdGFydCBvZiB0aGUgZGVjYWRlIHdpbGwgYmUgZGV0ZXJtaW5lZC5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb21lbnQgYXQgbWlkbmlnaHQgamFudWFyeSAxIGF0IHRoZSBzdGFydCBvZiB0aGUgY3VycmVudCBkZWNhZGUuXHJcbiAgICogQGludGVybmFsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0U3RhcnRPZkRlY2FkZShmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBNb21lbnQge1xyXG4gICAgLy8gVHJ1bmNhdGUgdGhlIGxhc3QgZGlnaXQgZnJvbSB0aGUgY3VycmVudCB5ZWFyIHRvIGdldCB0aGUgc3RhcnQgb2YgdGhlIGRlY2FkZVxyXG4gICAgY29uc3Qgc3RhcnREZWNhZGUgPSAoTWF0aC50cnVuYyhtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykueWVhcigpIC8gMTApICogMTApO1xyXG4gICAgcmV0dXJuIG1vbWVudCh7eWVhcjogc3RhcnREZWNhZGV9KS5zdGFydE9mKCd5ZWFyJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWNlaXZlcyBpbnB1dCBjaGFuZ2VzIGRldGVjdGVkIGJ5IEFuZ3VsYXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY2hhbmdlc1xyXG4gICAqICB0aGUgaW5wdXQgY2hhbmdlcyBkZXRlY3RlZCBieSBBbmd1bGFyLlxyXG4gICAqL1xyXG4gIG9uQ2hhbmdlcyhcclxuICAgIF9jaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzXHJcbiAgKTogdm9pZCB7fVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBgeWVhcmAgbW9kZWwgZm9yIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIGBsb2NhbGAgdGltZSB3aXRoIHRoZVxyXG4gICAqIGBhY3RpdmVgIHllYXIgc2V0IHRvIEphbnVhcnkgMSBvZiB0aGUgc3BlY2lmaWVkIHllYXIuXHJcbiAgICpcclxuICAgKiBUaGUgYHllYXJgIG1vZGVsIHJlcHJlc2VudHMgYSBkZWNhZGUgKDEwIHllYXJzKSBhcyB0d28gcm93cyB3aXRoIGZpdmUgY29sdW1ucy5cclxuICAgKlxyXG4gICAqIFRoZSBkZWNhZGUgYWx3YXlzIHN0YXJ0cyBvbiBhIHllYXIgZW5kaW5nIHdpdGggemVyby5cclxuICAgKlxyXG4gICAqIEVhY2ggY2VsbCByZXByZXNlbnRzIG1pZG5pZ2h0IEphbnVhcnkgMSBvZiB0aGUgaW5kaWNhdGVkIHllYXIuXHJcbiAgICpcclxuICAgKiBUaGUgYGFjdGl2ZWAgeWVhciB3aWxsIGJlIHRoZSBKYW51YXJ5IDEgb2YgeWVhciBvZiB0aGUgc3BlY2lmaWVkIG1pbGxpc2Vjb25kcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIHllYXIgbW9kZWwgd2lsbCBiZSBjcmVhdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICB0aGUgbW9kZWwgcmVwcmVzZW50aW5nIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgZ2V0TW9kZWwobWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgY29uc3Qgcm93TnVtYmVycyA9IFswLCAxXTtcclxuICAgIGNvbnN0IGNvbHVtbk51bWJlcnMgPSBbMCwgMSwgMiwgMywgNF07XHJcblxyXG4gICAgY29uc3Qgc3RhcnRZZWFyID0gbW9tZW50KG1pbGxpc2Vjb25kcykuc3RhcnRPZigneWVhcicpO1xyXG4gICAgY29uc3Qgc3RhcnREYXRlID0gRGxZZWFyTW9kZWxQcm92aWRlci5nZXRTdGFydE9mRGVjYWRlKG1pbGxpc2Vjb25kcyk7XHJcblxyXG4gICAgY29uc3QgZnV0dXJlWWVhciA9IHN0YXJ0RGF0ZS55ZWFyKCkgKyA5O1xyXG4gICAgY29uc3QgcGFzdFllYXIgPSBzdGFydERhdGUueWVhcigpO1xyXG4gICAgY29uc3QgYWN0aXZlVmFsdWUgPSBzdGFydFllYXIudmFsdWVPZigpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRWYWx1ZSA9IHNlbGVjdGVkTWlsbGlzZWNvbmRzID09PSBudWxsIHx8IHNlbGVjdGVkTWlsbGlzZWNvbmRzID09PSB1bmRlZmluZWRcclxuICAgICAgPyBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAgICA6IG1vbWVudChzZWxlY3RlZE1pbGxpc2Vjb25kcykuc3RhcnRPZigneWVhcicpLnZhbHVlT2YoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2aWV3TmFtZTogJ3llYXInLFxyXG4gICAgICB2aWV3TGFiZWw6IGAke3Bhc3RZZWFyfS0ke2Z1dHVyZVllYXJ9YCxcclxuICAgICAgYWN0aXZlRGF0ZTogYWN0aXZlVmFsdWUsXHJcbiAgICAgIGxlZnRCdXR0b246IHtcclxuICAgICAgICB2YWx1ZTogbW9tZW50KHN0YXJ0RGF0ZSkuc3VidHJhY3QoMTAsICd5ZWFycycpLnZhbHVlT2YoKSxcclxuICAgICAgICBhcmlhTGFiZWw6IGBHbyB0byAke3Bhc3RZZWFyIC0gMTB9LSR7cGFzdFllYXIgLSAxfWAsXHJcbiAgICAgICAgY2xhc3Nlczoge30sXHJcbiAgICAgIH0sXHJcbiAgICAgIHJpZ2h0QnV0dG9uOiB7XHJcbiAgICAgICAgdmFsdWU6IG1vbWVudChzdGFydERhdGUpLmFkZCgxMCwgJ3llYXJzJykudmFsdWVPZigpLFxyXG4gICAgICAgIGFyaWFMYWJlbDogYEdvIHRvICR7ZnV0dXJlWWVhciArIDF9LSR7ZnV0dXJlWWVhciArIDEwfWAsXHJcbiAgICAgICAgY2xhc3Nlczoge30sXHJcbiAgICAgIH0sXHJcbiAgICAgIHJvd3M6IHJvd051bWJlcnMubWFwKHJvd09mWWVhcnMuYmluZCh0aGlzKSlcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcm93T2ZZZWFycyhyb3dOdW1iZXIpIHtcclxuXHJcbiAgICAgIGNvbnN0IGN1cnJlbnRNb21lbnQgPSBtb21lbnQoKTtcclxuICAgICAgY29uc3QgY2VsbHMgPSBjb2x1bW5OdW1iZXJzLm1hcCgoY29sdW1uTnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeWVhck1vbWVudCA9IG1vbWVudChzdGFydERhdGUpLmFkZCgocm93TnVtYmVyICogY29sdW1uTnVtYmVycy5sZW5ndGgpICsgY29sdW1uTnVtYmVyLCAneWVhcnMnKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZGlzcGxheTogeWVhck1vbWVudC5mb3JtYXQoJ1lZWVknKSxcclxuICAgICAgICAgIHZhbHVlOiB5ZWFyTW9tZW50LnZhbHVlT2YoKSxcclxuICAgICAgICAgIGNsYXNzZXM6IHtcclxuICAgICAgICAgICAgJ2RsLWFiZHRwLWFjdGl2ZSc6IGFjdGl2ZVZhbHVlID09PSB5ZWFyTW9tZW50LnZhbHVlT2YoKSxcclxuICAgICAgICAgICAgJ2RsLWFiZHRwLXNlbGVjdGVkJzogc2VsZWN0ZWRWYWx1ZSA9PT0geWVhck1vbWVudC52YWx1ZU9mKCksXHJcbiAgICAgICAgICAgICdkbC1hYmR0cC1ub3cnOiB5ZWFyTW9tZW50LmlzU2FtZShjdXJyZW50TW9tZW50LCAneWVhcicpLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4ge2NlbGxzfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGFjdGl2ZSBgeWVhcmAgb25lIHJvdyBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogVGhlIGBhY3RpdmVgIHllYXIgd2lsbCBiZSB0aGUgSmFudWFyeSAxIGBmaXZlICg1KSB5ZWFycyBhZnRlcmAgdGhlIHNwZWNpZmllZCBtaWxsaXNlY29uZHMuXHJcbiAgICogVGhpcyBtb3ZlcyB0aGUgYGFjdGl2ZWAgZGF0ZSBvbmUgcm93IGBkb3duYCBpbiB0aGUgY3VycmVudCBgeWVhcmAgdmlldy5cclxuICAgKlxyXG4gICAqIE1vdmluZyBgZG93bmAgY2FuIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgeWVhciBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IGRlY2FkZSB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgZGVjYWRlIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgZGVjYWRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG5leHQgYHllYXJgIG1vZGVsIGBkb3duYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGB5ZWFyYCBvbmUgcm93IGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgZ29Eb3duKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuYWRkKDUsICd5ZWFyJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYHllYXJgIG9uZSByb3cgYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBUaGUgYGFjdGl2ZWAgeWVhciB3aWxsIGJlIHRoZSBKYW51YXJ5IDEgYGZpdmUgKDUpIHllYXJzIGJlZm9yZWAgdGhlIHNwZWNpZmllZCBtaWxsaXNlY29uZHMuXHJcbiAgICogVGhpcyBtb3ZlcyB0aGUgYGFjdGl2ZWAgZGF0ZSBvbmUgcm93IGB1cGAgaW4gdGhlIGN1cnJlbnQgYHllYXJgIHZpZXcuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYHVwYCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCB5ZWFyIGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgZGVjYWRlIHRoYW5cclxuICAgKiB0aGUgc3BlY2lmaWVkIGBmcm9tTWlsbGlzZWNvbmRzYCwgaW4gdGhpcyBjYXNlIHRoZSBkZWNhZGUgcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCBkZWNhZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgcHJldmlvdXMgYHllYXJgIG1vZGVsIGB1cGAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgeWVhcmAgb25lIHJvdyBgdXBgIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb1VwKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuc3VidHJhY3QoNSwgJ3llYXInKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGBhY3RpdmVgIGB5ZWFyYCBvbmUgKDEpIHllYXIgdG8gdGhlIGBsZWZ0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogVGhlIGBhY3RpdmVgIHllYXIgd2lsbCBiZSB0aGUgSmFudWFyeSAxIGBvbmUgKDEpIHllYXIgYmVmb3JlYCB0aGUgc3BlY2lmaWVkIG1pbGxpc2Vjb25kcy5cclxuICAgKiBUaGlzIG1vdmVzIHRoZSBgYWN0aXZlYCBkYXRlIG9uZSB5ZWFyIGBsZWZ0YCBpbiB0aGUgY3VycmVudCBgeWVhcmAgdmlldy5cclxuICAgKlxyXG4gICAqIE1vdmluZyBgbGVmdGAgY2FuIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgeWVhciBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IGRlY2FkZSB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgZGVjYWRlIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgZGVjYWRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIGB5ZWFyYCBtb2RlbCB0byB0aGUgYGxlZnRgIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYHllYXJgIG9uZSB5ZWFyIHRvIHRoZSBgbGVmdGAgb2YgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb0xlZnQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdWJ0cmFjdCgxLCAneWVhcicpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYGFjdGl2ZWAgYHllYXJgIG9uZSAoMSkgeWVhciB0byB0aGUgYHJpZ2h0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogVGhlIGBhY3RpdmVgIHllYXIgd2lsbCBiZSB0aGUgSmFudWFyeSAxIGBvbmUgKDEpIHllYXIgYWZ0ZXJgIHRoZSBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzLlxyXG4gICAqIFRoaXMgbW92ZXMgdGhlIGBhY3RpdmVgIGRhdGUgb25lIHllYXIgYHJpZ2h0YCBpbiB0aGUgY3VycmVudCBgeWVhcmAgdmlldy5cclxuICAgKlxyXG4gICAqIE1vdmluZyBgcmlnaHRgIGNhbiByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIHllYXIgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBkZWNhZGUgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIGRlY2FkZSByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IGRlY2FkZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBgeWVhcmAgbW9kZWwgdG8gdGhlIGByaWdodGAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgeWVhcmAgb25lIHllYXIgdG8gdGhlIGByaWdodGAgb2YgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb1JpZ2h0KGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuYWRkKDEsICd5ZWFyJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYHllYXJgIG9uZSBkZWNhZGUgYGRvd25gIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKlxyXG4gICAqIFRoZSBgYWN0aXZlYCB5ZWFyIHdpbGwgYmUgdGhlIEphbnVhcnkgMSBgdGVuICgxMCkgeWVhcnMgYWZ0ZXJgIHRoZSBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzLlxyXG4gICAqIFRoaXMgbW92ZXMgdGhlIGBhY3RpdmVgIGRhdGUgb25lIGBwYWdlYCBgZG93bmAgZnJvbSB0aGUgY3VycmVudCBgeWVhcmAgdmlldy5cclxuICAgKlxyXG4gICAqIFBhZ2luZyBgZG93bmAgd2lsbCByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIHllYXIgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBkZWNhZGUgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLiBBcyBhIHJlc3VsdCwgdGhlIGRlY2FkZSByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IGRlY2FkZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBuZXh0IGB5ZWFyYCBtb2RlbCBwYWdlIGBkb3duYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGB5ZWFyYCBvbmUgZGVjYWRlIGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgcGFnZURvd24oZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5hZGQoMTAsICd5ZWFyJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYHllYXJgIG9uZSBkZWNhZGUgYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBUaGUgYGFjdGl2ZWAgeWVhciB3aWxsIGJlIHRoZSBKYW51YXJ5IDEgYHRlbiAoMTApIHllYXJzIGJlZm9yZWAgdGhlIHNwZWNpZmllZCBtaWxsaXNlY29uZHMuXHJcbiAgICogVGhpcyBtb3ZlcyB0aGUgYGFjdGl2ZWAgZGF0ZSBvbmUgYHBhZ2UtdXBgIGZyb20gdGhlIGN1cnJlbnQgYHllYXJgIHZpZXcuXHJcbiAgICpcclxuICAgKiBQYWdpbmcgYHVwYCB3aWxsIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgeWVhciBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IGRlY2FkZSB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AuIEFzIGEgcmVzdWx0LCB0aGUgZGVjYWRlIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgZGVjYWRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG5leHQgYHllYXJgIG1vZGVsIHBhZ2UgYHVwYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGB5ZWFyYCBvbmUgZGVjYWRlIGB1cGAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIHBhZ2VVcChmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLnN1YnRyYWN0KDEwLCAneWVhcicpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYGFjdGl2ZWAgYHllYXJgIHRvIHRoZSBgbGFzdGAgeWVhciBpbiB0aGUgZGVjYWRlLlxyXG4gICAqXHJcbiAgICogVGhlIHZpZXcgb3IgdGltZSByYW5nZSB3aWxsIG5vdCBjaGFuZ2UgdW5sZXNzIHRoZSBgZnJvbU1pbGxpc2Vjb25kc2AgdmFsdWVcclxuICAgKiBpcyBpbiBhIGRpZmZlcmVudCBkZWNhZGUgdGhhbiB0aGUgZGlzcGxheWVkIGRlY2FkZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBgbGFzdGAgYWN0aXZlIGB5ZWFyYCB3aWxsIGJlIGNhbGN1bGF0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGEgbW9kZWwgd2l0aCB0aGUgYGxhc3RgIGNlbGwgaW4gdGhlIHZpZXcgYXMgdGhlIGFjdGl2ZSBgeWVhcmAuXHJcbiAgICovXHJcbiAgZ29FbmQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKFxyXG4gICAgICBEbFllYXJNb2RlbFByb3ZpZGVyLmdldFN0YXJ0T2ZEZWNhZGUoZnJvbU1pbGxpc2Vjb25kcylcclxuICAgICAgICAuYWRkKDksICd5ZWFycycpXHJcbiAgICAgICAgLmVuZE9mKCd5ZWFyJylcclxuICAgICAgICAudmFsdWVPZigpLFxyXG4gICAgICBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGBhY3RpdmVgIGB5ZWFyYCB0byB0aGUgYGZpcnN0YCB5ZWFyIGluIHRoZSBkZWNhZGUuXHJcbiAgICpcclxuICAgKiBUaGUgdmlldyBvciB0aW1lIHJhbmdlIHdpbGwgbm90IGNoYW5nZSB1bmxlc3MgdGhlIGBmcm9tTWlsbGlzZWNvbmRzYCB2YWx1ZVxyXG4gICAqIGlzIGluIGEgZGlmZmVyZW50IGRlY2FkZSB0aGFuIHRoZSBkaXNwbGF5ZWQgZGVjYWRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIGBmaXJzdGAgYWN0aXZlIGB5ZWFyYCB3aWxsIGJlIGNhbGN1bGF0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGEgbW9kZWwgd2l0aCB0aGUgYGZpcnN0YCBjZWxsIGluIHRoZSB2aWV3IGFzIHRoZSBhY3RpdmUgYHllYXJgLlxyXG4gICAqL1xyXG4gIGdvSG9tZShmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwoXHJcbiAgICAgIERsWWVhck1vZGVsUHJvdmlkZXIuZ2V0U3RhcnRPZkRlY2FkZShmcm9tTWlsbGlzZWNvbmRzKVxyXG4gICAgICAgIC5zdGFydE9mKCd5ZWFyJylcclxuICAgICAgICAudmFsdWVPZigpLFxyXG4gICAgICBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19