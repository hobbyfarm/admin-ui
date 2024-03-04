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
 * Default implementation for the `month` view.
 */
export class DlMonthModelProvider {
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
        const startDate = moment(milliseconds).startOf('year');
        const rowNumbers = [0, 1, 2];
        const columnNumbers = [0, 1, 2, 3];
        const previousYear = moment(startDate).subtract(1, 'year');
        const nextYear = moment(startDate).add(1, 'year');
        const activeValue = moment(milliseconds).startOf('month').valueOf();
        const selectedValue = selectedMilliseconds === null || selectedMilliseconds === undefined
            ? selectedMilliseconds
            : moment(selectedMilliseconds).startOf('month').valueOf();
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
            const currentMoment = moment();
            const cells = columnNumbers.map((columnNumber) => {
                const monthMoment = moment(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'months');
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
        return this.getModel(moment(fromMilliseconds).add(4, 'month').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(4, 'month').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(1, 'month').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(1, 'month').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).add(12, 'months').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).subtract(12, 'months').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).endOf('year').valueOf(), selectedMilliseconds);
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
        return this.getModel(moment(fromMilliseconds).startOf('year').valueOf(), selectedMilliseconds);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtbW9kZWwtcHJvdmlkZXItbW9udGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RsLWRhdGUtdGltZS1waWNrZXIvZGwtbW9kZWwtcHJvdmlkZXItbW9udGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUdILE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUk1Qjs7R0FFRztBQUNILE1BQU0sT0FBTyxvQkFBb0I7SUFFL0I7Ozs7O09BS0c7SUFDSCxTQUFTLENBQ1AsUUFBdUIsSUFDaEIsQ0FBQztJQUVWOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSCxRQUFRLENBQUMsWUFBb0IsRUFBRSxvQkFBNEI7UUFDekQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2RCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BFLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixLQUFLLElBQUksSUFBSSxvQkFBb0IsS0FBSyxTQUFTO1lBQ3ZGLENBQUMsQ0FBQyxvQkFBb0I7WUFDdEIsQ0FBQyxD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TUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDakcsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQgRGFsZSBMb3R0cyBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKiBodHRwOi8vd3d3LmRhbGVsb3R0cy5jb21cclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcclxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vZGFsZWxvdHRzL2FuZ3VsYXItYm9vdHN0cmFwLWRhdGV0aW1lcGlja2VyL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG5pbXBvcnQge1NpbXBsZUNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCB7RGxEYXRlVGltZVBpY2tlck1vZGVsfSBmcm9tICcuL2RsLWRhdGUtdGltZS1waWNrZXItbW9kZWwnO1xyXG5pbXBvcnQge0RsTW9kZWxQcm92aWRlcn0gZnJvbSAnLi9kbC1tb2RlbC1wcm92aWRlcic7XHJcblxyXG4vKipcclxuICogRGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIGBtb250aGAgdmlldy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEbE1vbnRoTW9kZWxQcm92aWRlciBpbXBsZW1lbnRzIERsTW9kZWxQcm92aWRlciB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlY2VpdmVzIGlucHV0IGNoYW5nZXMgZGV0ZWN0ZWQgYnkgQW5ndWxhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjaGFuZ2VzXHJcbiAgICogIHRoZSBpbnB1dCBjaGFuZ2VzIGRldGVjdGVkIGJ5IEFuZ3VsYXIuXHJcbiAgICovXHJcbiAgb25DaGFuZ2VzKFxyXG4gICAgX2NoYW5nZXM6IFNpbXBsZUNoYW5nZXNcclxuICApOiB2b2lkIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGBtb250aGAgbW9kZWwgZm9yIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIGBsb2NhbGAgdGltZSB3aXRoIHRoZVxyXG4gICAqIGBhY3RpdmVgIG1vbnRoIHNldCB0byB0aGUgZmlyc3QgZGF5IG9mIHRoZSBzcGVjaWZpZWQgbW9udGguXHJcbiAgICpcclxuICAgKiBUaGUgYG1vbnRoYCBtb2RlbCByZXByZXNlbnRzIGEgeWVhciAoMTIgbW9udGhzKSBhcyB0aHJlZSByb3dzIHdpdGggZm91ciBjb2x1bW5zLlxyXG4gICAqXHJcbiAgICogVGhlIHllYXIgYWx3YXlzIHN0YXJ0cyBpbiBKYW51YXJ5LlxyXG4gICAqXHJcbiAgICogRWFjaCBjZWxsIHJlcHJlc2VudHMgbWlkbmlnaHQgb24gdGhlIDFzdCBkYXkgb2YgdGhlIG1vbnRoLlxyXG4gICAqXHJcbiAgICogVGhlIGBhY3RpdmVgIG1vbnRoIHdpbGwgYmUgdGhlIEphbnVhcnkgb2YgeWVhciBvZiB0aGUgc3BlY2lmaWVkIG1pbGxpc2Vjb25kcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIG1vbnRoIG1vZGVsIHdpbGwgYmUgY3JlYXRlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgdGhlIG1vZGVsIHJlcHJlc2VudGluZyB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdldE1vZGVsKG1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IG1vbWVudChtaWxsaXNlY29uZHMpLnN0YXJ0T2YoJ3llYXInKTtcclxuXHJcbiAgICBjb25zdCByb3dOdW1iZXJzID0gWzAsIDEsIDJdO1xyXG4gICAgY29uc3QgY29sdW1uTnVtYmVycyA9IFswLCAxLCAyLCAzXTtcclxuXHJcbiAgICBjb25zdCBwcmV2aW91c1llYXIgPSBtb21lbnQoc3RhcnREYXRlKS5zdWJ0cmFjdCgxLCAneWVhcicpO1xyXG4gICAgY29uc3QgbmV4dFllYXIgPSBtb21lbnQoc3RhcnREYXRlKS5hZGQoMSwgJ3llYXInKTtcclxuICAgIGNvbnN0IGFjdGl2ZVZhbHVlID0gbW9tZW50KG1pbGxpc2Vjb25kcykuc3RhcnRPZignbW9udGgnKS52YWx1ZU9mKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZFZhbHVlID0gc2VsZWN0ZWRNaWxsaXNlY29uZHMgPT09IG51bGwgfHwgc2VsZWN0ZWRNaWxsaXNlY29uZHMgPT09IHVuZGVmaW5lZFxyXG4gICAgICA/IHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICAgIDogbW9tZW50KHNlbGVjdGVkTWlsbGlzZWNvbmRzKS5zdGFydE9mKCdtb250aCcpLnZhbHVlT2YoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2aWV3TmFtZTogJ21vbnRoJyxcclxuICAgICAgdmlld0xhYmVsOiBzdGFydERhdGUuZm9ybWF0KCdZWVlZJyksXHJcbiAgICAgIGFjdGl2ZURhdGU6IGFjdGl2ZVZhbHVlLFxyXG4gICAgICBsZWZ0QnV0dG9uOiB7XHJcbiAgICAgICAgdmFsdWU6IHByZXZpb3VzWWVhci52YWx1ZU9mKCksXHJcbiAgICAgICAgYXJpYUxhYmVsOiBgR28gdG8gJHtwcmV2aW91c1llYXIuZm9ybWF0KCdZWVlZJyl9YCxcclxuICAgICAgICBjbGFzc2VzOiB7fSxcclxuICAgICAgfSxcclxuICAgICAgdXBCdXR0b246IHtcclxuICAgICAgICB2YWx1ZTogc3RhcnREYXRlLnZhbHVlT2YoKSxcclxuICAgICAgICBhcmlhTGFiZWw6IGBHbyB0byAke3N0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVknKX1gLFxyXG4gICAgICAgIGNsYXNzZXM6IHt9LFxyXG4gICAgICB9LFxyXG4gICAgICByaWdodEJ1dHRvbjoge1xyXG4gICAgICAgIHZhbHVlOiBuZXh0WWVhci52YWx1ZU9mKCksXHJcbiAgICAgICAgYXJpYUxhYmVsOiBgR28gdG8gJHtuZXh0WWVhci5mb3JtYXQoJ1lZWVknKX1gLFxyXG4gICAgICAgIGNsYXNzZXM6IHt9LFxyXG4gICAgICB9LFxyXG4gICAgICByb3dzOiByb3dOdW1iZXJzLm1hcChyb3dPZk1vbnRocylcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcm93T2ZNb250aHMocm93TnVtYmVyKSB7XHJcblxyXG4gICAgICBjb25zdCBjdXJyZW50TW9tZW50ID0gbW9tZW50KCk7XHJcbiAgICAgIGNvbnN0IGNlbGxzID0gY29sdW1uTnVtYmVycy5tYXAoKGNvbHVtbk51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1vbnRoTW9tZW50ID0gbW9tZW50KHN0YXJ0RGF0ZSkuYWRkKChyb3dOdW1iZXIgKiBjb2x1bW5OdW1iZXJzLmxlbmd0aCkgKyBjb2x1bW5OdW1iZXIsICdtb250aHMnKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZGlzcGxheTogbW9udGhNb21lbnQuZm9ybWF0KCdNTU0nKSxcclxuICAgICAgICAgIGFyaWFMYWJlbDogbW9udGhNb21lbnQuZm9ybWF0KCdNTU0gWVlZWScpLFxyXG4gICAgICAgICAgdmFsdWU6IG1vbnRoTW9tZW50LnZhbHVlT2YoKSxcclxuICAgICAgICAgIGNsYXNzZXM6IHtcclxuICAgICAgICAgICAgJ2RsLWFiZHRwLWFjdGl2ZSc6IGFjdGl2ZVZhbHVlID09PSBtb250aE1vbWVudC52YWx1ZU9mKCksXHJcbiAgICAgICAgICAgICdkbC1hYmR0cC1zZWxlY3RlZCc6IHNlbGVjdGVkVmFsdWUgPT09IG1vbnRoTW9tZW50LnZhbHVlT2YoKSxcclxuICAgICAgICAgICAgJ2RsLWFiZHRwLW5vdyc6IG1vbnRoTW9tZW50LmlzU2FtZShjdXJyZW50TW9tZW50LCAnbW9udGgnKSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHtjZWxsc307XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYG1vbnRoYCBvbmUgcm93IGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYGRvd25gIGNhbiByZXN1bHQgaW4gdGhlIGBhY3RpdmVgIG1vbnRoIGJlaW5nIHBhcnQgb2YgYSBkaWZmZXJlbnQgeWVhciB0aGFuXHJcbiAgICogdGhlIHNwZWNpZmllZCBgZnJvbU1pbGxpc2Vjb25kc2AsIGluIHRoaXMgY2FzZSB0aGUgeWVhciByZXByZXNlbnRlZCBieSB0aGUgbW9kZWxcclxuICAgKiB3aWxsIGNoYW5nZSB0byBzaG93IHRoZSBjb3JyZWN0IHllYXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCB0aGUgbmV4dCBgbW9udGhgIG1vZGVsIGBkb3duYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBtb250aGAgb25lIHJvdyBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvRG93bihmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLmFkZCg0LCAnbW9udGgnKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGFjdGl2ZSBgbW9udGhgIG9uZSByb3cgYHVwYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBNb3ZpbmcgYHVwYCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBtb250aCBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IHllYXIgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIHllYXIgcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCB5ZWFyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIHByZXZpb3VzIGBtb250aGAgbW9kZWwgYHVwYCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBtb250aGAgb25lIHJvdyBgdXBgIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb1VwKGZyb21NaWxsaXNlY29uZHM6IG51bWJlciwgc2VsZWN0ZWRNaWxsaXNlY29uZHM6IG51bWJlcik6IERsRGF0ZVRpbWVQaWNrZXJNb2RlbCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbChtb21lbnQoZnJvbU1pbGxpc2Vjb25kcykuc3VidHJhY3QoNCwgJ21vbnRoJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBgbW9udGhgIG9uZSAoMSkgbW9udGggdG8gdGhlIGBsZWZ0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogTW92aW5nIGBsZWZ0YCBjYW4gcmVzdWx0IGluIHRoZSBgYWN0aXZlYCBtb250aCBiZWluZyBwYXJ0IG9mIGEgZGlmZmVyZW50IHllYXIgdGhhblxyXG4gICAqIHRoZSBzcGVjaWZpZWQgYGZyb21NaWxsaXNlY29uZHNgLCBpbiB0aGlzIGNhc2UgdGhlIHllYXIgcmVwcmVzZW50ZWQgYnkgdGhlIG1vZGVsXHJcbiAgICogd2lsbCBjaGFuZ2UgdG8gc2hvdyB0aGUgY29ycmVjdCB5ZWFyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGZyb21NaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIG1vbWVudCBpbiB0aW1lIGZyb20gd2hpY2ggdGhlIGBtb250aGAgbW9kZWwgdG8gdGhlIGBsZWZ0YCB3aWxsIGJlIGNvbnN0cnVjdGVkLlxyXG4gICAqIEBwYXJhbSBzZWxlY3RlZE1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBtb2RlbCBjb250YWluaW5nIGFuIGBhY3RpdmVgIGBtb250aGAgb25lIG1vbnRoIHRvIHRoZSBgbGVmdGAgb2YgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBnb0xlZnQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGBhY3RpdmVgIGBtb250aGAgb25lICgxKSBtb250aCB0byB0aGUgYHJpZ2h0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogVGhlIGBhY3RpdmVgIG1vbnRoIHdpbGwgYmUgYG9uZSAoMSkgbW9udGggYWZ0ZXJgIHRoZSBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzLlxyXG4gICAqIFRoaXMgbW92ZXMgdGhlIGBhY3RpdmVgIGRhdGUgb25lIG1vbnRoIGByaWdodGAgaW4gdGhlIGN1cnJlbnQgYG1vbnRoYCB2aWV3LlxyXG4gICAqXHJcbiAgICogTW92aW5nIGByaWdodGAgY2FuIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgbW9udGggYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCB5ZWFyIHRoYW5cclxuICAgKiB0aGUgc3BlY2lmaWVkIGBmcm9tTWlsbGlzZWNvbmRzYCwgaW4gdGhpcyBjYXNlIHRoZSB5ZWFyIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgeWVhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBgbW9udGhgIG1vZGVsIHRvIHRoZSBgcmlnaHRgIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYG1vbnRoYCBvbmUgeWVhciB0byB0aGUgYHJpZ2h0YCBvZiB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGdvUmlnaHQoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5hZGQoMSwgJ21vbnRoJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBhY3RpdmUgYG1vbnRoYCBvbmUgeWVhciBgZG93bmAgZnJvbSB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqXHJcbiAgICogUGFnaW5nIGBkb3duYCB3aWxsIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgbW9udGggYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCB5ZWFyIHRoYW5cclxuICAgKiB0aGUgc3BlY2lmaWVkIGBmcm9tTWlsbGlzZWNvbmRzYC4gQXMgYSByZXN1bHQsIHRoZSB5ZWFyIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgeWVhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBuZXh0IGBtb250aGAgbW9kZWwgcGFnZSBgZG93bmAgd2lsbCBiZSBjb25zdHJ1Y3RlZC5cclxuICAgKiBAcGFyYW0gc2VsZWN0ZWRNaWxsaXNlY29uZHNcclxuICAgKiAgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgbW9kZWwgY29udGFpbmluZyBhbiBgYWN0aXZlYCBgbW9udGhgIG9uZSB5ZWFyIGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgcGFnZURvd24oZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5hZGQoMTIsICdtb250aHMnKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIGFjdGl2ZSBgbW9udGhgIG9uZSB5ZWFyIGBkb3duYCBmcm9tIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICpcclxuICAgKiBQYWdpbmcgYHVwYCB3aWxsIHJlc3VsdCBpbiB0aGUgYGFjdGl2ZWAgbW9udGggYmVpbmcgcGFydCBvZiBhIGRpZmZlcmVudCB5ZWFyIHRoYW5cclxuICAgKiB0aGUgc3BlY2lmaWVkIGBmcm9tTWlsbGlzZWNvbmRzYC4gQXMgYSByZXN1bHQsIHRoZSB5ZWFyIHJlcHJlc2VudGVkIGJ5IHRoZSBtb2RlbFxyXG4gICAqIHdpbGwgY2hhbmdlIHRvIHNob3cgdGhlIGNvcnJlY3QgeWVhci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIHRoZSBuZXh0IGBtb250aGAgbW9kZWwgcGFnZSBgdXBgIHdpbGwgYmUgY29uc3RydWN0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIG1vZGVsIGNvbnRhaW5pbmcgYW4gYGFjdGl2ZWAgYG1vbnRoYCBvbmUgeWVhciBgdXBgIGZyb20gdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBwYWdlVXAoZnJvbU1pbGxpc2Vjb25kczogbnVtYmVyLCBzZWxlY3RlZE1pbGxpc2Vjb25kczogbnVtYmVyKTogRGxEYXRlVGltZVBpY2tlck1vZGVsIHtcclxuICAgIHJldHVybiB0aGlzLmdldE1vZGVsKG1vbWVudChmcm9tTWlsbGlzZWNvbmRzKS5zdWJ0cmFjdCgxMiwgJ21vbnRocycpLnZhbHVlT2YoKSwgc2VsZWN0ZWRNaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSB0aGUgYGFjdGl2ZWAgYG1vbnRoYCB0byBgRGVjZW1iZXJgIG9mIHRoZSBjdXJyZW50IHllYXIuXHJcbiAgICpcclxuICAgKiBUaGUgdmlldyBvciB0aW1lIHJhbmdlIHdpbGwgbm90IGNoYW5nZSB1bmxlc3MgdGhlIGBmcm9tTWlsbGlzZWNvbmRzYCB2YWx1ZVxyXG4gICAqIGlzIGluIGEgZGlmZmVyZW50IHllYXIgdGhhbiB0aGUgZGlzcGxheWVkIGRlY2FkZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmcm9tTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBtb21lbnQgaW4gdGltZSBmcm9tIHdoaWNoIGBEZWNlbWJlciAxYCB3aWxsIGJlIGNhbGN1bGF0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGEgbW9kZWwgd2l0aCB0aGUgYERlY2VtYmVyYCBjZWxsIGluIHRoZSB2aWV3IGFzIHRoZSBhY3RpdmUgYG1vbnRoYC5cclxuICAgKi9cclxuICBnb0VuZChmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLmVuZE9mKCd5ZWFyJykudmFsdWVPZigpLCBzZWxlY3RlZE1pbGxpc2Vjb25kcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb3ZlIHRoZSBgYWN0aXZlYCBgbW9udGhgIHRvIGBKYW51YXJ5YCBvZiB0aGUgY3VycmVudCB5ZWFyLlxyXG4gICAqXHJcbiAgICogVGhlIHZpZXcgb3IgdGltZSByYW5nZSB3aWxsIG5vdCBjaGFuZ2UgdW5sZXNzIHRoZSBgZnJvbU1pbGxpc2Vjb25kc2AgdmFsdWVcclxuICAgKiBpcyBpbiBhIGRpZmZlcmVudCB5ZWFyIHRoYW4gdGhlIGRpc3BsYXllZCBkZWNhZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZnJvbU1pbGxpc2Vjb25kc1xyXG4gICAqICB0aGUgbW9tZW50IGluIHRpbWUgZnJvbSB3aGljaCBgSmFudWFyeSAxYCB3aWxsIGJlIGNhbGN1bGF0ZWQuXHJcbiAgICogQHBhcmFtIHNlbGVjdGVkTWlsbGlzZWNvbmRzXHJcbiAgICogIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGEgbW9kZWwgd2l0aCB0aGUgYEphbnVhcnlgIGNlbGwgaW4gdGhlIHZpZXcgYXMgdGhlIGFjdGl2ZSBgbW9udGhgLlxyXG4gICAqL1xyXG4gIGdvSG9tZShmcm9tTWlsbGlzZWNvbmRzOiBudW1iZXIsIHNlbGVjdGVkTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEbERhdGVUaW1lUGlja2VyTW9kZWwge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWwobW9tZW50KGZyb21NaWxsaXNlY29uZHMpLnN0YXJ0T2YoJ3llYXInKS52YWx1ZU9mKCksIHNlbGVjdGVkTWlsbGlzZWNvbmRzKTtcclxuICB9XHJcbn1cclxuIl19