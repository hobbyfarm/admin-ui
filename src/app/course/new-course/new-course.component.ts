import { Component, Output, EventEmitter } from '@angular/core';
import { CourseService } from 'src/app/data/course.service';
import { Course } from 'src/app/data/course';
import { ServerResponse } from 'src/app/data/serverresponse';
import { ClrAlertType } from 'src/app/clr-alert-type';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseDetailFormGroup } from 'src/app/data/forms';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
})
export class NewCourseComponent {
  @Output()
  public added: EventEmitter<boolean> = new EventEmitter();

  public course: Course = new Course();

  public form?: CourseDetailFormGroup;

  public alertText: string = '';
  public isAlert: boolean = false;
  public alertType: string = ClrAlertType.Info;

  public newCourseOpen: boolean = false;

  constructor(public courseService: CourseService) {}

  setupForm(fg: CourseDetailFormGroup) {
    this.form = fg;
  }

  public open() {
    this.course = new Course();
    this.alertText = '';
    this.isAlert = false;
    this.newCourseOpen = true;
  }

  save() {
    if(!this.form) {
      // This case currently can not occur because the "save" button is disabled if this.form is not defined.
      this.alertText = 'Error creating object: Unable to read course form!';
      this.isAlert = true;
      this.alertType = ClrAlertType.Danger;
      return;
    }
    this.course.name = this.form.controls.course_name.value;
    this.course.description = this.form.controls.course_description.value;
    this.course.keepalive_duration =
      this.form.controls.keepalive_amount.value +
      this.form.controls.keepalive_unit.value;
    this.course.pause_duration = this.form.controls.pause_duration.value + 'h';
    this.course.pauseable = this.form.controls.pauseable.value;
    this.course.keep_vm = this.form.controls.keep_vm.value;

    this.courseService.create(this.course).subscribe({
      next: (_s: ServerResponse) => {
        this.alertText = 'Course created';
        this.isAlert = true;
        this.alertType = ClrAlertType.Success;
        this.added.emit(true);
        setTimeout(() => (this.newCourseOpen = false), 1000);
      },
      error: (e: HttpErrorResponse) => {
        this.alertText = 'Error creating object: ' + e.error.message;
        this.isAlert = true;
        this.alertType = ClrAlertType.Danger;
      },
    });
  }
}
