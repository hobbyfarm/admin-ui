import { NgModule } from '@angular/core';
import { DlDateAdapter } from './dl-date-adapter';
import { DlDateAdapterMoment } from './dl-date-adapter-moment';
import { DlDateAdapterNative } from './dl-date-adapter-native';
import { DlDateAdapterNumber } from './dl-date-adapter-number';
import { DlDateAdapterString } from './dl-date-adapter-string';
import { DL_DATE_TIME_DISPLAY_FORMAT, DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT, DL_DATE_TIME_INPUT_FORMATS, DL_DATE_TIME_INPUT_FORMATS_DEFAULT, DL_DATE_TIME_MODEL_FORMAT, DL_DATE_TIME_MODEL_FORMAT_DEFAULT } from './dl-date-time-string-format';
import * as i0 from "@angular/core";
/**
 * Import this module to supply your own `DateAdapter` provider.
 * @internal
 **/
export class DlDateTimeCoreModule {
}
DlDateTimeCoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeCoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule });
DlDateTimeCoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule, providers: [
        { provide: DL_DATE_TIME_DISPLAY_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_MODEL_FORMAT_DEFAULT }
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeCoreModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [
                        { provide: DL_DATE_TIME_DISPLAY_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
                        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
                        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_MODEL_FORMAT_DEFAULT }
                    ]
                }]
        }] });
/**
 * Import this module to store `milliseconds` in the model.
 * @internal
 */
export class DlDateTimeNumberModule {
}
DlDateTimeNumberModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeNumberModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, imports: [DlDateTimeCoreModule], exports: [DlDateTimeCoreModule] });
DlDateTimeNumberModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, providers: [
        { provide: DlDateAdapter, useClass: DlDateAdapterNumber }
    ], imports: [[DlDateTimeCoreModule], DlDateTimeCoreModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeNumberModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DlDateAdapter, useClass: DlDateAdapterNumber }
                    ],
                    exports: [DlDateTimeCoreModule]
                }]
        }] });
/**
 * Import this module to store a native JavaScript `Date` in the model.
 * @internal
 */
export class DlDateTimeDateModule {
}
DlDateTimeDateModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeDateModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, imports: [DlDateTimeCoreModule] });
DlDateTimeDateModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, providers: [
        { provide: DlDateAdapter, useClass: DlDateAdapterNative }
    ], imports: [[DlDateTimeCoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DlDateAdapter, useClass: DlDateAdapterNative }
                    ],
                }]
        }] });
/**
 * Import this module to store a `moment` in the model.
 * @internal
 */
export class DlDateTimeMomentModule {
}
DlDateTimeMomentModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeMomentModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, imports: [DlDateTimeCoreModule] });
DlDateTimeMomentModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, providers: [
        { provide: DlDateAdapter, useClass: DlDateAdapterMoment }
    ], imports: [[DlDateTimeCoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeMomentModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DlDateAdapter, useClass: DlDateAdapterMoment }
                    ],
                }]
        }] });
/**
 * Import this module to store a `string` in the model.
 * @internal
 */
export class DlDateTimeStringModule {
}
DlDateTimeStringModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeStringModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, imports: [DlDateTimeCoreModule] });
DlDateTimeStringModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, providers: [
        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
        { provide: DlDateAdapter, useClass: DlDateAdapterString }
    ], imports: [[DlDateTimeCoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeStringModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DlDateTimeCoreModule],
                    providers: [
                        { provide: DL_DATE_TIME_INPUT_FORMATS, useValue: DL_DATE_TIME_INPUT_FORMATS_DEFAULT },
                        { provide: DL_DATE_TIME_MODEL_FORMAT, useValue: DL_DATE_TIME_DISPLAY_FORMAT_DEFAULT },
                        { provide: DlDateAdapter, useClass: DlDateAdapterString }
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS10aW1lLWNvcmUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jb3JlL2RsLWRhdGUtdGltZS1jb3JlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RCxPQUFPLEVBQ0wsMkJBQTJCLEVBQzNCLG1DQUFtQyxFQUNuQywwQkFBMEIsRUFDMUIsa0NBQWtDLEVBQ2xDLHlCQUF5QixFQUN6QixpQ0FBaUMsRUFDbEMsTUFBTSw4QkFBOEIsQ0FBQzs7QUFFdEM7OztJQUdJO0FBUUosTUFBTSxPQUFPLG9CQUFvQjs7aUhBQXBCLG9CQUFvQjtrSEFBcEIsb0JBQW9CO2tIQUFwQixvQkFBb0IsYUFOcEI7UUFDVCxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxRQUFRLEVBQUUsbUNBQW1DLEVBQUM7UUFDckYsRUFBQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsUUFBUSxFQUFFLGtDQUFrQyxFQUFDO1FBQ25GLEVBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLFFBQVEsRUFBRSxpQ0FBaUMsRUFBQztLQUNsRjsyRkFFVSxvQkFBb0I7a0JBUGhDLFFBQVE7bUJBQUM7b0JBQ1IsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFFBQVEsRUFBRSxtQ0FBbUMsRUFBQzt3QkFDckYsRUFBQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsUUFBUSxFQUFFLGtDQUFrQyxFQUFDO3dCQUNuRixFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxRQUFRLEVBQUUsaUNBQWlDLEVBQUM7cUJBQ2xGO2lCQUNGOztBQUlEOzs7R0FHRztBQVFILE1BQU0sT0FBTyxzQkFBc0I7O21IQUF0QixzQkFBc0I7b0hBQXRCLHNCQUFzQixZQWR0QixvQkFBb0IsYUFBcEIsb0JBQW9CO29IQWNwQixzQkFBc0IsYUFMdEI7UUFDVCxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDO0tBQ3hELFlBSFEsQ0FBQyxvQkFBb0IsQ0FBQyxFQVJwQixvQkFBb0I7MkZBY3BCLHNCQUFzQjtrQkFQbEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDL0IsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUM7cUJBQ3hEO29CQUNELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNoQzs7QUFJRDs7O0dBR0c7QUFPSCxNQUFNLE9BQU8sb0JBQW9COztpSEFBcEIsb0JBQW9CO2tIQUFwQixvQkFBb0IsWUEzQnBCLG9CQUFvQjtrSEEyQnBCLG9CQUFvQixhQUpwQjtRQUNULEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUM7S0FDeEQsWUFIUSxDQUFDLG9CQUFvQixDQUFDOzJGQUtwQixvQkFBb0I7a0JBTmhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7b0JBQy9CLFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDO3FCQUN4RDtpQkFDRjs7QUFJRDs7O0dBR0c7QUFPSCxNQUFNLE9BQU8sc0JBQXNCOzttSEFBdEIsc0JBQXNCO29IQUF0QixzQkFBc0IsWUF4Q3RCLG9CQUFvQjtvSEF3Q3BCLHNCQUFzQixhQUp0QjtRQUNULEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUM7S0FDeEQsWUFIUSxDQUFDLG9CQUFvQixDQUFDOzJGQUtwQixzQkFBc0I7a0JBTmxDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7b0JBQy9CLFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDO3FCQUN4RDtpQkFDRjs7QUFJRDs7O0dBR0c7QUFTSCxNQUFNLE9BQU8sc0JBQXNCOzttSEFBdEIsc0JBQXNCO29IQUF0QixzQkFBc0IsWUF2RHRCLG9CQUFvQjtvSEF1RHBCLHNCQUFzQixhQU50QjtRQUNULEVBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLFFBQVEsRUFBRSxrQ0FBa0MsRUFBQztRQUNuRixFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxRQUFRLEVBQUUsbUNBQW1DLEVBQUM7UUFDbkYsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBQztLQUN4RCxZQUxRLENBQUMsb0JBQW9CLENBQUM7MkZBT3BCLHNCQUFzQjtrQkFSbEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDL0IsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLFFBQVEsRUFBRSxrQ0FBa0MsRUFBQzt3QkFDbkYsRUFBQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsUUFBUSxFQUFFLG1DQUFtQyxFQUFDO3dCQUNuRixFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDO3FCQUN4RDtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0RsRGF0ZUFkYXB0ZXJ9IGZyb20gJy4vZGwtZGF0ZS1hZGFwdGVyJztcclxuaW1wb3J0IHtEbERhdGVBZGFwdGVyTW9tZW50fSBmcm9tICcuL2RsLWRhdGUtYWRhcHRlci1tb21lbnQnO1xyXG5pbXBvcnQge0RsRGF0ZUFkYXB0ZXJOYXRpdmV9IGZyb20gJy4vZGwtZGF0ZS1hZGFwdGVyLW5hdGl2ZSc7XHJcbmltcG9ydCB7RGxEYXRlQWRhcHRlck51bWJlcn0gZnJvbSAnLi9kbC1kYXRlLWFkYXB0ZXItbnVtYmVyJztcclxuaW1wb3J0IHtEbERhdGVBZGFwdGVyU3RyaW5nfSBmcm9tICcuL2RsLWRhdGUtYWRhcHRlci1zdHJpbmcnO1xyXG5pbXBvcnQge1xyXG4gIERMX0RBVEVfVElNRV9ESVNQTEFZX0ZPUk1BVCxcclxuICBETF9EQVRFX1RJTUVfRElTUExBWV9GT1JNQVRfREVGQVVMVCxcclxuICBETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUUyxcclxuICBETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUU19ERUZBVUxULFxyXG4gIERMX0RBVEVfVElNRV9NT0RFTF9GT1JNQVQsXHJcbiAgRExfREFURV9USU1FX01PREVMX0ZPUk1BVF9ERUZBVUxUXHJcbn0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtc3RyaW5nLWZvcm1hdCc7XHJcblxyXG4vKipcclxuICogSW1wb3J0IHRoaXMgbW9kdWxlIHRvIHN1cHBseSB5b3VyIG93biBgRGF0ZUFkYXB0ZXJgIHByb3ZpZGVyLlxyXG4gKiBAaW50ZXJuYWxcclxuICoqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge3Byb3ZpZGU6IERMX0RBVEVfVElNRV9ESVNQTEFZX0ZPUk1BVCwgdXNlVmFsdWU6IERMX0RBVEVfVElNRV9ESVNQTEFZX0ZPUk1BVF9ERUZBVUxUfSxcclxuICAgIHtwcm92aWRlOiBETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUUywgdXNlVmFsdWU6IERMX0RBVEVfVElNRV9JTlBVVF9GT1JNQVRTX0RFRkFVTFR9LFxyXG4gICAge3Byb3ZpZGU6IERMX0RBVEVfVElNRV9NT0RFTF9GT1JNQVQsIHVzZVZhbHVlOiBETF9EQVRFX1RJTUVfTU9ERUxfRk9STUFUX0RFRkFVTFR9XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGxEYXRlVGltZUNvcmVNb2R1bGUge1xyXG59XHJcblxyXG4vKipcclxuICogSW1wb3J0IHRoaXMgbW9kdWxlIHRvIHN0b3JlIGBtaWxsaXNlY29uZHNgIGluIHRoZSBtb2RlbC5cclxuICogQGludGVybmFsXHJcbiAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtEbERhdGVUaW1lQ29yZU1vZHVsZV0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7cHJvdmlkZTogRGxEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IERsRGF0ZUFkYXB0ZXJOdW1iZXJ9XHJcbiAgXSxcclxuICBleHBvcnRzOiBbRGxEYXRlVGltZUNvcmVNb2R1bGVdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lTnVtYmVyTW9kdWxlIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIEltcG9ydCB0aGlzIG1vZHVsZSB0byBzdG9yZSBhIG5hdGl2ZSBKYXZhU2NyaXB0IGBEYXRlYCBpbiB0aGUgbW9kZWwuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbRGxEYXRlVGltZUNvcmVNb2R1bGVdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge3Byb3ZpZGU6IERsRGF0ZUFkYXB0ZXIsIHVzZUNsYXNzOiBEbERhdGVBZGFwdGVyTmF0aXZlfVxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lRGF0ZU1vZHVsZSB7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbXBvcnQgdGhpcyBtb2R1bGUgdG8gc3RvcmUgYSBgbW9tZW50YCBpbiB0aGUgbW9kZWwuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbRGxEYXRlVGltZUNvcmVNb2R1bGVdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge3Byb3ZpZGU6IERsRGF0ZUFkYXB0ZXIsIHVzZUNsYXNzOiBEbERhdGVBZGFwdGVyTW9tZW50fVxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lTW9tZW50TW9kdWxlIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIEltcG9ydCB0aGlzIG1vZHVsZSB0byBzdG9yZSBhIGBzdHJpbmdgIGluIHRoZSBtb2RlbC5cclxuICogQGludGVybmFsXHJcbiAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtEbERhdGVUaW1lQ29yZU1vZHVsZV0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7cHJvdmlkZTogRExfREFURV9USU1FX0lOUFVUX0ZPUk1BVFMsIHVzZVZhbHVlOiBETF9EQVRFX1RJTUVfSU5QVVRfRk9STUFUU19ERUZBVUxUfSxcclxuICAgIHtwcm92aWRlOiBETF9EQVRFX1RJTUVfTU9ERUxfRk9STUFULCB1c2VWYWx1ZTogRExfREFURV9USU1FX0RJU1BMQVlfRk9STUFUX0RFRkFVTFR9LFxyXG4gICAge3Byb3ZpZGU6IERsRGF0ZUFkYXB0ZXIsIHVzZUNsYXNzOiBEbERhdGVBZGFwdGVyU3RyaW5nfVxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lU3RyaW5nTW9kdWxlIHtcclxufVxyXG5cclxuIl19