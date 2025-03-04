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
import { CategoryFormGroup, CourseDetailFormGroup } from 'src/app/data/forms';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'wizard-course',
  templateUrl: './course-wizard.component.html',
  styleUrls: ['./course-wizard.component.scss'],
})
export class CourseWizardComponent implements OnChanges, OnInit {
  public course: Course = new Course();
  public selectedCourse: Course = new Course();
  public editSelectedCourse: Course = new Course();
  public dragScenarios: Scenario[] = [];

  @Input()
  public updateRbac: boolean;

  @Input()
  public listScenarios: boolean;

  @Input()
  public wizardCourse: 'create' | 'edit';

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

  public form?: CourseDetailFormGroup;
  public newCategoryForm: CategoryFormGroup = new FormGroup({
    category: new FormControl<string | null>(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9,;]+$/),
    ]),
  });

  public alertText: string = '';
  public isAlert: boolean = false;
  public isFormValid: boolean = false;
  public newCategory: boolean = false;
  public courseDetailsActive: boolean = false;
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
    public scenarioService: ScenarioService,
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
          const defaultVal: Scenario[] = [];
          return lastValueFrom(this.scenarioService.list(), {
            defaultValue: defaultVal,
          });
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
    this.isFormValid = !!this.form?.valid;
    this.coursesRefresher.emit();
  }

  @ViewChild('courseForm', { static: false }) set content(
    content: CourseFormComponent,
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

  courseHasAtLeastOneVMSet(): boolean {
    return this.editVirtualMachines.length > 0;
  }

  courseHasValidVMCConfiguration(): boolean {
    if (this.editVirtualMachines.length > 0) {
      const validVMSets = this.editVirtualMachines.filter(
        (virtualmachine, i) => {
          if (Object.keys(virtualmachine).length > 0) {
            return true;
          }
          return false;
        },
      );
      if (validVMSets.length == this.editVirtualMachines.length) {
        return true;
      }
    }
    return false;
  }

  openEditCourse(course: Course) {
    this.wizard.reset();
    this.selectedCourse = course;
    this.editCourse(course);
    this.wizard.open();
    this.wizard.navService.goTo(this.wizard.pages.last, true);
    this.wizard.pages.first.makeCurrent();
  }

  setupForm(fg: FormGroup) {
    if (this.wizardCourse == 'create') this.setupFormCreate(fg);
    if (this.wizardCourse == 'edit') this.setupFormEdit(fg);
  }
  setupFormCreate(fg: CourseDetailFormGroup) {
    this.form = fg;
  }

  setupFormEdit(fg: CourseDetailFormGroup) {
    this.form = fg;
    fg.valueChanges.subscribe(() => {
      if (fg.dirty) {
        this.setModified();
      }
    });
  }

  saveCourseWizard() {
    this.updateDynamicScenarios();
    if (this.wizardCourse == 'create') this.newCourseWizard();
  }

  setCourseValues(course: Course) {
    // "this.form" is always defined because otherwise the wizard would prevent further processing
    if (!this.form) {
      // In case this function is used without defining the course form ... throw an error
      throw new Error('Form is not defined!');
    }
    course.name = this.form.controls.course_name.value;
    course.description = this.form.controls.course_description.value ?? '';
    course.keepalive_duration =
      this.form.controls.keepalive_amount.value +
      this.form.controls.keepalive_unit.value;
    course.pause_duration = this.form.controls.pause_duration.value + 'h';
    course.pauseable = this.form.controls.pauseable.value;
    course.keep_vm = this.form.controls.keep_vm.value;
    course.virtualmachines = this.editVirtualMachines;
    course.scenarios = cloneDeep(this.dragScenarios);
    course.categories = this.form.controls.is_learnpath.value
      ? []
      : this.editCategories;
    course.is_learnpath = this.form.controls.is_learnpath.value;
    course.is_learnpath_strict = this.form.controls.is_learnpath_strict.value;
    course.in_catalog = this.form.controls.in_catalog.value;
    course.header_image_path = this.form.controls.header_image_path.value ?? '';
  }
  newCourseWizard() {
    this.setCourseValues(this.course);
  }
  updateCourseWizard() {
    this.setCourseValues(this.selectedCourse);
  }
  updateFinalPageWizard() {
    if (this.wizardCourse == 'edit') {
      this.setCourseValues(this.editSelectedCourse);
    }
  }

  setVM(vms: {}[]) {
    this.editVirtualMachines = vms;
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
    this.editSelectedCourse.scenarios.splice(i, 1);
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
    if (this.canAddDynamicScenarios()) {
      this.courseService.listDynamicScenarios(this.editCategories).subscribe(
        (dynamicScenarios: String[]) => {
          this.scenarios.forEach((scenario) => {
            if (dynamicScenarios && dynamicScenarios.includes(scenario.id)) {
              this.dynamicAddedScenarios.push(scenario);
            }
          });
        },
        (e: HttpErrorResponse) => {
          this.alertDanger('Error listing dynmamic scenarios: ' + e.message);
        },
      );
    }
  }

  canAddDynamicScenarios(): boolean {
    if (!this.listScenarios) return false;
    switch (this.wizardCourse) {
      case 'create':
        return !this.course.is_learnpath;
      case 'edit':
        if (this.modified) return !this.editSelectedCourse.is_learnpath;
        return !this.selectedCourse.is_learnpath;
    }
  }

  addSelected(s: Scenario[]) {
    this.dragScenarios = this.dragScenarios.concat(s);
    this.setModified();
  }

  addCategory() {
    let categories = this.newCategoryForm.controls.category.value;
    const categoryArray = categories?.split(',') ?? [];
    categoryArray.forEach((category) => {
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
      this.dragScenarios = cloneDeep(c.scenarios);
      this.editVirtualMachines = cloneDeep(c.virtualmachines);
      this.editCategories = c.categories;
      this.updateDynamicScenarios();
    }
  }

  whenFinish() {
    if (this.wizardCourse == 'create') this.createCourse();
    if (this.wizardCourse == 'edit') {
      this.updateCourseWizard();
      this.updateCourse();
    }
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
        this.alertText = 'Error creating object: ' + e.message;
        this.isAlert = true;
      },
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
        this.alertText = 'Error creating object: ' + e.message;
        this.isAlert = true;
      },
    );
  }

  getSelectedCourseVM(index: any, vmname: any) {
    const selectedCourseVMs = this.showVM(
      this.selectedCourse.virtualmachines[index],
    );
    return selectedCourseVMs.has(vmname) ? selectedCourseVMs.get(vmname) : 0;
  }

  getEditSelectedCourseVM(index: any, vmname: any) {
    const editSelectedCourseVMs = this.showVM(
      this.editSelectedCourse.virtualmachines[index],
    );
    return editSelectedCourseVMs.has(vmname)
      ? editSelectedCourseVMs.get(vmname)
      : 0;
  }

  showVM(vms: any) {
    if (!vms) {
      return new Map();
    }
    return new Map(Object.entries(structuredClone(vms)));
  }

  isScenarioInList(scenario: Scenario, list?: Scenario[]): boolean {
    return list?.some((item) => item.name === scenario.name) ?? false;
  }

  isEditedVM(index: any, vmname: string, templateName: any): boolean {
    // This function determines if the currently selected VM is either beeing edited throug the following condition:
    const isEdited =
      this.getSelectedCourseVM(index, vmname) != templateName &&
      this.getSelectedCourseVM(index, vmname) != 0;
    // ... or if it was deleted and created again with the same vm name through the following condition:
    const deletedAndCreatedWithSameName =
      this.getSelectedCourseVM(index, vmname) === 0 &&
      this.getEditSelectedCourseVM(index, vmname) != templateName;
    // this.getSelectedCourseVM(index, vmname) != templateName && this.getSelectedCourseVM(index, vmname) != 0
    return isEdited || deletedAndCreatedWithSameName;
  }

  showDynamicScenario(): boolean {
    return !this.form?.controls.is_learnpath.value;
  }
}
