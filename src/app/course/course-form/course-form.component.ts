import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeepaliveValidator } from 'src/app/validators/keepalive.validator';
import { Course } from 'src/app/data/course';

@Component({
  selector: 'course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  @Input()
  course: Course;

  @Output()
  formReady: EventEmitter<FormGroup> = new EventEmitter(null);

  constructor() { }

  ngOnInit(): void {
    this.formReady.emit(this.courseDetails);
  }

  reset(): void {
    this.courseDetails.reset({
      'course_name': null,
      'course_description': null,
      'keepalive_amount': 10,
      'keepalive_unit': 'm',
      'pauseable': true,
      'keep_vm': true,
      'pause_duration': 1
    });
    
    if (this.course) {
      this.courseDetails.patchValue({
        'course_name': this.course.name,
        'course_description': this.course.description,
        'pause_duration': this.course.pause_duration
      })

      if (this.course.pauseable == undefined) {
        this.courseDetails.patchValue({
          'pauseable': true
        })
      } else {
        this.courseDetails.patchValue({
          'pauseable': this.course.pauseable
        })
      }

      if (this.course.keep_vm == undefined) {
        this.courseDetails.patchValue({
          'keep_vm': true
        })
      } else {
        this.courseDetails.patchValue({
          'keep_vm': this.course.keep_vm
        })
      }

      if (this.course.keepalive_duration) {
        this.courseDetails.patchValue({
          'keepalive_amount': this.course.keepalive_duration.substring(0, this.course.keepalive_duration.length-1),
          "keepalive_unit": this.course.keepalive_duration.substring(this.course.keepalive_duration.length-1)
        })
      }
    }
  }

  ngOnChanges(): void {
    this.reset();
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
    'keep_vm': new FormControl(true, [
      Validators.required
    ]),
    'pause_duration': new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(48)
    ])
  }, { validators: KeepaliveValidator })

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

}
