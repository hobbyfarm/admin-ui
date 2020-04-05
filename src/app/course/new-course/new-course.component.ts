import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeepaliveValidator } from 'src/app/validators/keepalive.validator';
import { CourseService } from 'src/app/data/course.service';
import { Course } from 'src/app/data/course';
import { ServerResponse } from 'src/app/data/serverresponse';
import { ClrAlertType } from 'src/app/clr-alert-type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit {
  @Output()
  public added: EventEmitter<boolean> = new EventEmitter(null);

  public alertText: string = null;
  public isAlert: boolean = false;
  public alertType: string = ClrAlertType.Info;

  public newCourseOpen: boolean = false;

  constructor(
    public courseService: CourseService
  ) { }

  ngOnInit(): void {
  }

  public open() {
    this.courseDetails.reset({
      'course_name': null,
      'course_description': null,
      'keepalive_amount': 10,
      'keepalive_unit': 'm',
      'pauseable': true
    });
    this.alertText = null;
    this.isAlert = false;
    this.newCourseOpen = true;
  }

  get keepaliveRequired() {
    var ka = this.courseDetails.get("keepalive_amount");
    var ku = this.courseDetails.get("keepalive_unit");

    if ((ka.dirty || ka.touched) && ka.invalid && ka.errors.required) {
      return true;
    } else if ((ku.dirty || ku.touched) && ku.invalid && ku.errors.required) {
      return true;
    } else {
      return false;
    }
  }

  public courseDetails: FormGroup = new FormGroup({
    'course_name': new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'course_description': new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'keepalive_amount': new FormControl(10, [
      Validators.required
    ]),
    'keepalive_unit': new FormControl('m', [
      Validators.required
    ]),
    'pauseable': new FormControl(true, [
      Validators.required
    ]),
    'pause_duration': new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(48)
    ])
  }, { validators: KeepaliveValidator })

  save() {
    var course = new Course();
    course.name = this.courseDetails.get('course_name').value;
    course.description = this.courseDetails.get('course_description').value;
    course.keepalive_duration = this.courseDetails.get('keepalive_amount').value +
      this.courseDetails.get('keepalive_unit').value;
    course.pause_duration = this.courseDetails.get('pause_duration').value;
    course.pauseable = this.courseDetails.get('pauseable').value;


    this.courseService.create(course)
      .subscribe(
        (s: ServerResponse) => {
          this.alertText = "Course created";
          this.isAlert = true;
          this.alertType = ClrAlertType.Success;
          this.added.emit(true);
          setTimeout(() => this.newCourseOpen = false, 1000);
        },
        (e: HttpErrorResponse) => {
          this.alertText = "Error creating object: " + e.error.message;
          this.isAlert = true;
        }
      )
  }
}
