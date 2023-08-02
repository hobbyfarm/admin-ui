import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { ClrAlertType } from 'src/app/clr-alert-type';
import { Course } from 'src/app/data/course';
import { CourseService } from 'src/app/data/course.service';
import { RbacService } from 'src/app/data/rbac.service';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';

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
  public isVMNull: boolean = true;
  public alertType: string = ClrAlertType.Info;

  public editVirtualMachines: {}[] = [];
  public scenarios: Scenario[] = [];
  public courses: Course[] = [];

  public newCourseOpen: boolean = false;
  public modified: boolean = false;
  public updateRbac: boolean = false;
  public selectRbac: boolean = false;
  public listScenarios: boolean = false;

  constructor(
    public courseService: CourseService,
    public rbacService: RbacService,
    public scenarioService: ScenarioService
  ) {}

  ngOnInit(): void {
    const authorizationRequests = Promise.all([
      this.rbacService.Grants('courses', 'get'),
      this.rbacService.Grants('courses', 'update'),
      this.rbacService.Grants('scenarios', 'list'),
    ]);

    authorizationRequests
      .then((permissions: [boolean, boolean, boolean]) => {
        const allowedGet: boolean = permissions[0];
        const allowedUpdate: boolean = permissions[1];
        const allowListScenarios: boolean = permissions[2];
        // Enable permission to list courses if either "get" or "update" on courses is granted
        this.selectRbac = allowedGet || allowedUpdate;
        this.listScenarios = allowListScenarios;
        // Enable permission to update courses
        this.updateRbac = allowedUpdate && this.listScenarios;
        return this.listScenarios;
      })
      .then((allowListScenarios: boolean) => {
        if (allowListScenarios) {
          return this.scenarioService.list().toPromise();
        } else {
          return [];
        }
      })
      .then((s: Scenario[]) => {
        this.scenarios = s;
      });
    this.refresh();
  }

  refresh(): void {
    this.courseService
      .list(true)
      .subscribe((cList: Course[]) => (this.courses = cList));
  }

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
    this.course.keepalive_duration =
      this.form.get('keepalive_amount').value +
      this.form.get('keepalive_unit').value;
    this.course.pause_duration = this.form.get('pause_duration').value + 'h';
    this.course.pauseable = this.form.get('pauseable').value;
    this.course.keep_vm = this.form.get('keep_vm').value;
    this.course.virtualmachines = this.editVirtualMachines;
  }

  setModified() {
    this.alertText =
      'Course has been modified, please save your changes or discard';
    this.alertType = 'warning';
    this.isAlert = true;
    this.modified = true;
    if(this.course.virtualmachines.length > 0) this.isVMNull = false; else this.isVMNull = true;
  }
  whenFinish() {
    this.courseService
      .create(this.course)
      .subscribe
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
      ();
    }
}
