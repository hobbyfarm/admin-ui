import moment from 'moment';
import { DlDateAdapter } from './dl-date-adapter';
/**
 * Adapts `moment` to be usable as a date by date/time components that work with dates.
 **/
export class DlDateAdapterMoment extends DlDateAdapter {
    /**
     * Create a new instance of a `moment` type from milliseconds.
     * @param milliseconds
     *  a time value as milliseconds (local time zone)
     * @returns
     *  an instance of `moment` for the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return moment(milliseconds);
    }
    /**
     * Returns a moment in time value as milliseconds (local time zone).
     * @param value
     *  a moment or `null`.
     * @returns
     *  a `moment.valueOf()` result for the specified `moment` or `null`
     */
    toMilliseconds(value) {
        return (value) ? value.valueOf() : undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS1hZGFwdGVyLW1vbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29yZS9kbC1kYXRlLWFkYXB0ZXItbW9tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFaEQ7O0lBRUk7QUFDSixNQUFNLE9BQU8sbUJBQW9CLFNBQVEsYUFBcUI7SUFFNUQ7Ozs7OztPQU1HO0lBQ0gsZ0JBQWdCLENBQUMsWUFBb0I7UUFDbkMsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILGNBQWMsQ0FBQyxLQUFvQjtRQUNqQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQy9DLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IHtNb21lbnR9IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCB7RGxEYXRlQWRhcHRlcn0gZnJvbSAnLi9kbC1kYXRlLWFkYXB0ZXInO1xyXG5cclxuLyoqXHJcbiAqIEFkYXB0cyBgbW9tZW50YCB0byBiZSB1c2FibGUgYXMgYSBkYXRlIGJ5IGRhdGUvdGltZSBjb21wb25lbnRzIHRoYXQgd29yayB3aXRoIGRhdGVzLlxyXG4gKiovXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVBZGFwdGVyTW9tZW50IGV4dGVuZHMgRGxEYXRlQWRhcHRlcjxNb21lbnQ+IHtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYG1vbWVudGAgdHlwZSBmcm9tIG1pbGxpc2Vjb25kcy5cclxuICAgKiBAcGFyYW0gbWlsbGlzZWNvbmRzXHJcbiAgICogIGEgdGltZSB2YWx1ZSBhcyBtaWxsaXNlY29uZHMgKGxvY2FsIHRpbWUgem9uZSlcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBhbiBpbnN0YW5jZSBvZiBgbW9tZW50YCBmb3IgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBmcm9tTWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kczogbnVtYmVyKTogTW9tZW50IHtcclxuICAgIHJldHVybiBtb21lbnQobWlsbGlzZWNvbmRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBtb21lbnQgaW4gdGltZSB2YWx1ZSBhcyBtaWxsaXNlY29uZHMgKGxvY2FsIHRpbWUgem9uZSkuXHJcbiAgICogQHBhcmFtIHZhbHVlXHJcbiAgICogIGEgbW9tZW50IG9yIGBudWxsYC5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqICBhIGBtb21lbnQudmFsdWVPZigpYCByZXN1bHQgZm9yIHRoZSBzcGVjaWZpZWQgYG1vbWVudGAgb3IgYG51bGxgXHJcbiAgICovXHJcbiAgdG9NaWxsaXNlY29uZHModmFsdWU6IE1vbWVudCB8IG51bGwpOiBudW1iZXIgfCBudWxsIHtcclxuICAgIHJldHVybiAodmFsdWUpID8gdmFsdWUudmFsdWVPZigpIDogdW5kZWZpbmVkO1xyXG4gIH1cclxufVxyXG4iXX0=