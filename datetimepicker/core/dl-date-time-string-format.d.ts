import { InjectionToken } from '@angular/core';
import * as moment from 'moment';
/**
 * InjectionToken for string dates that can be used to override default model format.
 **/
export declare const DL_DATE_TIME_DISPLAY_FORMAT: InjectionToken<string>;
/**
 * `Moment`'s long date format `lll` used as the default output format
 * for string date's
 */
export declare const DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT: string;
/**
 * InjectionToken for string dates that can be used to override default input formats.
 **/
export declare const DL_DATE_TIME_INPUT_FORMATS: InjectionToken<string[]>;
/**
 *  Default input format's used by `DlDateAdapterString`
 */
export declare const DL_DATE_TIME_INPUT_FORMATS_DEFAULT: (string | moment.MomentBuiltinFormat)[];
/**
 * InjectionToken for string dates that can be used to override default model format.
 **/
export declare const DL_DATE_TIME_MODEL_FORMAT: InjectionToken<string>;
/**
 *  Default model format (ISO 8601)`
 */
export declare const DL_DATE_TIME_MODEL_FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ss.SSSZ";
