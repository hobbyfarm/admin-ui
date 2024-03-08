import * as i0 from "@angular/core";
/**
 * Import this module to supply your own `DateAdapter` provider.
 * @internal
 **/
export declare class DlDateTimeCoreModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateTimeCoreModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DlDateTimeCoreModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DlDateTimeCoreModule>;
}
/**
 * Import this module to store `milliseconds` in the model.
 * @internal
 */
export declare class DlDateTimeNumberModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateTimeNumberModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DlDateTimeNumberModule, never, [typeof DlDateTimeCoreModule], [typeof DlDateTimeCoreModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DlDateTimeNumberModule>;
}
/**
 * Import this module to store a native JavaScript `Date` in the model.
 * @internal
 */
export declare class DlDateTimeDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateTimeDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DlDateTimeDateModule, never, [typeof DlDateTimeCoreModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DlDateTimeDateModule>;
}
/**
 * Import this module to store a `moment` in the model.
 * @internal
 */
export declare class DlDateTimeMomentModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateTimeMomentModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DlDateTimeMomentModule, never, [typeof DlDateTimeCoreModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DlDateTimeMomentModule>;
}
/**
 * Import this module to store a `string` in the model.
 * @internal
 */
export declare class DlDateTimeStringModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DlDateTimeStringModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DlDateTimeStringModule, never, [typeof DlDateTimeCoreModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DlDateTimeStringModule>;
}
