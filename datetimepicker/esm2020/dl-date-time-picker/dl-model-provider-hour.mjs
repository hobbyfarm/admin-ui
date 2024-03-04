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
 * Default implementation for the `hour` view.
 */
export class DlHourModelProvider {
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
        const startDate = moment(milliseconds).startOf('day');
        const rowNumbers = [0, 1, 2, 3, 4, 5];
        const columnNumbers = [0, 1, 2, 3];
        const previousDay = moment(startDate).subtract(1, 'day');
        const nextDay = moment(startDate).add(1, 'day');
        const activeValue = moment(milliseconds).startOf('hour').valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment(selectedMilliseconds).startOf('hour').valueOf();
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
            const currentMoment = moment();
            const cells = columnNumbers.map((columnNumber) => {
                const hourMoment = moment(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'hours');
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
        return this.getModel(moment(fromMilliseconds).add(4, 'hour').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(4, 'hour').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(1, 'hour').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(1, 'hour').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(1, 'day').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(1, 'day').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds)
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
        return this.getModel(moment(fromMilliseconds).startOf('day').valueOf(), selectedMilliseconds);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtbW9kZWwtcHJvdmlkZXItaG91ci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGwtZGF0ZS10aW1lLXBpY2tlci9kbC1tb2RlbC1wcm92aWRlci1ob3VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7QUFHSCxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFJNUI7O0dBRUc7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBRTlCOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUNQLFFBQXVCLElBQ2hCLENBQUM7SUFHVjs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQkc7SUFDSCxRQUFRLENBQUMsWUFBb0IsRUFBRSxvQkFBNEI7UUFDekQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0RCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25FLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixLQUFLLElBQUksSUFBSSxvQkFBb0IsS0FBSyxTQUFTO1lBQ3ZGLENB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QkFBd0IsRUFBRSxvQkFBNEI7UUFDM0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50IERhbGUgTG90dHMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogaHR0cDovL3d3dy5kYWxlbG90dHMuY29tXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2RhbGVsb3R0cy9hbmd1bGFyLWJvb3RzdHJhcC1kYXRldGltZXBpY2tlci9ibG9iL21hc3Rlci9MSUNFTlNFXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQge0RsRGF0ZVRpbWVQaWNrZXJNb2RlbH0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtcGlja2VyLW1vZGVsJztcclxuaW1wb3J0IHtEbE1vZGVsUHJvdmlkZXJ9IGZyb20gJy4vZGwtbW9kZWwtcHJvdmlkZXInO1xyXG5cclxuLyoqXHJcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBgaG91cmAgdmlldy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEbEhvdXJNb2RlbFByb3ZpZGVyIGltcGxlbWVudHMgRGxNb2RlbFByb3ZpZGVyIHtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVjZWl2ZXMgaW5wdXQgY2hhbmdlcyBkZXRlY3RlZCBieSBBbmd1bGFyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNoYW5nZXNcclxuICAgKiAgdGhlIGlucHV0IGNoYW5nZXMgZGV0ZWN0ZWQgYnkgQW5ndWxhci5cclxuICAgKi9cclxuICBvbkNoYW5nZXMoXHJcbiAgICBfY2hhbmdlczogU2ltcGxlQ2hhbmdlc1xyXG4gICk6IHZvaWQge31cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGBob3VyYCBtb2RlbCBmb3IgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gYGxvY2FsYCB0aW1lIHdpdGggdGhlXHJcbiAgICogYGFjdGl2ZWAgaG91ciBzZXQgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgZGF5LlxyXG4gICAqXHJcbiAgICogVGhlIGBob3VyYCBtb2RlbCByZXByZXNlbnRzIGEgZGF5ICgyNCBob3VycykgYXMgc2l4IHJvd3Mgd2l0aCBmb3VyIGNvbHVtbnNcclxuICAgKiBhbmQgZWFjaCBjZWxsIHJlcHJlc2VudGluZyBvbmUtaG91ciBpbmNyZW1lbnRzLlxyXG4gICAqXHJcbiAgICogVGhlIGhvdXIgYWx3YXlzIHN0YXJ0cyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBob3VyLlxyXG4gICAqXHJcbiAgICogRWFjaCBjZWxsIHJlcHJlc2VudHMgYSBvbmUtaG91ciBpbmNyZW1lbnQgc3RhcnRpbmcgYXQgbWlkbmlnaHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBtaW51dGUgbW9kZWwgd2lsbCBiZSBjcmVhdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICB0aGUgbW9kZWwgcmVwcmVzZW50aW5nIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgZ2V0TW9kZWwobWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgY29uc3Qgc3RhcnREYXRlID0gbW9tZW50KG1pbGxpc2Vjb25kcykuc3RhcnRPZignZGF5Jyk7XHJcblxyXG4gICAgY29uc3Qgcm93TnVtYmVycyA9IFswLCAxLCAyLCAzLCA0LCA1XTtcclxuICAgIGNvbnN0IGNvbHVtbk51bWJlcnMgPSBbMCwgMSwgMiwgM107XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNEYXkgPSBtb21lbnQoc3RhcnREYXRlKS5zdWJ0cmFjdCgxLCAnZGF5Jyk7XHJcbiAgICBjb25zdCBuZXh0RGF5ID0gbW9tZW50KHN0YXJ0RGF0ZSkuYWRkKDEsICdkYXknKTtcclxuICAgIGNvbnN0IGFjdGl2ZVZhbHVlID0gbW9tZW50KG1pbGxpc2Vjb25kcykuc3RhcnRPZignaG91cicpLnZhbHVlT2YoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWUgPSBzZWxlY3RlZE1pbGxpc2Vjb25kcyA9PT0gbnVsbCB8fCBzZWxlY3RlZE1pbGxpc2Vjb25kcyA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgICAgOiBtb21lbnQoc2VsZWN0ZWRNaWxsaXNlY29uZHMpLnN0YXJ0T2YoJ2hvdXInKS52YWx1ZU9mKCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmlld05hbWU6ICdob3VyJyxcclxuICAgICAgdmlld0xhYmVsOiBzdGFydERhdGUuZm9ybWF0KCdsbCcpLFxyXG4gICAgICBhY3RpdmVEYXRlOiBhY3RpdmVWYWx1ZSxcclxuICAgICAgbGVmdEJ1dHRvbjoge1xyXG4gICAgICAgIHZhbHVlOiBwcmV2aW91c0RheS52YWx1ZU9mKCksXHJcbiAgICAgICAgYXJpYUxhYmVsOiBgR28gdG8gJHtwcmV2aW91c0RheS5mb3JtYXQoJ2xsJyl9YCxcclxuICAgICAgICBjbGFzc2VzOiB7fSxcclxuICAgICAgfSxcclxuICAgICAgdXBCdXR0b246IHtcclxuICAgICAgICB2YWx1ZTogc3RhcnREYXRlLnZhbHVlT2YoKSxcclxuICAgICAgICBhcmlhTGFiZWw6IGBHbyB0byAke3N0YXJ0RGF0ZS5mb3JtYXQoJ01NTSBZWVlZJyl9YCxcclxuICAgICAgICBjbGFzc2VzOiB7fSxcclxuICAgICAgfSxcclxuICAgICAgcmlnaHRCdXR0b246IHtcclxuICAgICAgICB2YWx1ZTogbmV4dERheS52YWx1ZU9mKCksXHJcbiAgICAgICAgYXJpYUxhYmVsOiBgR28gdG8gJHtuZXh0RGF5LmZvcm1hdCgnbGwnKX1gLFxyXG4gICAgICAgIGNsYXNzZXM6IHt9LFxyXG4gICAgICB9LFxyXG4gICAgICByb3dzOiByb3dOdW1iZXJzLm1hcChyb3dPZkhvdXJzKVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3dPZkhvdXJzKHJvd051bWJlcikge1xyXG5cclxuICAgICAgY29uc3QgY3VycmVudE1vbWVudCA9IG1vbWVudCgpO1xyXG4gICAgICBjb25zdCBjZWxscyA9IGNvbHVtbk51bWJlcnMubWFwKChjb2x1bW5OdW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBob3VyTW9tZW50ID0gbW9tZW50KHN0YXJ0RGF0ZSkuYWRkKChyb3dOdW1iZXIgKiBjb2x1bW5OdW1iZXJzLmxlbmd0aCkgKyBjb2x1bW5OdW1iZXIsICdob3VycycpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBob3VyTW9tZW50LmZvcm1hdCgnTFQnKSxcclxuICAgICAgICAgIGFyaWFMYWJlbDogaG91ck1vbWVudC5mb3JtYXQoJ0xMTCcpLFxyXG4gICAgICAgICAgdmFsdWU6IGhvdXJNb21lbnQudmFsdWVPZigpLFxyXG4gICAgICAgICAgY2xhc3Nlczoge1xyXG4gICAgICAgICAgICAnZGwtYWJkdHAtYWN0aXZlJzogYWN0aXZlVmFsdWUgPT09IGhvdXJNb21lbnQudmFsdWVPZigpLFxyXG4gICAgICAgICAgICAnZGwtYWJkdHAtc2VsZWN0ZWQnOiBzZWxlY3RlZFZhbHVlID09PSBob3VyTW9tZW50LnZhbHVlT2YoKSxcclxuICAgICAgICAgICAgJ2RsLWFiZHRwLW5vdyc6IGhvdXJNb21lbnQuaXNTYW1lKGN1cnJlbnRNb21lbnQsICdob3VyJyksXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB7Y2VsbHN9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYWN0aXZlIGBob3VyYCBvbmUgcm93IGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYGRvd25gIGNhbiByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIGhvdXIgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBkYXkgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIGRheSByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IGhvdXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgbmV4dCBgaG91cmAgbW9kZWwgYGRvd25gIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYGhvdXJgIG9uZSByb3cgYGRvd25gIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb0Rvd24oZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5hZGQoNCwgJ2hvdXInKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGFjdGl2ZSBgaG91cmAgb25lIHJvdyBgdXBgIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKlxyXG4gICAqIE1vdmluZyBgdXBgIGNhbiByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIGhvdXIgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBkYXkgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIGRheSByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IGhvdXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgbmV4dCBgaG91cmAgbW9kZWwgYHVwYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBob3VyYCBvbmUgcm93IGB1cGAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvVXAoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdWJ0cmFjdCg0LCAnaG91cicpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYGFjdGl2ZWAgaG91ciBvbmUgY2VsbCBgbGVmdGAgaW4gdGhlIGN1cnJlbnQgYGhvdXJgIHZpZXcuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYGxlZnRgIGNhbiByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIGhvdXIgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBkYXkgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIGRheSByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IHllYXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgYGhvdXJgIG1vZGVsIHRvIHRoZSBgbGVmdGAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgaG91cmAgb25lIGNlbGwgdG8gdGhlIGBsZWZ0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvTGVmdChmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLnN1YnRyYWN0KDEsICdob3VyJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBob3VyIG9uZSBjZWxsIGByaWdodGAgaW4gdGhlIGN1cnJlbnQgYGhvdXJgIHZpZXcuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYHJpZ2h0YCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBob3VyIGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgZGF5IHRoYW5cclxuICAgKiB0aGUgc3BlY2lmaWVkIGBmcm9tTWlsbGlzZWNvbmRzYCwgaW4gdGhpcyBjYXNlIHRoZSBkYXkgcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCB5ZWFyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIGBob3VyYCBtb2RlbCB0byB0aGUgYHJpZ2h0YCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBob3VyYCBvbmUgY2VsbCB0byB0aGUgYHJpZ2h0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvUmlnaHQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5hZGQoMSwgJ2hvdXInKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGFjdGl2ZSBgaG91cmAgb25lIGRheSBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogUGFnaW5nIGBkb3duYCB3aWxsIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgaG91ciBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IGRheSB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AuIEFzIGEgcmVzdWx0LCB0aGUgZGF5IHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgeWVhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBuZXh0IGBob3VyYCBtb2RlbCBwYWdlIGBkb3duYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBob3VyYCBvbmUgZGF5IGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgcGFnZURvd24oZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5hZGQoMSwgJ2RheScpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYWN0aXZlIGBob3VyYCBvbmUgZGF5IGB1cGAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogUGFnaW5nIGB1cGAgd2lsbCByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIGhvdXIgYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCBkYXkgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLiBBcyBhIHJlc3VsdCwgdGhlIGRheSByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IHllYXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgbmV4dCBgaG91cmAgbW9kZWwgcGFnZSBgdXBgIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYGhvdXJgIG9uZSBkYXkgYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgcGFnZVVwKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuc3VidHJhY3QoMSwgJ2RheScpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYGFjdGl2ZWAgYGhvdXJgIHRvIGAxMTowMCBwbWAgb2YgdGhlIGN1cnJlbnQgZGF5LlxyXG4gICAqXHJcbiAgICogVGhlIHZpZXcgb3IgdGltZSByYW5nZSB3aWxsIG5vdCBjaGFuZ2UgdW5sZXNzIHRoZSBgZnJvbU1pbGxpc2Vjb25kc2AgdmFsdWVcclxuICAgKiBpcyBpbiBhIGRpZmZlcmVudCBkYXkgdGhhbiB0aGUgZGlzcGxheWVkIGRlY2FkZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIGAxMTowMCBwbWAgd2lsbCBiZSBjYWxjdWxhdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBhIG1vZGVsIHdpdGggdGhlIGAxMTowMCBwbWAgY2VsbCBpbiB0aGUgdmlldyBhcyB0aGUgYWN0aXZlIGBob3VyYC5cclxuICAgKi9cclxuICBnb0VuZChmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50XHJcbiAgICAoZnJvbU1pbGxpc2Vjb25kcylcclxuICAgICAgLmVuZE9mKCdkYXknKVxyXG4gICAgICAuc3RhcnRPZignaG91cicpXHJcbiAgICAgIC52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGBhY3RpdmVgIGBob3VyYCB0byBgbWlkbmlnaHRgIG9mIHRoZSBjdXJyZW50IGRheS5cclxuICAgKlxyXG4gICAqIFRoZSB2aWV3IG9yIHRpbWUgcmFuZ2Ugd2lsbCBub3QgY2hhbmdlIHVubGVzcyB0aGUgYGZyb21NaWxsaXNlY29uZHNgIHZhbHVlXHJcbiAgICogaXMgaW4gYSBkaWZmZXJlbnQgZGF5IHRoYW4gdGhlIGRpc3BsYXllZCBkZWNhZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCBgbWlkbmlnaHRgIHdpbGwgYmUgY2FsY3VsYXRlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgYSBtb2RlbCB3aXRoIHRoZSBgbWlkbmlnaHRgIGNlbGwgaW4gdGhlIHZpZXcgYXMgdGhlIGFjdGl2ZSBgaG91cmAuXHJcbiAgICovXHJcbiAgZ29Ib21lKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuc3RhcnRPZignZGF5JykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==