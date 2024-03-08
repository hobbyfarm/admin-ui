import { Inject, Injectable } from '@angular/core';
import moment from 'moment';
import { DlDateAdapter } from './dl-date-adapter';
import { DL_DATE_TIME_INPUT_FORMATS, DL_DATE_TIME_MODEL_FORMAT } from './dl-date-time-string-format';
import * as i0 from "@angular/core";
/**
 * Adapts `string` to be usable as a date by date/time components that work with dates.
 **/
export class DlDateAdapterString extends DlDateAdapter {
    /**
     *  Constructs a new instance of this class.
     *
     * @param inputFormats
     *  see {@link DL_DATE_TIME_INPUT_FORMATS}
     * @param modelFormat
     *  see {@link DL_DATE_TIME_MODEL_FORMAT}
     */
    constructor(inputFormats, modelFormat) {
        super();
        this.inputFormats = inputFormats;
        this.modelFormat = modelFormat;
    }
    /**
     * Returns the specified number.
     * @param milliseconds
     *  a moment time time.
     * @returns
     *  the specified moment in time.
     */
    fromMilliseconds(milliseconds) {
        return moment(milliseconds).format(this.modelFormat);
    }
    /**
     * Returns the specified number.
     * @param value
     *  a moment time time or `null`
     * @returns
     *  the milliseconds for the specified value or `null`
     *  `null` is returned when value is not a valid input date string
     */
    toMilliseconds(value) {
        if (value !== undefined && value !== null) {
            const newMoment = moment(value, this.inputFormats, true);
            return newMoment.isValid() ? newMoment.valueOf() : undefined;
        }
    }
}
DlDateAdapterString.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateAdapterString, deps: [{ token: DL_DATE_TIME_INPUT_FORMATS }, { token: DL_DATE_TIME_MODEL_FORMAT }], target: i0.ɵɵFactoryTarget.Injectable });
DlDateAdapterString.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateAdapterString, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateAdapterString, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DL_DATE_TIME_INPUT_FORMATS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DL_DATE_TIME_MODEL_FORMAT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS1hZGFwdGVyLXN0cmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29yZS9kbC1kYXRlLWFkYXB0ZXItc3RyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEQsT0FBTyxFQUFDLDBCQUEwQixFQUFFLHlCQUF5QixFQUFDLE1BQU0sOEJBQThCLENBQUM7O0FBRW5HOztJQUVJO0FBSUosTUFBTSxPQUFPLG1CQUFvQixTQUFRLGFBQXFCO0lBSzVEOzs7Ozs7O09BT0c7SUFDSCxZQUFnRCxZQUFzQixFQUN2QixXQUFtQjtRQUNoRSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxnQkFBZ0IsQ0FBQyxZQUFvQjtRQUNuQyxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsY0FBYyxDQUFDLEtBQW9CO1FBQ2pDLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6RCxPQUFPLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FDOUQ7SUFDSCxDQUFDOztnSEE1Q1UsbUJBQW1CLGtCQWFWLDBCQUEwQixhQUMxQix5QkFBeUI7b0hBZGxDLG1CQUFtQixjQUZsQixNQUFNOzJGQUVQLG1CQUFtQjtrQkFIL0IsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQWNjLE1BQU07MkJBQUMsMEJBQTBCOzswQkFDakMsTUFBTTsyQkFBQyx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IHtEbERhdGVBZGFwdGVyfSBmcm9tICcuL2RsLWRhdGUtYWRhcHRlcic7XHJcbmltcG9ydCB7RExfREFURV9USU1FX0lOUFVUX0ZPUk1BVFMsIERMX0RBVEVfVElNRV9NT0RFTF9GT1JNQVR9IGZyb20gJy4vZGwtZGF0ZS10aW1lLXN0cmluZy1mb3JtYXQnO1xyXG5cclxuLyoqXHJcbiAqIEFkYXB0cyBgc3RyaW5nYCB0byBiZSB1c2FibGUgYXMgYSBkYXRlIGJ5IGRhdGUvdGltZSBjb21wb25lbnRzIHRoYXQgd29yayB3aXRoIGRhdGVzLlxyXG4gKiovXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIERsRGF0ZUFkYXB0ZXJTdHJpbmcgZXh0ZW5kcyBEbERhdGVBZGFwdGVyPHN0cmluZz4ge1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IGlucHV0Rm9ybWF0czogc3RyaW5nW107XHJcbiAgcHJpdmF0ZSByZWFkb25seSBtb2RlbEZvcm1hdDogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiAgQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGlucHV0Rm9ybWF0c1xyXG4gICAqICBzZWUge0BsaW5rIERMX0RBVEVfVElNRV9JTlBVVF9GT1JNQVRTfVxyXG4gICAqIEBwYXJhbSBtb2RlbEZvcm1hdFxyXG4gICAqICBzZWUge0BsaW5rIERMX0RBVEVfVElNRV9NT0RFTF9GT1JNQVR9XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUUykgaW5wdXRGb3JtYXRzOiBzdHJpbmdbXSxcclxuICAgICAgICAgICAgICBASW5qZWN0KERMX0RBVEVfVElNRV9NT0RFTF9GT1JNQVQpIG1vZGVsRm9ybWF0OiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmlucHV0Rm9ybWF0cyA9IGlucHV0Rm9ybWF0cztcclxuICAgIHRoaXMubW9kZWxGb3JtYXQgPSBtb2RlbEZvcm1hdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHNwZWNpZmllZCBudW1iZXIuXHJcbiAgICogQHBhcmFtIG1pbGxpc2Vjb25kc1xyXG4gICAqICBhIG1vbWVudCB0aW1lIHRpbWUuXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgdGhlIHNwZWNpZmllZCBtb21lbnQgaW4gdGltZS5cclxuICAgKi9cclxuICBmcm9tTWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kczogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBtb21lbnQobWlsbGlzZWNvbmRzKS5mb3JtYXQodGhpcy5tb2RlbEZvcm1hdCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzcGVjaWZpZWQgbnVtYmVyLlxyXG4gICAqIEBwYXJhbSB2YWx1ZVxyXG4gICAqICBhIG1vbWVudCB0aW1lIHRpbWUgb3IgYG51bGxgXHJcbiAgICogQHJldHVybnNcclxuICAgKiAgdGhlIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHNwZWNpZmllZCB2YWx1ZSBvciBgbnVsbGBcclxuICAgKiAgYG51bGxgIGlzIHJldHVybmVkIHdoZW4gdmFsdWUgaXMgbm90IGEgdmFsaWQgaW5wdXQgZGF0ZSBzdHJpbmdcclxuICAgKi9cclxuICB0b01pbGxpc2Vjb25kcyh2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IG51bWJlciB8IG51bGwge1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgY29uc3QgbmV3TW9tZW50ID0gbW9tZW50KHZhbHVlLCB0aGlzLmlucHV0Rm9ybWF0cywgdHJ1ZSk7XHJcbiAgICAgIHJldHVybiBuZXdNb21lbnQuaXNWYWxpZCgpID8gbmV3TW9tZW50LnZhbHVlT2YoKSA6IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19