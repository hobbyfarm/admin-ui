import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../data/course.service';
import { Course } from '../data/course';
import { NewCourseComponent } from './new-course/new-course.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { DragulaService } from 'ng2-dragula';
import { AddScenarioComponent } from './add-scenario/add-scenario.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { cloneDeep } from 'lodash-es';
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

  @ViewChild('newCourse') newCourse: NewCourseComponent;
  @ViewChild('addNewCourse') addNewCourse: CourseWizardComponent;
  @ViewChild('editcourse') editCourseWizard: CourseWizardComponent;
  @ViewChild('addScenario') addScenario: AddScenarioComponent;
  @ViewChild('deleteConfirmation')
  deleteConfirmation: DeleteConfirmationComponent;

  private courseForm: CourseFormComponent;

  @ViewChild('courseform', { static: false }) set content(
    content: CourseFormComponent
  ) {
    if (content) {
      this.courseForm = content;
    }
  }

  public selectedCourse: Course;

  public editForm: FormGroup;
  public newCategoryForm: FormGroup = new FormGroup({
    category: new FormControl(null, [Validators.required]),
  });

  public scenarios: Scenario[] = [];
  public dragScenarios: Scenario[] = [];
  public dynamicAddedScenarios: Scenario[] = [];
  public editVirtualMachines: {}[] = [];
  public editCategories: string[] = [];

  public alertType: string = 'warning';
  public alertText: string = null;
  public isAlert: boolean = false;
  public modified: boolean = false;

  public newCategory: boolean = false;

  public courseDetailsActive: boolean = false;

  public selectRbac: boolean = false;
  public updateRbac: boolean = false;
  public listScenarios: boolean = false;
  public seeExamples = false;

  public ascSort = ClrDatagridSortOrder.ASC;

  constructor(
    public courseService: CourseService,
    public scenarioService: ScenarioService,
    public dragulaService: DragulaService,
    public rbacService: RbacService
  ) {
    dragulaService.destroy('scenarios');
    dragulaService.createGroup('scenarios', {
      moves: (el, container, handle) => {
        return handle.className == 'handle';
      },
    });

    dragulaService.drop('scenarios').subscribe(() => {
      this.setModified();
    });
  }

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
    this.courseService.list(true).subscribe((cList: Course[]) => {
      this.courses = cList;
    });
  }

  setupForm(fg: FormGroup) {
    this.editForm = fg;
    if (!this.updateRbac) {
      this.editForm.disable();
    } else {
      this.editForm.enable();
      this.editForm.valueChanges.subscribe((a: any) => {
        if (this.editForm.dirty) {
          this.setModified();
        }
      });
    }
  }

  addSelected(s: Scenario[]) {
    this.dragScenarios = this.dragScenarios.concat(s);
    this.setModified();
  }

  deleteScenario(i: number) {
    this.dragScenarios.splice(i, 1);
    this.setModified();
  }

  setModified() {
    this.alertText =
      'Course has been modified, please save your changes or discard';
    this.alertType = 'warning';
    this.isAlert = true;
    this.modified = true;
  }

  clearModified() {
    this.isAlert = false;
    this.alertText = '';
    this.modified = false;
  }

  alertSuccess(msg: string) {
    this.alertType = 'success';
    this.alertText = msg;
    this.isAlert = true;
    setTimeout(() => (this.isAlert = false), 1000);
  }

  alertDanger(msg: string) {
    this.alertType = 'danger';
    this.alertText = msg;
    this.isAlert = true;
    setTimeout(() => (this.isAlert = false), 3000);
  }

  openNew() {
    this.newCourse.open();
  }

  openNewWizard() {
    this.addNewCourse.openNewCourse();
  }

  openAdd() {
    this.addScenario.open();
  }

  deleteCategory(category: string) {
    this.editCategories.forEach((element, index) => {
      if (element == category) this.editCategories.splice(index, 1);
    });
    this.updateDynamicScenarios();
    this.setModified();
  }

  addCategory() {
    let categories = this.newCategoryForm.get('category').value;
    categories = categories.split(',');
    categories.forEach((category) => {
      category = category.replace(/\s/g, ''); //remove all whitespaces
      if (category != '' && !this.editCategories.includes(category)) {
        this.editCategories.push(category);
      }
    });
    this.newCategoryForm.reset();
    this.newCategory = false;
    this.updateDynamicScenarios();
    this.setModified();
  }

  updateDynamicScenarios() {
    this.dynamicAddedScenarios = [];
    if (this.listScenarios) {
      this.courseService.listDynamicScenarios(this.editCategories).subscribe(
        (dynamicScenarios: String[]) => {
          this.scenarios.forEach((scenario) => {
            if (dynamicScenarios && dynamicScenarios.includes(scenario.id)) {
              this.dynamicAddedScenarios.push(scenario);
            }
          });
        },
        (e: HttpErrorResponse) => {
          this.alertDanger(
            'Error listing dynmamic scenarios: ' + e.error.message
          );
        }
      );
    }
  }

  discardChanges() {
    this.courseDetailsActive = true;
    setTimeout(() => this.courseForm.reset(), 200); // hack

    this.dragScenarios = this.selectedCourse.scenarios;
    this.editVirtualMachines = cloneDeep(this.selectedCourse.virtualmachines);
    this.editCategories = this.selectedCourse.categories;
    this.clearModified();
    this.updateDynamicScenarios();
  }

  editCourse(c: Course) {
    if (c) {
      // because this can be called when unsetting the selected course
      this.courseDetailsActive = true;
      setTimeout(() => this.courseForm.reset(), 200); // hack
      this.dragScenarios = c.scenarios;
      this.editVirtualMachines = cloneDeep(c.virtualmachines);
      this.editCategories = c.categories;
      this.updateDynamicScenarios();
    }
  }

  openEditCourseWizard(course: Course) {
    this.selectedCourse = course;
    this.editCourseWizard.openEditCourse(course);
  }

  saveCourse() {
    this.selectedCourse.name = this.editForm.get('course_name').value;
    this.selectedCourse.description =
      this.editForm.get('course_description').value;
    this.selectedCourse.keepalive_duration =
      this.editForm.get('keepalive_amount').value +
      this.editForm.get('keepalive_unit').value;
    this.selectedCourse.pause_duration =
      this.editForm.get('pause_duration').value + 'h';
    this.selectedCourse.pauseable = this.editForm.get('pauseable').value;
    this.selectedCourse.keep_vm = this.editForm.get('keep_vm').value;
    this.selectedCourse.categories = this.editCategories;
    this.selectedCourse.scenarios = this.dragScenarios;
    this.selectedCourse.virtualmachines = this.editVirtualMachines;

    this.courseService.update(this.selectedCourse).subscribe(
      (s: ServerResponse) => {
        this.clearModified();
        this.alertSuccess('Course successfully updated');
      },
      (e: HttpErrorResponse) => {
        this.alertDanger('Error creating object: ' + e.error.message);
      }
    );
  }

  delete(course: Course): void {
    this.selectedCourse = course;
    this.deleteConfirmation.open();
  }

  deleteSelected(): void {
    this.courseService.delete(this.selectedCourse).subscribe(
      (s: ServerResponse) => {
        this.clearModified();
        this.alertSuccess('Course deleted');
        this.refresh();
        this.selectedCourse = null;
        this.courseDetailsActive = true; // return the user to the details tab
      },
      (e: HttpErrorResponse) => {
        this.alertDanger('Error deleting object: ' + e.error.message);
      }
    );
  }
}
