import { DlDateAdapter } from './dl-date-adapter';
/**
 * Adapts `Date` to be usable as a date by date/time components that work with dates.
 **/
export class DlDateAdapterNative extends DlDateAdapter {
    /**
     * Create a new instance of a `moment` type from milliseconds.
     * @param milliseconds
     *  a time value as milliseconds (local time zone)
     * @returns
     *  an instance of `moment` for the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return new Date(milliseconds);
    }
    /**
     * Returns a moment in time value as milliseconds (local time zone).
     * @param value
     *  a Date or null.
     * @returns
     *  a `value.getTime()` result for the specified `Date` or `null`.
     */
    toMilliseconds(value) {
        return (value) ? value.getTime() : undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS1hZGFwdGVyLW5hdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29yZS9kbC1kYXRlLWFkYXB0ZXItbmF0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVoRDs7SUFFSTtBQUNKLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxhQUFtQjtJQUMxRDs7Ozs7O09BTUc7SUFDSCxnQkFBZ0IsQ0FBQyxZQUFvQjtRQUNuQyxPQUFPLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFHRDs7Ozs7O09BTUc7SUFDSCxjQUFjLENBQUMsS0FBa0I7UUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUMvQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RsRGF0ZUFkYXB0ZXJ9IGZyb20gJy4vZGwtZGF0ZS1hZGFwdGVyJztcclxuXHJcbi8qKlxyXG4gKiBBZGFwdHMgYERhdGVgIHRvIGJlIHVzYWJsZSBhcyBhIGRhdGUgYnkgZGF0ZS90aW1lIGNvbXBvbmVudHMgdGhhdCB3b3JrIHdpdGggZGF0ZXMuXHJcbiAqKi9cclxuZXhwb3J0IGNsYXNzIERsRGF0ZUFkYXB0ZXJOYXRpdmUgZXh0ZW5kcyBEbERhdGVBZGFwdGVyPERhdGU+IHtcclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgbW9tZW50YCB0eXBlIGZyb20gbWlsbGlzZWNvbmRzLlxyXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHNcclxuICAgKiAgYSB0aW1lIHZhbHVlIGFzIG1pbGxpc2Vjb25kcyAobG9jYWwgdGltZSB6b25lKVxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGFuIGluc3RhbmNlIG9mIGBtb21lbnRgIGZvciB0aGUgc3BlY2lmaWVkIG1vbWVudCBpbiB0aW1lLlxyXG4gICAqL1xyXG4gIGZyb21NaWxsaXNlY29uZHMobWlsbGlzZWNvbmRzOiBudW1iZXIpOiBEYXRlIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZShtaWxsaXNlY29uZHMpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBtb21lbnQgaW4gdGltZSB2YWx1ZSBhcyBtaWxsaXNlY29uZHMgKGxvY2FsIHRpbWUgem9uZSkuXHJcbiAgICogQHBhcmFtIHZhbHVlXHJcbiAgICogIGEgRGF0ZSBvciBudWxsLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIGEgYHZhbHVlLmdldFRpbWUoKWAgcmVzdWx0IGZvciB0aGUgc3BlY2lmaWVkIGBEYXRlYCBvciBgbnVsbGAuXHJcbiAgICovXHJcbiAgdG9NaWxsaXNlY29uZHModmFsdWU6IERhdGUgfCBudWxsKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gKHZhbHVlKSA/IHZhbHVlLmdldFRpbWUoKSA6IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuIl19