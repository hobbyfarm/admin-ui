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
 * Default implementation for the `minute` view.
 */
export class DlMinuteModelProvider {
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
        const startDate = moment(milliseconds).startOf('hour');
        const currentMilliseconds = moment().valueOf();
        const minuteSteps = new Array(Math.ceil(60 / this.step)).fill(0).map((zero, index) => zero + index * this.step);
        const minuteValues = minuteSteps.map((minutesToAdd) => moment(startDate).add(minutesToAdd, 'minutes').valueOf());
        const activeValue = moment(minuteValues.filter((value) => value <= milliseconds).pop()).valueOf();
        const nowValue = currentMilliseconds >= startDate.valueOf() && currentMilliseconds <= moment(startDate).endOf('hour').valueOf()
            ? moment(minuteValues.filter((value) => value <= currentMilliseconds).pop()).valueOf()
            : null;
        const previousHour = moment(startDate).subtract(1, 'hour');
        const nextHour = moment(startDate).add(1, 'hour');
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment(minuteValues.filter((value) => value <= selectedMilliseconds).pop()).valueOf();
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
            const minuteMoment = moment(startDate).add(stepMinutes, 'minutes');
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
        return this.getModel(moment(fromMilliseconds).add(this.step * 4, 'minutes').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(this.step * 4, 'minutes').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(this.step, 'minutes').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(this.step, 'minutes').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(1, 'hour').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(1, 'hour').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds)
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
        return this.getModel(moment(fromMilliseconds).startOf('hour').valueOf(), selectedMilliseconds);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtbW9kZWwtcHJvdmlkZXItbWludXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9kbC1kYXRlLXRpbWUtcGlja2VyL2RsLW1vZGVsLXByb3ZpZGVyLW1pbnV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBR0gsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBSTVCOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHFCQUFxQjtJQUFsQztRQUVVLFNBQUksR0FBRyxDQUFDLENBQUM7SUF3UW5CLENBQUM7SUF0UUM7Ozs7Ozs7Ozs7T0FVRztJQUVILFNBQVMsQ0FBQyxPQUFzQjtRQUU5QixNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUvQyxJQUFJLGdCQUFnQjtlQUNmLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxLQUFLLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxFQUNyRTtZQUNBLElBQUksQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO1lBQzFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7U0FDRjtJQUNILENBQUM7SUFHRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CRztJQUNILFFBQVEsQ0FBQyxZQUFvQixFQUFFLG9CQUE0QjtRQUN6RCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFL0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUks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QUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxLQUFLLENBQUMsZ0JBQXdCLEVBQUUsb0JBQTRCO1FBQzFELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7YUFDMUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzthQUNiLE9BQU8sRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILE1BQU0sQ0FBQyxnQkFBd0IsRUFBRSxvQkFBNEI7UUFDM0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50IERhbGUgTG90dHMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogaHR0cDovL3d3dy5kYWxlbG90dHMuY29tXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2RhbGVsb3R0cy9hbmd1bGFyLWJvb3RzdHJhcC1kYXRldGltZXBpY2tlci9ibG9iL21hc3Rlci9MSUNFTlNFXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQge0RsRGF0ZVRpbWVQaWNrZXJNb2RlbH0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtcGlja2VyLW1vZGVsJztcclxuaW1wb3J0IHtEbE1vZGVsUHJvdmlkZXJ9IGZyb20gJy4vZGwtbW9kZWwtcHJvdmlkZXInO1xyXG5cclxuLyoqXHJcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBgbWludXRlYCB2aWV3LlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERsTWludXRlTW9kZWxQcm92aWRlciBpbXBsZW1lbnRzIERsTW9kZWxQcm92aWRlciB7XHJcblxyXG4gIHByaXZhdGUgc3RlcCA9IDU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlY2VpdmVzIGBtaW51dGVTdGVwYCBjb25maWd1cmF0aW9uIGNoYW5nZXMgZGV0ZWN0ZWQgYnkgQW5ndWxhci5cclxuICAgKlxyXG4gICAqIENoYW5nZXMgd2hlcmUgdGhlIHZhbHVlIGhhcyBub3QgY2hhbmdlZCBhcmUgaWdub3JlZC5cclxuICAgKlxyXG4gICAqIFNldHRpbmcgYG1pbnV0ZVN0ZXBgIHRvIGBudWxsYCBvciBgdW5kZWZpbmVkYCB3aWxsIHJlc3VsdCBpbiBhXHJcbiAgICogbWludXRlU3RlcCBvZiBgNWAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY2hhbmdlc1xyXG4gICAqICB0aGUgaW5wdXQgY2hhbmdlcyBkZXRlY3RlZCBieSBBbmd1bGFyLlxyXG4gICAqL1xyXG5cclxuICBvbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG5cclxuICAgIGNvbnN0IG1pbnV0ZVN0ZXBDaGFuZ2UgPSBjaGFuZ2VzWydtaW51dGVTdGVwJ107XHJcblxyXG4gICAgaWYgKG1pbnV0ZVN0ZXBDaGFuZ2VcclxuICAgICAgJiYgKG1pbnV0ZVN0ZXBDaGFuZ2UucHJldmlvdXNWYWx1ZSAhPT0gbWludXRlU3RlcENoYW5nZS5jdXJyZW50VmFsdWUpXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5zdGVwID0gbWludXRlU3RlcENoYW5nZS5jdXJyZW50VmFsdWU7XHJcbiAgICAgIGlmICh0aGlzLnN0ZXAgPT09IG51bGwgfHwgdGhpcy5zdGVwID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnN0ZXAgPSA1O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYG1pbnV0ZWAgbW9kZWwgZm9yIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIGBsb2NhbGAgdGltZSB3aXRoIHRoZVxyXG4gICAqIGBhY3RpdmVgIG1pbnV0ZSBzZXQgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgaG91ci5cclxuICAgKlxyXG4gICAqIFRoZSBgbWludXRlYCBtb2RlbCByZXByZXNlbnRzIGFuIGhvdXIgKDYwIG1pbnV0ZXMpIGFzIHRocmVlIHJvd3Mgd2l0aCBmb3VyIGNvbHVtbnNcclxuICAgKiBhbmQgZWFjaCBjZWxsIHJlcHJlc2VudGluZyA1LW1pbnV0ZSBpbmNyZW1lbnRzLlxyXG4gICAqXHJcbiAgICogVGhlIGhvdXIgYWx3YXlzIHN0YXJ0cyBhdCBtaWRuaWdodC5cclxuICAgKlxyXG4gICAqIEVhY2ggY2VsbCByZXByZXNlbnRzIGEgNS1taW51dGUgaW5jcmVtZW50IHN0YXJ0aW5nIGF0IG1pZG5pZ2h0LlxyXG4gICAqXHJcbiAgICogVGhlIGBhY3RpdmVgIG1pbnV0ZSB3aWxsIGJlIHRoZSA1LW1pbnV0ZSBpbmNyZW1lbnRzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG1pbGxpc2Vjb25kcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG1pbnV0ZSBtb2RlbCB3aWxsIGJlIGNyZWF0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIHRoZSBtb2RlbCByZXByZXNlbnRpbmcgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnZXRNb2RlbChtaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICBjb25zdCBzdGFydERhdGUgPSBtb21lbnQobWlsbGlzZWNvbmRzKS5zdGFydE9mKCdob3VyJyk7XHJcbiAgICBjb25zdCBjdXJyZW50TWlsbGlzZWNvbmRzID0gbW9tZW50KCkudmFsdWVPZigpO1xyXG5cclxuICAgIGNvbnN0IG1pbnV0ZVN0ZXBzID0gbmV3IEFycmF5KE1hdGguY2VpbCg2MCAvIHRoaXMuc3RlcCkpLmZpbGwoMCkubWFwKCh6ZXJvLCBpbmRleCkgPT4gemVybyArIGluZGV4ICogdGhpcy5zdGVwKTtcclxuICAgIGNvbnN0IG1pbnV0ZVZhbHVlcyA9IG1pbnV0ZVN0ZXBzLm1hcCgobWludXRlc1RvQWRkKSA9PiBtb21lbnQoc3RhcnREYXRlKS5hZGQobWludXRlc1RvQWRkLCAnbWludXRlcycpLnZhbHVlT2YoKSk7XHJcbiAgICBjb25zdCBhY3RpdmVWYWx1ZSA9IG1vbWVudChtaW51dGVWYWx1ZXMuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUgPD0gbWlsbGlzZWNvbmRzKS5wb3AoKSkudmFsdWVPZigpO1xyXG5cclxuICAgIGNvbnN0IG5vd1ZhbHVlID0gY3VycmVudE1pbGxpc2Vjb25kcyA+PSBzdGFydERhdGUudmFsdWVPZigpICYmIGN1cnJlbnRNaWxsaXNlY29uZHMgPD0gbW9tZW50KHN0YXJ0RGF0ZSkuZW5kT2YoJ2hvdXInKS52YWx1ZU9mKClcclxuICAgICAgPyBtb21lbnQobWludXRlVmFsdWVzLmZpbHRlcigodmFsdWUpID0+IHZhbHVlIDw9IGN1cnJlbnRNaWxsaXNlY29uZHMpLnBvcCgpKS52YWx1ZU9mKClcclxuICAgICAgOiBudWxsO1xyXG5cclxuXHJcbiAgICBjb25zdCBwcmV2aW91c0hvdXIgPSBtb21lbnQoc3RhcnREYXRlKS5zdWJ0cmFjdCgxLCAnaG91cicpO1xyXG4gICAgY29uc3QgbmV4dEhvdXIgPSBtb21lbnQoc3RhcnREYXRlKS5hZGQoMSwgJ2hvdXInKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWUgPSBzZWxlY3RlZE1pbGxpc2Vjb25kcyA9PT0gbnVsbCB8fCBzZWxlY3RlZE1pbGxpc2Vjb25kcyA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgICAgOiBtb21lbnQobWludXRlVmFsdWVzLmZpbHRlcigodmFsdWUpID0+IHZhbHVlIDw9IHNlbGVjdGVkTWlsbGlzZWNvbmRzKS5wb3AoKSkudmFsdWVPZigpO1xyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBuZXcgQXJyYXkoTWF0aC5jZWlsKG1pbnV0ZVN0ZXBzLmxlbmd0aCAvIDQpKVxyXG4gICAgICAuZmlsbCgwKVxyXG4gICAgICAubWFwKCh6ZXJvLCBpbmRleCkgPT4gemVybyArIGluZGV4KVxyXG4gICAgICAubWFwKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7Y2VsbHM6IG1pbnV0ZVN0ZXBzLnNsaWNlKCh2YWx1ZSAqIDQpLCAodmFsdWUgKiA0KSArIDQpLm1hcChyb3dPZk1pbnV0ZXMpfTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmlld05hbWU6ICdtaW51dGUnLFxyXG4gICAgICB2aWV3TGFiZWw6IHN0YXJ0RGF0ZS5mb3JtYXQoJ2xsbCcpLFxyXG4gICAgICBhY3RpdmVEYXRlOiBhY3RpdmVWYWx1ZSxcclxuICAgICAgbGVmdEJ1dHRvbjoge1xyXG4gICAgICAgIHZhbHVlOiBwcmV2aW91c0hvdXIudmFsdWVPZigpLFxyXG4gICAgICAgIGFyaWFMYWJlbDogYEdvIHRvICR7cHJldmlvdXNIb3VyLmZvcm1hdCgnbGxsJyl9YCxcclxuICAgICAgICBjbGFzc2VzOiB7fSxcclxuICAgICAgfSxcclxuICAgICAgdXBCdXR0b246IHtcclxuICAgICAgICB2YWx1ZTogc3RhcnREYXRlLnZhbHVlT2YoKSxcclxuICAgICAgICBhcmlhTGFiZWw6IGBHbyB0byAke3N0YXJ0RGF0ZS5mb3JtYXQoJ2xsJyl9YCxcclxuICAgICAgICBjbGFzc2VzOiB7fSxcclxuICAgICAgfSxcclxuICAgICAgcmlnaHRCdXR0b246IHtcclxuICAgICAgICB2YWx1ZTogbmV4dEhvdXIudmFsdWVPZigpLFxyXG4gICAgICAgIGFyaWFMYWJlbDogYEdvIHRvICR7bmV4dEhvdXIuZm9ybWF0KCdsbGwnKX1gLFxyXG4gICAgICAgIGNsYXNzZXM6IHt9LFxyXG4gICAgICB9LFxyXG4gICAgICByb3dzXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvd09mTWludXRlcyhzdGVwTWludXRlcyk6IHtcclxuICAgICAgZGlzcGxheTogc3RyaW5nO1xyXG4gICAgICBhcmlhTGFiZWw6IHN0cmluZztcclxuICAgICAgdmFsdWU6IG51bWJlcjtcclxuICAgICAgY2xhc3Nlczoge307XHJcbiAgICB9IHtcclxuICAgICAgY29uc3QgbWludXRlTW9tZW50ID0gbW9tZW50KHN0YXJ0RGF0ZSkuYWRkKHN0ZXBNaW51dGVzLCAnbWludXRlcycpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRpc3BsYXk6IG1pbnV0ZU1vbWVudC5mb3JtYXQoJ0xUJyksXHJcbiAgICAgICAgYXJpYUxhYmVsOiBtaW51dGVNb21lbnQuZm9ybWF0KCdMTEwnKSxcclxuICAgICAgICB2YWx1ZTogbWludXRlTW9tZW50LnZhbHVlT2YoKSxcclxuICAgICAgICBjbGFzc2VzOiB7XHJcbiAgICAgICAgICAnZGwtYWJkdHAtYWN0aXZlJzogYWN0aXZlVmFsdWUgPT09IG1pbnV0ZU1vbWVudC52YWx1ZU9mKCksXHJcbiAgICAgICAgICAnZGwtYWJkdHAtc2VsZWN0ZWQnOiBzZWxlY3RlZFZhbHVlID09PSBtaW51dGVNb21lbnQudmFsdWVPZigpLFxyXG4gICAgICAgICAgJ2RsLWFiZHRwLW5vdyc6IG5vd1ZhbHVlID09PSBtaW51dGVNb21lbnQudmFsdWVPZigpLFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGFjdGl2ZSBgbWludXRlYCBvbmUgcm93IGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYGRvd25gIGNhbiByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIG1pbnV0ZSBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IGhvdXIgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIGhvdXIgcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCBob3VyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG5leHQgYG1pbnV0ZWAgbW9kZWwgYGRvd25gIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYG1pbnV0ZWAgb25lIHJvdyBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvRG93bihmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLmFkZCh0aGlzLnN0ZXAgKiA0LCAnbWludXRlcycpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYWN0aXZlIGBtaW51dGVgIG9uZSByb3cgYGRvd25gIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKlxyXG4gICAqIE1vdmluZyBgZG93bmAgY2FuIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgbWludXRlIGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgaG91ciB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgaG91ciByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IGhvdXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgbmV4dCBgbWludXRlYCBtb2RlbCBgZG93bmAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgbWludXRlYCBvbmUgcm93IGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgZ29VcChmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLnN1YnRyYWN0KHRoaXMuc3RlcCAqIDQsICdtaW51dGVzJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBkYXRlIG9uZSBjZWxsIHRvIGBsZWZ0YCBpbiB0aGUgY3VycmVudCBgbWludXRlYCB2aWV3LlxyXG4gICAqXHJcbiAgICogTW92aW5nIGBsZWZ0YCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBob3VyIGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgaG91ciB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgaG91ciByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IGhvdXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgYG1pbnV0ZWAgbW9kZWwgdG8gdGhlIGBsZWZ0YCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBtaW51dGVgIG9uZSBjZWxsIHRvIHRoZSBgbGVmdGAgb2YgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb0xlZnQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdWJ0cmFjdCh0aGlzLnN0ZXAsICdtaW51dGVzJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIGBhY3RpdmVgIG1pbnV0ZSBvbmUgY2VsbCB0byBgcmlnaHRgIGluIHRoZSBjdXJyZW50IGBtaW51dGVgIHZpZXcuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYHJpZ2h0YCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBob3VyIGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgaG91ciB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgaG91ciByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IGhvdXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgYG1pbnV0ZWAgbW9kZWwgdG8gdGhlIGByaWdodGAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgbWludXRlYCBvbmUgY2VsbCB0byB0aGUgYHJpZ2h0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvUmlnaHQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5hZGQodGhpcy5zdGVwLCAnbWludXRlcycpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYWN0aXZlIGBtaW51dGVgIG9uZSBob3VyIGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBUaGUgYGFjdGl2ZWAgbWludXRlIHdpbGwgYmUgYG9uZSAoMSkgaG91ciBhZnRlcmAgdGhlIHNwZWNpZmllZCBtaWxsaXNlY29uZHMuXHJcbiAgICogVGhpcyBtb3ZlcyB0aGUgYGFjdGl2ZWAgZGF0ZSBvbmUgYHBhZ2VgIGBkb3duYCBmcm9tIHRoZSBjdXJyZW50IGBtaW51dGVgIHZpZXcuXHJcbiAgICpcclxuICAgKiBUaGUgbmV4dCBjZWxsIGBwYWdlLWRvd25gIHdpbGwgYmUgaW4gYSBkaWZmZXJlbnQgaG91ciB0aGFuIHRoZSBjdXJyZW50bHlcclxuICAgKiBkaXNwbGF5ZWQgdmlldyBhbmQgdGhlIG1vZGVsIHRpbWUgcmFuZ2Ugd2lsbCBpbmNsdWRlIHRoZSBuZXcgYWN0aXZlIGNlbGwuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgbmV4dCBgbW9udGhgIG1vZGVsIHBhZ2UgYGRvd25gIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYG1vbnRoYCBvbmUgeWVhciBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIHBhZ2VEb3duKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuYWRkKDEsICdob3VyJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYG1pbnV0ZWAgb25lIGhvdXIgYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBUaGUgYGFjdGl2ZWAgbWludXRlIHdpbGwgYmUgYG9uZSAoMSkgaG91ciBiZWZvcmVgIHRoZSBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzLlxyXG4gICAqIFRoaXMgbW92ZXMgdGhlIGBhY3RpdmVgIGRhdGUgb25lIGBwYWdlYCBgZG93bmAgZnJvbSB0aGUgY3VycmVudCBgbWludXRlYCB2aWV3LlxyXG4gICAqXHJcbiAgICogVGhlIG5leHQgY2VsbCBgcGFnZS11cGAgd2lsbCBiZSBpbiBhIGRpZmZlcmVudCBob3VyIHRoYW4gdGhlIGN1cnJlbnRseVxyXG4gICAqIGRpc3BsYXllZCB2aWV3IGFuZCB0aGUgbW9kZWwgdGltZSByYW5nZSB3aWxsIGluY2x1ZGUgdGhlIG5ldyBhY3RpdmUgY2VsbC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBuZXh0IGBtb250aGAgbW9kZWwgcGFnZSBgZG93bmAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgbW9udGhgIG9uZSB5ZWFyIGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgcGFnZVVwKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuc3VidHJhY3QoMSwgJ2hvdXInKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGBhY3RpdmVgIGBtaW51dGVgIHRvIHRoZSBsYXN0IGNlbGwgb2YgdGhlIGN1cnJlbnQgaG91ci5cclxuICAgKlxyXG4gICAqIFRoZSB2aWV3IG9yIHRpbWUgcmFuZ2Ugd2lsbCBub3QgY2hhbmdlIHVubGVzcyB0aGUgYGZyb21NaWxsaXNlY29uZHNgIHZhbHVlXHJcbiAgICogaXMgaW4gYSBkaWZmZXJlbnQgaG91ciB0aGFuIHRoZSBkaXNwbGF5ZWQgZGVjYWRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIGxhc3QgY2VsbCB3aWxsIGJlIGNhbGN1bGF0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGEgbW9kZWwgd2l0aCB0aGUgbGFzdCBjZWxsIGluIHRoZSB2aWV3IGFzIHRoZSBhY3RpdmUgYG1pbnV0ZWAuXHJcbiAgICovXHJcbiAgZ29FbmQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKVxyXG4gICAgICAuZW5kT2YoJ2hvdXInKVxyXG4gICAgICAudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBgbWludXRlYCB0byB0aGUgZmlyc3QgY2VsbCBvZiB0aGUgY3VycmVudCBob3VyLlxyXG4gICAqXHJcbiAgICogVGhlIHZpZXcgb3IgdGltZSByYW5nZSB3aWxsIG5vdCBjaGFuZ2UgdW5sZXNzIHRoZSBgZnJvbU1pbGxpc2Vjb25kc2AgdmFsdWVcclxuICAgKiBpcyBpbiBhIGRpZmZlcmVudCBob3VyIHRoYW4gdGhlIGRpc3BsYXllZCBkZWNhZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgZmlyc3QgY2VsbCB3aWxsIGJlIGNhbGN1bGF0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGEgbW9kZWwgd2l0aCB0aGUgZmlyc3QgY2VsbCBpbiB0aGUgdmlldyBhcyB0aGUgYWN0aXZlIGBtaW51dGVgLlxyXG4gICAqL1xyXG4gIGdvSG9tZShmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLnN0YXJ0T2YoJ2hvdXInKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcbn1cclxuIl19