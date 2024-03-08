/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Emitted when the value of a date/time input changes.
 */
export class DlDateTimeInputChange {
    /**
     * Constructs a new instance.
     * @param newValue
     *  the new value of the date/time picker.
     */
    constructor(newValue) {
        this._value = newValue;
    }
    /**
     * Get the new value of the date/time picker.
     * @returns the new value or null.
     */
    get value() {
        return this._value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS10aW1lLWlucHV0LWNoYW5nZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGwtZGF0ZS10aW1lLWlucHV0L2RsLWRhdGUtdGltZS1pbnB1dC1jaGFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUVIOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHFCQUFxQjtJQU9oQzs7OztPQUlHO0lBQ0gsWUFBWSxRQUFXO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQgRGFsZSBMb3R0cyBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKiBodHRwOi8vd3d3LmRhbGVsb3R0cy5jb21cclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcclxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vZGFsZWxvdHRzL2FuZ3VsYXItYm9vdHN0cmFwLWRhdGV0aW1lcGlja2VyL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG4vKipcclxuICogRW1pdHRlZCB3aGVuIHRoZSB2YWx1ZSBvZiBhIGRhdGUvdGltZSBpbnB1dCBjaGFuZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERsRGF0ZVRpbWVJbnB1dENoYW5nZTxEPiB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBuZXcgdmFsdWUgb2YgdGhlIHBpY2tlci5cclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRvbmx5IF92YWx1ZTogRDtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZS5cclxuICAgKiBAcGFyYW0gbmV3VmFsdWVcclxuICAgKiAgdGhlIG5ldyB2YWx1ZSBvZiB0aGUgZGF0ZS90aW1lIHBpY2tlci5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihuZXdWYWx1ZTogRCkge1xyXG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgbmV3IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqIEByZXR1cm5zIHRoZSBuZXcgdmFsdWUgb3IgbnVsbC5cclxuICAgKi9cclxuICBnZXQgdmFsdWUoKTogRCB7XHJcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==