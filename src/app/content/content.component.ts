import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RbacService } from '../data/rbac.service';
import { ScenarioService } from '../data/scenario.service';
import { CourseService } from '../data/course.service';
import { Scenario } from '../data/scenario';
import { Course } from '../data/course';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
})
export class ContentComponent implements OnInit {
  scenarios: Scenario[] = [];
  courses: Course[] = [];
  selectRbac: boolean = false;

  constructor(
    public scenarioService: ScenarioService,
    public courseService: CourseService,
    public rbacService: RbacService,
    private route: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.contentNavigation();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.contentNavigation();
  }
  contentNavigation() {
    this.rbacService.Grants('scenarios', 'get').then((allowed: boolean) => {
      this.selectRbac = allowed;
    });

    this.rbacService.Grants('courses', 'get').then((allowed: boolean) => {
      this.selectRbac = allowed;
    });

    this.scenarioService.list().subscribe((s: Scenario[]) => {
      this.scenarios = s;
      if (this.scenarios.length > 0) {
        this.route.navigate(['scenarios'], { relativeTo: this.activateRoute });
      } else {
        this.courseService.list().subscribe((c: Course[]) => {
          this.courses = c;
          if (this.courses.length > 0)
            this.route.navigate(['courses'], {
              relativeTo: this.activateRoute,
            });
        });
      }
    });
  }
}
