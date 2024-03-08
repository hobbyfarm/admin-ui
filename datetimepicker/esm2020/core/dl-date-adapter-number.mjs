import { DlDateAdapter } from './dl-date-adapter';
/**
 * Adapts `number` to be usable as a date by date/time components that work with dates.
 * No op adapter.
 **/
export class DlDateAdapterNumber extends DlDateAdapter {
    /**
     * Returns the specified number.
     * @param milliseconds
     *  a moment time time.
     * @returns
     *  the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return milliseconds;
    }
    /**
     * Returns the specified number.
     * @param value
     *  a moment time time or `null`
     * @returns
     *  the specified moment in time or `null`
     */
    toMilliseconds(value) {
        return value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS1hZGFwdGVyLW51bWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29yZS9kbC1kYXRlLWFkYXB0ZXItbnVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVoRDs7O0lBR0k7QUFDSixNQUFNLE9BQU8sbUJBQW9CLFNBQVEsYUFBcUI7SUFDNUQ7Ozs7OztPQU1HO0lBQ0gsZ0JBQWdCLENBQUMsWUFBb0I7UUFDbkMsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILGNBQWMsQ0FBQyxLQUFvQjtRQUNqQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGxEYXRlQWRhcHRlcn0gZnJvbSAnLi9kbC1kYXRlLWFkYXB0ZXInO1xyXG5cclxuLyoqXHJcbiAqIEFkYXB0cyBgbnVtYmVyYCB0byBiZSB1c2FibGUgYXMgYSBkYXRlIGJ5IGRhdGUvdGltZSBjb21wb25lbnRzIHRoYXQgd29yayB3aXRoIGRhdGVzLlxyXG4gKiBObyBvcCBhZGFwdGVyLlxyXG4gKiovXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVBZGFwdGVyTnVtYmVyIGV4dGVuZHMgRGxEYXRlQWRhcHRlcjxudW1iZXI+IHtcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzcGVjaWZpZWQgbnVtYmVyLlxyXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHNcclxuICAgKiAgYSBtb21lbnQgdGltZSB0aW1lLlxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUuXHJcbiAgICovXHJcbiAgZnJvbU1pbGxpc2Vjb25kcyhtaWxsaXNlY29uZHM6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gbWlsbGlzZWNvbmRzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc3BlY2lmaWVkIG51bWJlci5cclxuICAgKiBAcGFyYW0gdmFsdWVcclxuICAgKiAgYSBtb21lbnQgdGltZSB0aW1lIG9yIGBudWxsYFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogIHRoZSBzcGVjaWZpZWQgbW9tZW50IGluIHRpbWUgb3IgYG51bGxgXHJcbiAgICovXHJcbiAgdG9NaWxsaXNlY29uZHModmFsdWU6IG51bWJlciB8IG51bGwpOiBudW1iZXIgfCBudWxsIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn1cclxuIl19