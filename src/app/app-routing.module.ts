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

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'home',
    component: HomeComponent,
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
    path: 'scenarios',
    component: ScenarioComponent,
    canActivate: [
      AuthGuard
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
        path: 'environments',
        component: EnvironmentsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
