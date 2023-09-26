import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './event/event.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { UserComponent } from './user/user/user.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EnvironmentsComponent } from './configuration/environments/environments.component';
import { ContentComponent } from './content/content.component';
import { CourseComponent } from './course/course.component';
import { PrintableComponent } from './printable/printable.component';
import { VmtemplatesComponent } from './configuration/vmtemplates/vmtemplates.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { StepComponent } from './step/step-component/step.component';
import { TerminalComponent } from './step/terminal/terminal.component';
import { RolesComponent } from './configuration/roles/roles/roles.component';
import { SessionStatisticsComponent } from './session-statistics/session-statistics.component';
import {SettingsComponent} from './configuration/settings/settings.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: 'statistics/sessions',
        component: SessionStatisticsComponent
      }
    ]
  },
  {
    path: 'dashboards',
    component: DashboardsComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'events',
    component: EventComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'content',
    component: ContentComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: 'scenarios',
        component: ScenarioComponent
      },
      {
        path: 'courses',
        component: CourseComponent
      }
    ]
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'environments',
        component: EnvironmentsComponent
      },
      {
        path: 'vmtemplates',
        component: VmtemplatesComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      }
    ]
  },
  {
    path: 'session/:session/steps/:step',
    component: StepComponent,
  },
  { path: 'terminal', component: TerminalComponent },
  {
    path: 'scenario/:scenario/printable',
    component: PrintableComponent,
    canActivate: [
      AuthGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
