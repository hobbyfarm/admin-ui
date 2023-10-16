import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { ClrAlertType } from 'src/app/clr-alert-type';
import { Course } from 'src/app/data/course';
import { CourseService } from 'src/app/data/course.service';
import { RbacService } from 'src/app/data/rbac.service';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import { CourseFormComponent } from '../course-form/course-form.component';
import { VmsetComponent } from 'src/app/vmset/vmset.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerResponse } from 'src/app/data/serverresponse';
import { AddScenarioComponent } from '../add-scenario/add-scenario.component';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'wizard-course',
  templateUrl: './course-wizard.component.html',
  styleUrls: ['./course-wizard.component.scss'],
})
export class CourseWizardComponent implements OnChanges, OnInit {
  public course: Course = new Course();
  public selectedCourse: Course = new Course();

  @Input()
  public updateRbac: boolean;

  @Input()
  public listScenarios: boolean;

  @Input()
  public wizardCourse: 'create' | 'edit';

  @Input()
  public dragScenarios: Scenario[] = [];

  @Output()
  textChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  alertChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  coursesRefresher = new EventEmitter();

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;
  @ViewChild('courseForm', { static: true }) courseForm: CourseFormComponent;
  @ViewChild('virtualmachine', { static: true }) virtualMachine: VmsetComponent;
  @ViewChild('addScenario', { static: true }) addScenario: AddScenarioComponent;

  public form: FormGroup = new FormGroup({});
  public newCategoryForm: FormGroup = new FormGroup({
    category: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9,;]+$/),
    ]),
  });

  public alertText: string = null;
  public isAlert: boolean = false;
  public isFormValid: boolean = false;
  public newCategory: boolean = false;
  public courseDetailsActive: boolean = false;
  public VMAllowNext: boolean = false;
  public seeExamples: boolean = false;
  public newCourseOpen: boolean = false;
  public modified: boolean = false;
  public selectRbac: boolean = false;
  public allowUpdate: boolean = false;

  public editVirtualMachines: {}[] = [];
  public scenarios: Scenario[] = [];
  public courses: Course[] = [];
  public dynamicAddedScenarios: Scenario[] = [];
  public editCategories: string[] = [];

  public wizardTitle: string = '';
  public alertType: string = ClrAlertType.Info;

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
  }

  ngOnChanges(): void {
    this.allowUpdate = this.updateRbac;
    this.wizardTitle =
      this.wizardCourse == 'create' ? 'Create new Course' : 'Edit Course';
    if (this.listScenarios) {
      this.scenarioService.list().subscribe((s: Scenario[]) => {
        this.scenarios = s;
      });
    } else {
      this.scenarios = [];
    }
    this.coursesRefresher.emit();
  }

  @ViewChild('courseForm', { static: false }) set content(
    content: CourseFormComponent
  ) {
    if (content) {
      this.courseForm = content;
    }
  }

  openNewCourse() {
    this.courseForm.resetFormToRenew();
    this.wizard.reset();
    this.wizard.open();
  }
  VMSAllow() {
    if (Object.keys(this.editVirtualMachines[0]).length !== 0)
      this.VMAllowNext = true;
    if (Object.keys(this.editVirtualMachines[0]).length == 0)
      this.VMAllowNext = false;
  }
  openEditCourse(course: Course) {
    this.wizard.reset();
    this.selectedCourse = course;
    this.editCourse(course);
    this.VMSAllow();
    this.wizard.open();
    this.wizard.navService.goTo(this.wizard.pages.last, true);
    this.wizard.pages.first.makeCurrent();
  }

  setupForm(fg: FormGroup) {
    if (this.wizardCourse == 'create') this.setupFormCreate(fg);
    if (this.wizardCourse == 'edit') this.setupFormEdit(fg);
  }
  setupFormCreate(fg: FormGroup) {
    this.form = fg;
  }

  setupFormEdit(fg: FormGroup) {
    this.form = fg;
    this.form.valueChanges.subscribe((a: any) => {
      if (this.form.dirty) {
        this.setModified();
      }
    });
  }

  saveCourseWizard() {
    if (this.wizardCourse == 'create') this.newCourseWizard();
    if (this.wizardCourse == 'edit') this.updateCourseWizard();
  }
  newCourseWizard() {
    this.course.name = this.form.get('course_name').value;
    this.course.description = this.form.get('course_description').value;
    this.course.keepalive_duration =
      this.form.get('keepalive_amount').value +
      this.form.get('keepalive_unit').value;
    this.course.pause_duration = this.form.get('pause_duration').value + 'h';
    this.course.pauseable = this.form.get('pauseable').value;
    this.course.keep_vm = this.form.get('keep_vm').value;
    this.course.virtualmachines = this.editVirtualMachines;
    this.course.scenarios = this.dragScenarios;
    this.course.categories = this.editCategories;
  }
  updateCourseWizard() {
    this.selectedCourse.name = this.form.get('course_name').value;
    this.selectedCourse.description = this.form.get('course_description').value;
    this.selectedCourse.keepalive_duration =
      this.form.get('keepalive_amount').value +
      this.form.get('keepalive_unit').value;
    this.selectedCourse.pause_duration =
      this.form.get('pause_duration').value + 'h';
    this.selectedCourse.pauseable = this.form.get('pauseable').value;
    this.selectedCourse.keep_vm = this.form.get('keep_vm').value;
    this.selectedCourse.categories = this.editCategories;
    this.selectedCourse.scenarios = this.dragScenarios;
    this.selectedCourse.virtualmachines = this.editVirtualMachines;
  }

  setVM(vms: {}[]) {
    this.editVirtualMachines = vms;
    this.VMSAllow();
    this.setModified();
  }
  setModified() {
    this.alertText =
      'Course has been modified, please save your changes or discard';
    this.alertType = 'warning';
    this.isAlert = true;
    this.modified = true;
  }

  deleteScenario(i: number) {
    this.dragScenarios.splice(i, 1);
    this.setModified();
  }

  alertDanger(msg: string) {
    this.alertType = 'danger';
    this.alertText = msg;
    this.isAlert = true;
    setTimeout(() => (this.isAlert = false), 3000);
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

  addSelected(s: Scenario[]) {
    this.dragScenarios = this.dragScenarios.concat(s);
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

  deleteCategory(category: string) {
    this.editCategories.forEach((element, index) => {
      if (element == category) this.editCategories.splice(index, 1);
    });
    this.updateDynamicScenarios();
    this.setModified();
  }
  openAdd() {
    this.addScenario.open();
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
  whenFinish() {
    if (this.wizardCourse == 'create') this.createCourse();
    if (this.wizardCourse == 'edit') this.updateCourse();
    this.courseForm.resetFormToRenew();
    this.virtualMachine.resetVmSet();
    this.dragScenarios = [];
    this.wizard.reset();
  }
  doCancel() {
    this.virtualMachine.resetVmSet();
    this.dragScenarios = [];
  }

  createCourse() {
    this.courseService.create(this.course).subscribe(
      (s: ServerResponse) => {
        this.alertText = 'Course created';
        this.isAlert = true;
        this.alertType = ClrAlertType.Success;
        this.coursesRefresher.emit();
      },
      (e: HttpErrorResponse) => {
        this.alertText = 'Error creating object: ' + e.error.message;
        this.isAlert = true;
      }
    );
  }
  updateCourse() {
    this.courseService.update(this.selectedCourse).subscribe(
      (s: ServerResponse) => {
        this.alertText = 'Course updated';
        this.isAlert = true;
        this.alertType = ClrAlertType.Success;
        this.coursesRefresher.emit();
      },
      (e: HttpErrorResponse) => {
        this.alertText = 'Error creating object: ' + e.error.message;
        this.isAlert = true;
      }
    );
  }
}
