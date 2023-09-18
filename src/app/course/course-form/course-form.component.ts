import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Course } from 'src/app/data/course';
import { CourseDetailFormGroup } from 'src/app/data/forms';
import { KeepaliveValidator } from 'src/app/validators/keepalive.validator';

@Component({
  selector: 'course-form',
  templateUrl: './course-form.component.html',
})
export class CourseFormComponent implements OnInit, OnChanges {
  @Input()
  course: Course;

  @Output()
  formReady: EventEmitter<CourseDetailFormGroup> = new EventEmitter(null);

  public courseDetails: CourseDetailFormGroup = new FormGroup(
    {
      course_name: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      course_description: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      keepalive_amount: new FormControl<number>(10, {
        validators: Validators.required,
        nonNullable: true,
      }),
      keepalive_unit: new FormControl<string>('m', {
        validators: Validators.required,
        nonNullable: true,
      }),
      pauseable: new FormControl<boolean>(true, {
        validators: Validators.required,
        nonNullable: true,
      }),
      keep_vm: new FormControl<boolean>(true, {
        validators: Validators.required,
        nonNullable: true,
      }),
      pause_duration: new FormControl<number>(1, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]+$'),
        ],
        nonNullable: true,
      }),
    },
    { validators: KeepaliveValidator }
  );

  constructor() {}

  ngOnInit(): void {
    this.formReady.emit(this.courseDetails);
  }

  reset(): void {
    this.courseDetails.reset();

    if (this.course) {
      this.courseDetails.patchValue({
        course_name: this.course.name,
        course_description: this.course.description,
      });

      const pauseDuration = Number(this.course.pause_duration?.slice(0, -1))
      if (!Number.isNaN(pauseDuration)) {
        this.courseDetails.patchValue({
          pause_duration: pauseDuration,
        });
      }

      if (this.course.pauseable) {
        this.courseDetails.patchValue({
          pauseable: this.course.pauseable,
        });
      }

      if (this.course.keep_vm) {
        this.courseDetails.patchValue({
          keep_vm: this.course.keep_vm,
        });
      }

      if (this.course.keepalive_duration) {
        this.courseDetails.patchValue({
          keepalive_amount: Number(
            this.course.keepalive_duration?.substring(
              0,
              this.course.keepalive_duration.length - 1
            )
          ),
          keepalive_unit: this.course.keepalive_duration?.substring(
            this.course.keepalive_duration.length - 1
          ),
        });
      }
    }
  }

  ngOnChanges(): void {
    this.reset();
  }

  get keepaliveRequired() {
    const ka = this.courseDetails.controls.keepalive_amount;
    const ku = this.courseDetails.controls.keepalive_unit;

    if ((ka.dirty || ka.touched) && ka.invalid && ka.errors.required) {
      return true;
    } else if ((ku.dirty || ku.touched) && ku.invalid && ku.errors.required) {
      return true;
    } else {
      return false;
    }
  }
}
