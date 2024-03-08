/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DlDateTimePickerComponent } from './dl-date-time-picker.component';
import { DlDayModelProvider } from './dl-model-provider-day';
import { DlHourModelProvider } from './dl-model-provider-hour';
import { DlMinuteModelProvider } from './dl-model-provider-minute';
import { DlMonthModelProvider } from './dl-model-provider-month';
import { DlYearModelProvider } from './dl-model-provider-year';
import * as i0 from "@angular/core";
/**
 * Import this module to supply your own `DateAdapter` provider.
 * @internal
 **/
export class DlDateTimePickerModule {
}
DlDateTimePickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimePickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, declarations: [DlDateTimePickerComponent], imports: [CommonModule], exports: [DlDateTimePickerComponent] });
DlDateTimePickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, providers: [
        DlYearModelProvider,
        DlMonthModelProvider,
        DlDayModelProvider,
        DlHourModelProvider,
        DlMinuteModelProvider
    ], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DlDateTimePickerComponent],
                    imports: [CommonModule],
                    exports: [DlDateTimePickerComponent],
                    providers: [
                        DlYearModelProvider,
                        DlMonthModelProvider,
                        DlDayModelProvider,
                        DlHourModelProvider,
                        DlMinuteModelProvider
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS10aW1lLXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RsLWRhdGUtdGltZS1waWNrZXIvZGwtZGF0ZS10aW1lLXBpY2tlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQzFFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzNELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzdELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDOztBQUU3RDs7O0lBR0k7QUFhSixNQUFNLE9BQU8sc0JBQXNCOzttSEFBdEIsc0JBQXNCO29IQUF0QixzQkFBc0IsaUJBWGxCLHlCQUF5QixhQUM5QixZQUFZLGFBQ1oseUJBQXlCO29IQVN4QixzQkFBc0IsYUFSdEI7UUFDVCxtQkFBbUI7UUFDbkIsb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixtQkFBbUI7UUFDbkIscUJBQXFCO0tBQ3RCLFlBUlEsQ0FBQyxZQUFZLENBQUM7MkZBVVosc0JBQXNCO2tCQVpsQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLHlCQUF5QixDQUFDO29CQUN6QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixDQUFDO29CQUNwQyxTQUFTLEVBQUU7d0JBQ1QsbUJBQW1CO3dCQUNuQixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsbUJBQW1CO3dCQUNuQixxQkFBcUI7cUJBQ3RCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQgRGFsZSBMb3R0cyBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKiBodHRwOi8vd3d3LmRhbGVsb3R0cy5jb21cclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcclxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vZGFsZWxvdHRzL2FuZ3VsYXItYm9vdHN0cmFwLWRhdGV0aW1lcGlja2VyL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7RGxEYXRlVGltZVBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RGxEYXlNb2RlbFByb3ZpZGVyfSBmcm9tICcuL2RsLW1vZGVsLXByb3ZpZGVyLWRheSc7XHJcbmltcG9ydCB7RGxIb3VyTW9kZWxQcm92aWRlcn0gZnJvbSAnLi9kbC1tb2RlbC1wcm92aWRlci1ob3VyJztcclxuaW1wb3J0IHtEbE1pbnV0ZU1vZGVsUHJvdmlkZXJ9IGZyb20gJy4vZGwtbW9kZWwtcHJvdmlkZXItbWludXRlJztcclxuaW1wb3J0IHtEbE1vbnRoTW9kZWxQcm92aWRlcn0gZnJvbSAnLi9kbC1tb2RlbC1wcm92aWRlci1tb250aCc7XHJcbmltcG9ydCB7RGxZZWFyTW9kZWxQcm92aWRlcn0gZnJvbSAnLi9kbC1tb2RlbC1wcm92aWRlci15ZWFyJztcclxuXHJcbi8qKlxyXG4gKiBJbXBvcnQgdGhpcyBtb2R1bGUgdG8gc3VwcGx5IHlvdXIgb3duIGBEYXRlQWRhcHRlcmAgcHJvdmlkZXIuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKiovXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbRGxEYXRlVGltZVBpY2tlckNvbXBvbmVudF0sXHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgZXhwb3J0czogW0RsRGF0ZVRpbWVQaWNrZXJDb21wb25lbnRdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgRGxZZWFyTW9kZWxQcm92aWRlcixcclxuICAgIERsTW9udGhNb2RlbFByb3ZpZGVyLFxyXG4gICAgRGxEYXlNb2RlbFByb3ZpZGVyLFxyXG4gICAgRGxIb3VyTW9kZWxQcm92aWRlcixcclxuICAgIERsTWludXRlTW9kZWxQcm92aWRlclxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lUGlja2VyTW9kdWxlIHtcclxufVxyXG4iXX0=