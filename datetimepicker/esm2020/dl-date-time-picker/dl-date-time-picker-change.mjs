/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
/**
 * Emitted when the value of a date/time picker changes.
 */
export class DlDateTimePickerChange {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS10aW1lLXBpY2tlci1jaGFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RsLWRhdGUtdGltZS1waWNrZXIvZGwtZGF0ZS10aW1lLXBpY2tlci1jaGFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUVIOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHNCQUFzQjtJQU9qQzs7OztPQUlHO0lBQ0gsWUFBWSxRQUFXO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQgRGFsZSBMb3R0cyBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKiBodHRwOi8vd3d3LmRhbGVsb3R0cy5jb21cclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcclxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vZGFsZWxvdHRzL2FuZ3VsYXItYm9vdHN0cmFwLWRhdGV0aW1lcGlja2VyL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG4vKipcclxuICogRW1pdHRlZCB3aGVuIHRoZSB2YWx1ZSBvZiBhIGRhdGUvdGltZSBwaWNrZXIgY2hhbmdlcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lUGlja2VyQ2hhbmdlPEQ+IHtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5ldyB2YWx1ZSBvZiB0aGUgcGlja2VyLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgX3ZhbHVlOiBEO1xyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlLlxyXG4gICAqIEBwYXJhbSBuZXdWYWx1ZVxyXG4gICAqICB0aGUgbmV3IHZhbHVlIG9mIHRoZSBkYXRlL3RpbWUgcGlja2VyLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKG5ld1ZhbHVlOiBEKSB7XHJcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBuZXcgdmFsdWUgb2YgdGhlIGRhdGUvdGltZSBwaWNrZXIuXHJcbiAgICogQHJldHVybnMgdGhlIG5ldyB2YWx1ZSBvciBudWxsLlxyXG4gICAqL1xyXG4gIGdldCB2YWx1ZSgpOiBEIHtcclxuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcclxuICB9XHJcbn1cclxuIl19