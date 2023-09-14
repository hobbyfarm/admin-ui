import { Component, Input } from '@angular/core';
import { Course } from 'src/app/data/course';

@Component({
  selector: 'course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent {
  @Input()
  course: Course;
}
