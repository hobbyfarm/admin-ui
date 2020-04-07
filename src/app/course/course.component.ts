import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../data/course.service';
import { Course } from '../data/course';
import { NewCourseComponent } from './new-course/new-course.component';
import { FormGroup } from '@angular/forms';
import { Scenario } from '../data/scenario';
import { ScenarioService } from '../data/scenario.service';
import { DragulaService } from 'ng2-dragula';
import { AddScenarioComponent } from './add-scenario/add-scenario.component';
/*
NEXT UP:
Need to pull actual list of scenarios from the Course object.
Will need to figure out how to display the whole scenario object based on the key from the course object. 
Once that is done, figure out how to remove scenarios from the course (probably use splice())
Once that is done, need to figure out saving the object.

Also look into encapsulating the tab set within an ng-container so you can show/hide like in scenario editing.
*/
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  public courses: Course[] = [];

  @ViewChild("newCourse") newCourse: NewCourseComponent;
  @ViewChild("addScenario") addScenario: AddScenarioComponent; 

  public selectedCourse: Course;

  public editForm: FormGroup;

  public scenarios: Scenario[] = [];

  public alertType: string = "warning";
  public alertText: string = null;
  public isAlert: boolean = false;
  public modified: boolean = false;

  constructor(
    public cService: CourseService,
    public scenarioService: ScenarioService,
    public dragulaService: DragulaService
  ) { 
    dragulaService.createGroup('scenarios', {
      moves: (el, container, handle) => {
        return handle.className == "handle"
      },
    })

    dragulaService.drop('scenarios').subscribe(
      () => {
        this.setModified();
      }
    )
  }

  ngOnInit(): void {
    this.refresh();
    this.scenarioService.list()
    .subscribe((s: Scenario[]) => this.scenarios = s)
  }

  refresh(): void {
    this.cService.list()
    .subscribe(
      (cList: Course[]) => this.courses = cList
    )
  }

  setupForm(fg: FormGroup) {
    this.editForm = fg;
  }

  addSelected(s: Scenario[]) {
    this.scenarios = this.scenarios.concat(s);
    this.setModified();
  }

  setModified() {
    this.alertText = "Course has been modified, please save your changes";
    this.alertType = "warning";
    this.isAlert = true;
    this.modified = true;
  }

  clearModified() {
    this.isAlert = false;
    this.alertText = "";
    this.modified = false;
  }

  openNew() {
    this.newCourse.open();
  }

  openAdd() {
    this.addScenario.open();
  }
}
