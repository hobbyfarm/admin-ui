import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { ClrAlertType } from 'src/app/clr-alert-type';
import { Course } from 'src/app/data/course';
import { CourseService } from 'src/app/data/course.service';

@Component({
  selector: 'app-add-course-wizard',
  templateUrl: './add-course-wizard.component.html',
  styleUrls: ['./add-course-wizard.component.scss'],
})
export class AddCourseWizardComponent implements OnInit {
  public course: Course = new Course();

  @Input()
  public selectedCourse: Course; 

  public form: FormGroup = new FormGroup({});

  public alertText: string = null;
  public isAlert: boolean = false;
  public alertType: string = ClrAlertType.Info;

  public newCourseOpen: boolean = false;

  constructor(public courseService: CourseService) {}

  ngOnInit(): void {}

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;

  openCourse() {
    this.wizard.open();
  }
  setupForm(fg: FormGroup) {
    this.form = fg;
  }
  save() {
    this.course.name = this.form.get('course_name').value;
    this.course.description = this.form.get('course_description').value;
    this.course.keepalive_duration = this.form.get('keepalive_amount').value +
      this.form.get('keepalive_unit').value;
    this.course.pause_duration = this.form.get('pause_duration').value + 'h';
    this.course.pauseable = this.form.get('pauseable').value;
    this.course.keep_vm = this.form.get('keep_vm').value;


    
  }
  whenFinish(){
    this.courseService.create(this.course)
      .subscribe(
        // (s: ServerResponse) => {
        //   // this.alertText = "Course created";
        //   // this.isAlert = true;
        //   // this.alertType = ClrAlertType.Success;
        //   // setTimeout(() => this.newCourseOpen = false, 1000);
        // },
        // (e: HttpErrorResponse) => {
        //   // this.alertText = "Error creating object: " + e.error.message;
        //   // this.isAlert = true;
        // }
      )
  }
}
