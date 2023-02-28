import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RbacService } from '../data/rbac.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  })
export class HomeComponent implements OnInit {
  constructor(private router: Router, private rbacService: RbacService) { }

  ngOnInit(): void {
    // navigate to session statistics per default
    const authorizationRequests = Promise.all([
      this.rbacService.Grants("progresses", "list"),
      this.rbacService.Grants("scenarios", "list")
    ])

    authorizationRequests.then((permissions: [boolean, boolean]) => {
      // If the user has the permission to list progress and scenarios, he is able to list session statistics
      if(permissions[0] && permissions[1]) {
        this.router.navigateByUrl('/home/statistics/sessions');
      }
    });
  }
}
