import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RbacService } from '../data/rbac.service';
import { TypedSettingsService } from '../data/typedSettings.service';
import { TypedInput } from '../typed-form/TypedInput';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public motd: string;

  constructor(
    private router: Router,
    private rbacService: RbacService,
    private typedSettingsService: TypedSettingsService
  ) {}

  ngOnInit(): void {
    // navigate to session statistics per default
    const authorizationRequests = Promise.all([
      this.rbacService.Grants('progresses', 'list'),
      this.rbacService.Grants('scenarios', 'list'),
    ]);

    authorizationRequests.then((permissions: [boolean, boolean]) => {
      // If the user has the permission to list progress and scenarios, he is able to list session statistics
      if (permissions[0] && permissions[1]) {
        this.router.navigateByUrl('/home/statistics/sessions');
      }
    });

    this.typedSettingsService
      .get('admin-ui', 'motd-admin-ui')
      .subscribe((typedInput: TypedInput) => {
        this.motd = typedInput?.value ?? '';
      });
  }
}
