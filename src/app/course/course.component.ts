import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../data/course.service';
import { Course } from '../data/course';
import { ScenarioService } from '../data/scenario.service';
import { ServerResponse } from '../data/serverresponse';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { RbacService } from '../data/rbac.service';
import { ClrDatagridSortOrder } from '@clr/angular';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  public courses: Course[] = [];

  @ViewChild('addNewCourse') addNewCourse: CourseWizardComponent;
  @ViewChild('editcourse') editCourseWizard: CourseWizardComponent;
  @ViewChild('deleteConfirmation')
  deleteConfirmation: DeleteConfirmationComponent;

  public selectedCourse: Course | null = null;

  public alertType: string = 'warning';
  public alertText: string = '';
  public alertClosed: boolean = true;

  public showActionOverflow: boolean = false;

  public selectRbac: boolean = false;
  public updateRbac: boolean = false;
  public listScenarios: boolean = false;

  public ascSort = ClrDatagridSortOrder.ASC;

  constructor(
    public courseService: CourseService,
    public scenarioService: ScenarioService,
    public rbacService: RbacService,
  ) {}

  ngOnInit(): void {
    const authorizationRequests = Promise.all([
      this.rbacService.Grants('courses', 'get'),
      this.rbacService.Grants('courses', 'update'),
      this.rbacService.Grants('scenarios', 'list'),
      this.rbacService.Grants('courses', 'delete'),
    ]);

    authorizationRequests.then(
      (permissions: [boolean, boolean, boolean, boolean]) => {
        const allowedGet: boolean = permissions[0];
        const allowedUpdate: boolean = permissions[1];
        const allowListScenarios: boolean = permissions[2];
        const allowDelete: boolean = permissions[3];
        // Enable permission to list courses if either "get" or "update" on courses is granted
        this.selectRbac = allowedGet || allowedUpdate;
        this.showActionOverflow = allowDelete || (allowedGet && allowedUpdate);
        this.listScenarios = allowListScenarios;
        // Enable permission to update courses
        this.updateRbac = allowedUpdate && this.listScenarios;
        return this.listScenarios;
      },
    );

    this.refresh();
  }

  refresh(): void {
    this.courseService.list(true).subscribe((cList: Course[]) => {
      this.courses = cList;
    });
  }

  alertSuccess(msg: string) {
    this.alertType = 'success';
    this.alertText = msg;
    this.alertClosed = false;
    setTimeout(() => (this.alertClosed = true), 1000);
  }

  alertDanger(msg: string) {
    this.alertType = 'danger';
    this.alertText = msg;
    this.alertClosed = false;
    setTimeout(() => (this.alertClosed = true), 3000);
  }

  openNewWizard() {
    this.addNewCourse.openNewCourse();
  }

  openEditCourseWizard(course: Course) {
    this.selectedCourse = course;
    this.editCourseWizard.openEditCourse(course);
  }

  delete(course: Course): void {
    this.selectedCourse = course;
    this.deleteConfirmation.open();
  }

  deleteSelected(): void {
    if (!this.selectedCourse) {
      this.alertDanger(
        'Error deleting object: Selected course is unavailable!',
      );
      return;
    }
    this.courseService.delete(this.selectedCourse).subscribe({
      next: (_s: ServerResponse) => {
        this.alertSuccess('Course deleted');
        this.refresh();
        this.selectedCourse = null;
      },
      error: (e: HttpErrorResponse) => {
        this.alertDanger('Error deleting object: ' + e.error.message);
      },
    });
  }
}
