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
 * Default implementation for the `day` view.
 */
export class DlDayModelProvider {
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
        const startOfMonth = moment(milliseconds).startOf('month');
        const endOfMonth = moment(milliseconds).endOf('month');
        const startOfView = moment(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');
        const rowNumbers = [0, 1, 2, 3, 4, 5];
        const columnNumbers = [0, 1, 2, 3, 4, 5, 6];
        const previousMonth = moment(startOfMonth).subtract(1, 'month');
        const nextMonth = moment(startOfMonth).add(1, 'month');
        const activeValue = moment(milliseconds).startOf('day').valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment(selectedMilliseconds).startOf('day').valueOf();
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
            rowLabels: columnNumbers.map((column) => moment().weekday(column).format('dd')),
            rows: rowNumbers.map(rowOfDays)
        };
        function rowOfDays(rowNumber) {
            const currentMoment = moment();
            const cells = columnNumbers.map((columnNumber) => {
                const dayMoment = moment(startOfView).add((rowNumber * columnNumbers.length) + columnNumber, 'days');
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
        return this.getModel(moment(fromMilliseconds).add(7, 'days').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(7, 'days').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(1, 'day').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(1, 'day').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(1, 'month').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(1, 'month').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds)
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
        return this.getModel(moment(fromMilliseconds).startOf('month').valueOf(), selectedMilliseconds);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtbW9kZWwtcHJvdmlkZXItZGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9kbC1kYXRlLXRpbWUtcGlja2VyL2RsLW1vZGVsLXByb3ZpZGVyLWRheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBR0gsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBSTVCOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQUU3Qjs7Ozs7T0FLRztJQUNILFNBQVMsQ0FDUCxRQUF1QixJQUNoQixDQUFDO0lBRVY7Ozs7Ozs7Ozs7Ozs7Ozs7O09BaUJHO0lBQ0gsUUFBUSxDQUFDLFlBQW9CLEVBQUUsb0JBQTRCO1FBRXpELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFNUYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFNUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEUsTUFBTSxTQUFT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QUFNLENBQUMsZ0JBQXdCLEVBQUUsb0JBQTRCO1FBQzNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDdEcsQ0FBQztJQUdEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILEtBQUssQ0FBQyxnQkFBd0IsRUFBRSxvQkFBNEI7UUFDMUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQzthQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILE1BQU0sQ0FBQyxnQkFBd0IsRUFBRSxvQkFBNEI7UUFDM0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50IERhbGUgTG90dHMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogaHR0cDovL3d3dy5kYWxlbG90dHMuY29tXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2RhbGVsb3R0cy9hbmd1bGFyLWJvb3RzdHJhcC1kYXRldGltZXBpY2tlci9ibG9iL21hc3Rlci9MSUNFTlNFXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQge0RsRGF0ZVRpbWVQaWNrZXJNb2RlbH0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtcGlja2VyLW1vZGVsJztcclxuaW1wb3J0IHtEbE1vZGVsUHJvdmlkZXJ9IGZyb20gJy4vZGwtbW9kZWwtcHJvdmlkZXInO1xyXG5cclxuLyoqXHJcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBgZGF5YCB2aWV3LlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERsRGF5TW9kZWxQcm92aWRlciBpbXBsZW1lbnRzIERsTW9kZWxQcm92aWRlciB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlY2VpdmVzIGlucHV0IGNoYW5nZXMgZGV0ZWN0ZWQgYnkgQW5ndWxhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjaGFuZ2VzXHJcbiAgICogIHRoZSBpbnB1dCBjaGFuZ2VzIGRldGVjdGVkIGJ5IEFuZ3VsYXIuXHJcbiAgICovXHJcbiAgb25DaGFuZ2VzKFxyXG4gICAgX2NoYW5nZXM6IFNpbXBsZUNoYW5nZXNcclxuICApOiB2b2lkIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGBkYXlgIG1vZGVsIGZvciB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiBgbG9jYWxgIHRpbWUgd2l0aCB0aGVcclxuICAgKiBgYWN0aXZlYCBkYXkgc2V0IHRvIHRoZSBmaXJzdCBkYXkgb2YgdGhlIG1vbnRoLlxyXG4gICAqXHJcbiAgICogVGhlIGBkYXlgIG1vZGVsIHJlcHJlc2VudHMgYSBtb250aCAoNDIgZGF5cykgYXMgc2l4IHJvd3Mgd2l0aCBzZXZlbiBjb2x1bW5zXHJcbiAgICogYW5kIGVhY2ggY2VsbCByZXByZXNlbnRpbmcgb25lLWRheSBpbmNyZW1lbnRzLlxyXG4gICAqXHJcbiAgICogVGhlIGBkYXlgIGFsd2F5cyBzdGFydHMgYXQgbWlkbmlnaHQuXHJcbiAgICpcclxuICAgKiBFYWNoIGNlbGwgcmVwcmVzZW50cyBhIG9uZS1kYXkgaW5jcmVtZW50IGF0IG1pZG5pZ2h0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgbWludXRlIG1vZGVsIHdpbGwgYmUgY3JlYXRlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgdGhlIG1vZGVsIHJlcHJlc2VudGluZyB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdldE1vZGVsKG1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuXHJcbiAgICBjb25zdCBzdGFydE9mTW9udGggPSBtb21lbnQobWlsbGlzZWNvbmRzKS5zdGFydE9mKCdtb250aCcpO1xyXG4gICAgY29uc3QgZW5kT2ZNb250aCA9IG1vbWVudChtaWxsaXNlY29uZHMpLmVuZE9mKCdtb250aCcpO1xyXG4gICAgY29uc3Qgc3RhcnRPZlZpZXcgPSBtb21lbnQoc3RhcnRPZk1vbnRoKS5zdWJ0cmFjdChNYXRoLmFicyhzdGFydE9mTW9udGgud2Vla2RheSgpKSwgJ2RheXMnKTtcclxuXHJcbiAgICBjb25zdCByb3dOdW1iZXJzID0gWzAsIDEsIDIsIDMsIDQsIDVdO1xyXG4gICAgY29uc3QgY29sdW1uTnVtYmVycyA9IFswLCAxLCAyLCAzLCA0LCA1LCA2XTtcclxuXHJcbiAgICBjb25zdCBwcmV2aW91c01vbnRoID0gbW9tZW50KHN0YXJ0T2ZNb250aCkuc3VidHJhY3QoMSwgJ21vbnRoJyk7XHJcbiAgICBjb25zdCBuZXh0TW9udGggPSBtb21lbnQoc3RhcnRPZk1vbnRoKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICBjb25zdCBhY3RpdmVWYWx1ZSA9IG1vbWVudChtaWxsaXNlY29uZHMpLnN0YXJ0T2YoJ2RheScpLnZhbHVlT2YoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWUgPSBzZWxlY3RlZE1pbGxpc2Vjb25kcyA9PT0gbnVsbCB8fCBzZWxlY3RlZE1pbGxpc2Vjb25kcyA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgICAgOiBtb21lbnQoc2VsZWN0ZWRNaWxsaXNlY29uZHMpLnN0YXJ0T2YoJ2RheScpLnZhbHVlT2YoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2aWV3TmFtZTogJ2RheScsXHJcbiAgICAgIHZpZXdMYWJlbDogc3RhcnRPZk1vbnRoLmZvcm1hdCgnTU1NIFlZWVknKSxcclxuICAgICAgYWN0aXZlRGF0ZTogYWN0aXZlVmFsdWUsXHJcbiAgICAgIGxlZnRCdXR0b246IHtcclxuICAgICAgICB2YWx1ZTogcHJldmlvdXNNb250aC52YWx1ZU9mKCksXHJcbiAgICAgICAgYXJpYUxhYmVsOiBgR28gdG8gJHtwcmV2aW91c01vbnRoLmZvcm1hdCgnTU1NIFlZWVknKX1gLFxyXG4gICAgICAgIGNsYXNzZXM6IHt9LFxyXG4gICAgICB9LFxyXG4gICAgICB1cEJ1dHRvbjoge1xyXG4gICAgICAgIHZhbHVlOiBzdGFydE9mTW9udGgudmFsdWVPZigpLFxyXG4gICAgICAgIGFyaWFMYWJlbDogYEdvIHRvIG1vbnRoIHZpZXdgLFxyXG4gICAgICAgIGNsYXNzZXM6IHt9LFxyXG4gICAgICB9LFxyXG4gICAgICByaWdodEJ1dHRvbjoge1xyXG4gICAgICAgIHZhbHVlOiBuZXh0TW9udGgudmFsdWVPZigpLFxyXG4gICAgICAgIGFyaWFMYWJlbDogYEdvIHRvICR7bmV4dE1vbnRoLmZvcm1hdCgnTU1NIFlZWVknKX1gLFxyXG4gICAgICAgIGNsYXNzZXM6IHt9LFxyXG4gICAgICB9LFxyXG4gICAgICByb3dMYWJlbHM6IGNvbHVtbk51bWJlcnMubWFwKChjb2x1bW4pID0+IG1vbWVudCgpLndlZWtkYXkoY29sdW1uKS5mb3JtYXQoJ2RkJykpLFxyXG4gICAgICByb3dzOiByb3dOdW1iZXJzLm1hcChyb3dPZkRheXMpXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvd09mRGF5cyhyb3dOdW1iZXIpIHtcclxuICAgICAgY29uc3QgY3VycmVudE1vbWVudCA9IG1vbWVudCgpO1xyXG4gICAgICBjb25zdCBjZWxscyA9IGNvbHVtbk51bWJlcnMubWFwKChjb2x1bW5OdW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBkYXlNb21lbnQgPSBtb21lbnQoc3RhcnRPZlZpZXcpLmFkZCgocm93TnVtYmVyICogY29sdW1uTnVtYmVycy5sZW5ndGgpICsgY29sdW1uTnVtYmVyLCAnZGF5cycpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBkYXlNb21lbnQuZm9ybWF0KCdEJyksXHJcbiAgICAgICAgICBhcmlhTGFiZWw6IGRheU1vbWVudC5mb3JtYXQoJ2xsJyksXHJcbiAgICAgICAgICB2YWx1ZTogZGF5TW9tZW50LnZhbHVlT2YoKSxcclxuICAgICAgICAgIGNsYXNzZXM6IHtcclxuICAgICAgICAgICAgJ2RsLWFiZHRwLWFjdGl2ZSc6IGFjdGl2ZVZhbHVlID09PSBkYXlNb21lbnQudmFsdWVPZigpLFxyXG4gICAgICAgICAgICAnZGwtYWJkdHAtZnV0dXJlJzogZGF5TW9tZW50LmlzQWZ0ZXIoZW5kT2ZNb250aCksXHJcbiAgICAgICAgICAgICdkbC1hYmR0cC1wYXN0JzogZGF5TW9tZW50LmlzQmVmb3JlKHN0YXJ0T2ZNb250aCksXHJcbiAgICAgICAgICAgICdkbC1hYmR0cC1zZWxlY3RlZCc6IHNlbGVjdGVkVmFsdWUgPT09IGRheU1vbWVudC52YWx1ZU9mKCksXHJcbiAgICAgICAgICAgICdkbC1hYmR0cC1ub3cnOiBkYXlNb21lbnQuaXNTYW1lKGN1cnJlbnRNb21lbnQsICdkYXknKSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHtjZWxsc307XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYGRheWAgb25lIHJvdyBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogTW92aW5nIGBkb3duYCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBkYXkgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBtb250aCB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgbW9udGggcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCBob3VyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG5leHQgYGRheWAgbW9kZWwgYGRvd25gIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYGRheWAgb25lIHJvdyBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvRG93bihmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLmFkZCg3LCAnZGF5cycpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYWN0aXZlIGBkYXlgIG9uZSByb3cgYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYHVwYCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBkYXkgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBtb250aCB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgbW9udGggcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCBob3VyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG5leHQgYGRheWAgbW9kZWwgYHVwYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBkYXlgIG9uZSByb3cgYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgZ29VcChmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLnN1YnRyYWN0KDcsICdkYXlzJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBkYXkgb25lIGNlbGwgYGxlZnRgIGluIHRoZSBjdXJyZW50IGBkYXlgIHZpZXcuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYGxlZnRgIGNhbiByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIGRheSBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IG1vbnRoIHRoYW5cclxuICAgKiB0aGUgc3BlY2lmaWVkIGBmcm9tTWlsbGlzZWNvbmRzYCwgaW4gdGhpcyBjYXNlIHRoZSBtb250aCByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IHllYXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgYGRheWAgbW9kZWwgdG8gdGhlIGBsZWZ0YCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBkYXlgIG9uZSBjZWxsIHRvIHRoZSBgbGVmdGAgb2YgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb0xlZnQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdWJ0cmFjdCgxLCAnZGF5JykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBkYXkgb25lIGNlbGwgYHJpZ2h0YCBpbiB0aGUgY3VycmVudCBgZGF5YCB2aWV3LlxyXG4gICAqXHJcbiAgICogTW92aW5nIGByaWdodGAgY2FuIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgZGF5IGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgbW9udGggdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIG1vbnRoIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgeWVhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBgZGF5YCBtb2RlbCB0byB0aGUgYHJpZ2h0YCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBkYXlgIG9uZSBjZWxsIHRvIHRoZSBgcmlnaHRgIG9mIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgZ29SaWdodChmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLmFkZCgxLCAnZGF5JykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYGRheWAgb25lIG1vbnRoIGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBQYWdpbmcgYGRvd25gIHdpbGwgcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBkYXkgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBtb250aCB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AuIEFzIGEgcmVzdWx0LCB0aGUgbW9udGggcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCB5ZWFyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG5leHQgYGRheWAgbW9kZWwgcGFnZSBgZG93bmAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgZGF5YCBvbmUgbW9udGggYGRvd25gIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBwYWdlRG93bihmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLmFkZCgxLCAnbW9udGgnKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGFjdGl2ZSBgZGF5YCBvbmUgbW9udGggYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBQYWdpbmcgYHVwYCB3aWxsIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgZGF5IGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgbW9udGggdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLiBBcyBhIHJlc3VsdCwgdGhlIG1vbnRoIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgeWVhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBuZXh0IGBkYXlgIG1vZGVsIHBhZ2UgYHVwYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBkYXlgIG9uZSBtb250aCBgdXBgIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBwYWdlVXAoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBgZGF5YCB0byB0aGUgbGFzdCBkYXkgb2YgdGhlIG1vbnRoLlxyXG4gICAqXHJcbiAgICogVGhlIHZpZXcgb3IgdGltZSByYW5nZSB3aWxsIG5vdCBjaGFuZ2UgdW5sZXNzIHRoZSBgZnJvbU1pbGxpc2Vjb25kc2AgdmFsdWVcclxuICAgKiBpcyBpbiBhIGRpZmZlcmVudCBkYXkgdGhhbiB0aGUgZGlzcGxheWVkIGRlY2FkZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBsYXN0IGRheSBvZiB0aGUgbW9udGggd2lsbCBiZSBjYWxjdWxhdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBhIG1vZGVsIHdpdGggdGhlIGxhc3QgY2VsbCBpbiB0aGUgdmlldyBhcyB0aGUgYWN0aXZlIGBkYXlgLlxyXG4gICAqL1xyXG4gIGdvRW5kKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcylcclxuICAgICAgLmVuZE9mKCdtb250aCcpLnN0YXJ0T2YoJ2RheScpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYGFjdGl2ZWAgYGRheWAgdG8gdGhlIGZpcnN0IGRheSBvZiB0aGUgbW9udGguXHJcbiAgICpcclxuICAgKiBUaGUgdmlldyBvciB0aW1lIHJhbmdlIHdpbGwgbm90IGNoYW5nZSB1bmxlc3MgdGhlIGBmcm9tTWlsbGlzZWNvbmRzYCB2YWx1ZVxyXG4gICAqIGlzIGluIGEgZGlmZmVyZW50IGRheSB0aGFuIHRoZSBkaXNwbGF5ZWQgZGVjYWRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIGZpcnN0IGRheSBvZiB0aGUgbW9udGggd2lsbCBiZSBjYWxjdWxhdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBhIG1vZGVsIHdpdGggdGhlIGZpcnN0IGNlbGwgaW4gdGhlIHZpZXcgYXMgdGhlIGFjdGl2ZSBgZGF5YC5cclxuICAgKi9cclxuICBnb0hvbWUoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdGFydE9mKCdtb250aCcpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxufVxyXG4iXX0=