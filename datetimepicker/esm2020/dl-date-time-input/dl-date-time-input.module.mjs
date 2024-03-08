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
import { DlDateTimeInputDirective } from './dl-date-time-input.directive';
import * as i0 from "@angular/core";
/**
 * Import this module to allow date/time input.
 * @internal
 **/
export class DlDateTimeInputModule {
}
DlDateTimeInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DlDateTimeInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, declarations: [DlDateTimeInputDirective], imports: [CommonModule], exports: [DlDateTimeInputDirective] });
DlDateTimeInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: DlDateTimeInputModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DlDateTimeInputDirective],
                    imports: [CommonModule],
                    exports: [DlDateTimeInputDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGwtZGF0ZS10aW1lLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGwtZGF0ZS10aW1lLWlucHV0L2RsLWRhdGUtdGltZS1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDOztBQUV4RTs7O0lBR0k7QUFNSixNQUFNLE9BQU8scUJBQXFCOztrSEFBckIscUJBQXFCO21IQUFyQixxQkFBcUIsaUJBSmpCLHdCQUF3QixhQUM3QixZQUFZLGFBQ1osd0JBQXdCO21IQUV2QixxQkFBcUIsWUFIdkIsQ0FBQyxZQUFZLENBQUM7MkZBR1oscUJBQXFCO2tCQUxqQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLHdCQUF3QixDQUFDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLHdCQUF3QixDQUFDO2lCQUNwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50IERhbGUgTG90dHMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogaHR0cDovL3d3dy5kYWxlbG90dHMuY29tXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2RhbGVsb3R0cy9hbmd1bGFyLWJvb3RzdHJhcC1kYXRldGltZXBpY2tlci9ibG9iL21hc3Rlci9MSUNFTlNFXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0RsRGF0ZVRpbWVJbnB1dERpcmVjdGl2ZX0gZnJvbSAnLi9kbC1kYXRlLXRpbWUtaW5wdXQuZGlyZWN0aXZlJztcclxuXHJcbi8qKlxyXG4gKiBJbXBvcnQgdGhpcyBtb2R1bGUgdG8gYWxsb3cgZGF0ZS90aW1lIGlucHV0LlxyXG4gKiBAaW50ZXJuYWxcclxuICoqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0RsRGF0ZVRpbWVJbnB1dERpcmVjdGl2ZV0sXHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgZXhwb3J0czogW0RsRGF0ZVRpbWVJbnB1dERpcmVjdGl2ZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbERhdGVUaW1lSW5wdXRNb2R1bGUge1xyXG59XHJcbiJdfQ==