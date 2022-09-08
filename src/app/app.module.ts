import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, SecurityContext, APP_INITIALIZER } from '@angular/core';
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { EventComponent } from './event/event.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewScheduledEventComponent } from './event/new-scheduled-event/new-scheduled-event.component';
import { ScenarioService } from './data/scenario.service';
import { DlDateTimePickerDateModule, DlDateTimePickerModule} from 'angular-bootstrap-datetimepicker';
import { ScenarioComponent } from './scenario/scenario.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { UserComponent } from './user/user/user.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EnvironmentsComponent } from './configuration/environments/environments.component';
import { EditEnvironmentComponent } from './configuration/environments/edit-environment/edit-environment.component';
import { ContentComponent } from './content/content.component';
import { CourseComponent } from './course/course.component';
import { NewCourseComponent } from './course/new-course/new-course.component';
import { CourseFormComponent } from './course/course-form/course-form.component';
import { DragulaModule } from 'ng2-dragula';
import { AddScenarioComponent } from './course/add-scenario/add-scenario.component';
import { VmsetComponent } from './vmset/vmset.component';
import { NewVmComponent } from './vmset/new-vm/new-vm.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { EventStatusFilterComponent } from './event/event-status-filter/event-status-filter.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { EditAccessCodesComponent } from './user/edit-access-codes/edit-access-codes.component';
import { PrintableComponent } from './printable/printable.component';
import { MarkdownModule } from 'ngx-markdown';
import { AlertComponent } from './alert/alert.component';
import { VmtemplatesComponent } from './configuration/vmtemplates/vmtemplates.component';
import { EditVmtemplateComponent } from './configuration/vmtemplates/edit-vmtemplate/edit-vmtemplate.component';
import { AppConfigService } from './app-config.service';
import { ProgressComponent } from './progress/progress.component';
import { ProgressInfoComponent } from './progress/progress-info/progress-info.component';
import { EventUserListComponent } from './home/event-user-list/event-user-list.component';
import { IntervalTimer } from './IntervalTimer/interval-timer.component';
import { RbacService } from './data/rbac.service';
import { RbacDirective } from './directives/rbac.directive';
import { ClarityDisableSelectionDirective } from './directives/clarity-disable-selection.directive';
import { RolesComponent } from './configuration/roles/roles/roles.component';
import { EditRuleComponent } from './configuration/roles/edit-rule/edit-rule.component';
import { NewRoleComponent } from './configuration/roles/new-role/new-role.component';
import { RuleFormComponent } from './configuration/roles/rule-form/rule-form.component';
import { RolebindingsComponent } from './user/rolebindings/rolebindings.component';
import { NewRoleBindingComponent } from './user/new-role-binding/new-role-binding.component';

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem("hobbyfarm_admin_token");
    },
    whitelistedDomains: [
      environment.server.match(/.*\:\/\/?([^\/]+)/)[1]
    ],
    blacklistedRoutes: [
      environment.server.match(/.*\:\/\/?([^\/]+)/)[1] + "/auth/authenticate"
    ]
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    EventComponent,
    LoginComponent,
    NewScheduledEventComponent,
    ScenarioComponent,
    UserComponent,
    ConfigurationComponent,
    EnvironmentsComponent,
    EditEnvironmentComponent,
    ContentComponent,
    CourseComponent,
    NewCourseComponent,
    CourseFormComponent,
    AddScenarioComponent,
    VmsetComponent,
    NewVmComponent,
    DeleteConfirmationComponent,
    EventStatusFilterComponent,
    EditUserComponent,
    EditAccessCodesComponent,
    AlertComponent,
    PrintableComponent,
    VmtemplatesComponent,
    EditVmtemplateComponent,
    ProgressInfoComponent,
    ProgressComponent,
    EventUserListComponent,
    IntervalTimer,
    RbacDirective,
    ClarityDisableSelectionDirective,
    RolesComponent,
    EditRuleComponent,
    NewRoleComponent,
    RuleFormComponent,
    RolebindingsComponent,
    NewRoleBindingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DlDateTimePickerDateModule,
    LMarkdownEditorModule,
    DlDateTimePickerModule,
    ClarityModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),
    BrowserAnimationsModule,
    DragulaModule.forRoot(),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    })
  ],
  providers: [
    ScenarioService,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService, RbacService] // rbacservice listed here to initialize it before anything else
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
