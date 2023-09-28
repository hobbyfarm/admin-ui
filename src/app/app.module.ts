import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  SecurityContext,
  APP_INITIALIZER,
} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { EventComponent } from './event/event.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS, JwtConfig } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewScheduledEventComponent } from './event/new-scheduled-event/new-scheduled-event.component';
import { ScenarioService } from './data/scenario.service';
import {
  DlDateTimePickerDateModule,
  DlDateTimePickerModule,
} from 'angular-bootstrap-datetimepicker';
import { ScenarioComponent } from './scenario/scenario.component';
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
import { EventUserListComponent } from './dashboards/progress-dashboard/event-user-list/event-user-list.component';
import { IntervalTimer } from './IntervalTimer/interval-timer.component';
import { ProgressDashboardComponent } from './dashboards/progress-dashboard/progress-dashboard.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { VmDashboardComponent } from './dashboards/vm-dashboard/vm-dashboard.component';
import { StepComponent } from './step/step-component/step.component';
import { CtrService } from './data/ctr.service';
import { SessionService } from './data/session.service';
import { GargantuaClientFactory } from './data/gargantua.service';
import { StepService } from './data/step.service';
import { SettingsService } from './data/settings.service';
import { VMService } from './step/vm.service';
import { VMClaimService } from './data/vmclaim.service';
import { HfMarkdownComponent } from './step/hf-markdown.component';
import { AngularSplitModule } from 'angular-split';
import { DynamicHooksModule } from 'ngx-dynamic-hooks';
import { CtrComponent } from './step/ctr.component';
import { TerminalComponent } from './step/terminal/terminal.component';
import { ProgressService } from './data/progress.service';
import { PredefinedServiceService } from './data/predefinedservice.service';
import { RbacService } from './data/rbac.service';
import { RbacDirective } from './directives/rbac.directive';
import { ClarityDisableSelectionDirective } from './directives/clarity-disable-selection.directive';
import { RolesComponent } from './configuration/roles/roles/roles.component';
import { EditRuleComponent } from './configuration/roles/edit-rule/edit-rule.component';
import { NewRoleComponent } from './configuration/roles/new-role/new-role.component';
import { RuleFormComponent } from './configuration/roles/rule-form/rule-form.component';
import { RolebindingsComponent } from './user/rolebindings/rolebindings.component';
import { NewRoleBindingComponent } from './user/new-role-binding/new-role-binding.component';
import { DeleteProcessModalComponent } from './user/user/delete-process-modal/delete-process-modal.component';
import { EnvironmentDetailComponent } from './configuration/environments/environment-detail/environment-detail.component';
import { VmTemplateDetailComponent } from './configuration/vmtemplates/vmtemplate-detail/vmtemplate-detail.component';
import { NgChartsModule } from 'ng2-charts';
import { SessionStatisticsComponent } from './session-statistics/session-statistics.component';
import { VMTemplateServiceFormComponent } from './configuration/vmtemplates/edit-vmtemplate/vmtemplate-service-form/vmtemplate-service-form.component';
import { FilterScenariosComponent } from './filter-scenarios/filter-scenarios.component';
import { MDEditorComponent } from './scenario/md-editor/md-editor.component';
import { CodeWithSyntaxHighlightingComponent } from './configuration/code-with-syntax-highlighting/code-with-syntax-highlighting.component';
import { ResizableTextAreaDirective } from './directives/resizable-text-area.directive';
import { TypedFormComponent } from './typed-form/typed-form.component';
import { SettingsComponent } from './configuration/settings/settings.component';
import { TypedInputComponent } from './typed-form/typed-input.component';
import { TypedInputFieldComponent } from './typed-form/typed-input-field.component';
import { TypedSettingsService } from './data/typedSettings.service';
import { OTACManagementComponent } from './event/otacmanagement/otacmanagement.component';
import { TypedMapStringComponent } from './typed-form/typed-map-string.component';
import { TypedMapNumberComponent } from './typed-form/typed-map-number.component';
import { TypedMapBooleanComponent } from './typed-form/typed-map-boolean.component';
import { TypedArrayStringComponent } from './typed-form/typed-array-string.component';
import { TypedArrayNumberComponent } from './typed-form/typed-array-number.component';
import { TypedArrayBooleanComponent } from './typed-form/typed-array-boolean.component';
import '@cds/core/icon/register.js';
import {
  ClarityIcons,
  plusIcon,
  trashIcon,
  angleIcon,
  nodeIcon,
  nodeGroupIcon,
  infoCircleIcon,
  boltIcon,
  dragHandleIcon,
  checkIcon,
  filterIcon,
  exclamationCircleIcon,
  successStandardIcon,
  errorStandardIcon,
  hostIcon,
  arrowIcon,
  popOutIcon,
  boldIcon,
  italicIcon,
  blockQuoteIcon,
  linkIcon,
  imageIcon,
  noteIcon,
  detailsIcon,
  codeIcon,
  treeViewIcon,
  playIcon,
  importIcon,
  userIcon,
  layersIcon,
  usersIcon,
  rackServerIcon,
  childArrowIcon,
  clockIcon,
  timesIcon,
  buildingIcon,
  numberListIcon,
} from '@cds/core/icon';

ClarityIcons.addIcons(
  plusIcon,
  trashIcon,
  angleIcon,
  nodeIcon,
  nodeGroupIcon,
  infoCircleIcon,
  boltIcon,
  dragHandleIcon,
  checkIcon,
  filterIcon,
  exclamationCircleIcon,
  successStandardIcon,
  errorStandardIcon,
  hostIcon,
  arrowIcon,
  popOutIcon,
  boldIcon,
  italicIcon,
  blockQuoteIcon,
  linkIcon,
  imageIcon,
  noteIcon,
  detailsIcon,
  codeIcon,
  treeViewIcon,
  playIcon,
  importIcon,
  userIcon,
  layersIcon,
  usersIcon,
  rackServerIcon,
  childArrowIcon,
  clockIcon,
  timesIcon,
  buildingIcon,
  numberListIcon
);

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

export function jwtOptionsFactory(): JwtConfig {
  return {
    tokenGetter: () => {
      return localStorage.getItem('hobbyfarm_admin_token');
    },
    allowedDomains: [environment.server.match(/.*\:\/\/?([^\/]+)/)[1]],
    disallowedRoutes: [
      environment.server.match(/.*\:\/\/?([^\/]+)/)[1] + '/auth/authenticate',
    ],
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SessionStatisticsComponent,
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
    DeleteProcessModalComponent,
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
    ProgressDashboardComponent,
    DashboardsComponent,
    VmDashboardComponent,
    StepComponent,
    HfMarkdownComponent,
    TerminalComponent,
    CtrComponent,
    RbacDirective,
    ClarityDisableSelectionDirective,
    RolesComponent,
    EditRuleComponent,
    NewRoleComponent,
    RuleFormComponent,
    RolebindingsComponent,
    NewRoleBindingComponent,
    EnvironmentDetailComponent,
    VmTemplateDetailComponent,
    MDEditorComponent,
    VMTemplateServiceFormComponent,
    FilterScenariosComponent,
    CodeWithSyntaxHighlightingComponent,
    ResizableTextAreaDirective,
    TypedFormComponent,
    TypedInputComponent,
    TypedInputFieldComponent,
    SettingsComponent,
    OTACManagementComponent,
    TypedMapStringComponent,
    TypedMapNumberComponent,
    TypedMapBooleanComponent,
    TypedArrayStringComponent,
    TypedArrayNumberComponent,
    TypedArrayBooleanComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSplitModule,
    DlDateTimePickerDateModule,
    DlDateTimePickerModule,
    ClarityModule,
    NgChartsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    DynamicHooksModule.forRoot({
      globalOptions: {
        sanitize: false,
        convertHTMLEntities: false,
      },
      globalParsers: [{ component: CtrComponent }],
    }),
    BrowserAnimationsModule,
    DragulaModule.forRoot(),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
  ],
  providers: [
    ScenarioService,
    CtrService,
    SessionService,
    StepService,
    VMService,
    VMClaimService,
    SettingsService,
    GargantuaClientFactory,
    AppConfigService,
    ProgressService,
    PredefinedServiceService,
    TypedSettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService, RbacService], // rbacservice listed here to initialize it before anything else
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
