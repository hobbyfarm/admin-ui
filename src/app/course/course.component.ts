import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../data/course.service';
import { Course } from '../data/course';
import { NewCourseComponent } from './new-course/new-course.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  public courses: Course[] = [];

  @ViewChild("newCourse") newCourse: NewCourseComponent;

  constructor(
    public cService: CourseService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.cService.list()
    .subscribe(
      (cList: Course[]) => this.courses = cList
    )
  }

  openNew() {
    this.newCourse.open();
  }
}
