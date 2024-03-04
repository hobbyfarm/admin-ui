import { DlDateAdapter } from './dl-date-adapter';
import * as i0 from "@angular/core";
/**
 * Adapts `string` to be usable as a date by date/time components that work with dates.
 **/
export declare class DlDateAdapterString extends DlDateAdapter<string> {
    private readonly inputFormats;
    private readonly modelFormat;
    /**
     *  Constructs a new instance of this class.
     *
     * @param inputFormats
     *  see {@link DL_DATE_TIME_INPUT_FORMATS}
     * @param modelFormat
     *  see {@link DL_DATE_TIME_MODEL_FORMAT}
     */
    constructor(inputFormats: string[], modelFormat: string);
    /**
     * Returns the specified number.
     * @param milliseconds
     *  a moment time time.
     * @returns
     *  the specified moment in time.
     */
    fromMilliseconds(milliseconds: number): string;
    /**
     * Returns the specified number.
     * @param value
     *  a moment time time or `null`
     * @returns
     *  the milliseconds for the specified value or `null`
     *  `null` is returned when value is not a valid input date string
     */
    toMilliseconds(value: string | null): number | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateAdapterString, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DlDateAdapterString>;
}
