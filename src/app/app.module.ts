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
  DlDateTimeDateModule,
  DlDateTimeInputModule,
  DlDateTimePickerModule,
} from 'angular-bootstrap-datetimepicker';
import { ScenarioComponent } from './scenario/scenario.component';
import { UserComponent } from './user/user/user.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EnvironmentsComponent } from './configuration/environments/environments.component';
import { EditEnvironmentComponent } from './configuration/environments/edit-environment/edit-environment.component';
import { ContentComponent } from './content/content.component';
import { CourseComponent } from './course/course.component';
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
import { ProgressCardComponent } from './progress/progress-card/progress-card.component';
import { ProgressListComponent } from './progress/progress-list/progress-list.component';
import { ProgressInfoComponent } from './progress/progress-info/progress-info.component';
import { EventUserListComponent } from './dashboards/progress-dashboard/event-user-list/event-user-list.component';
import { IntervalTimer } from './IntervalTimer/interval-timer.component';
import { ProgressDashboardComponent } from './dashboards/progress-dashboard/progress-dashboard.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { VmDashboardComponent } from './dashboards/vm-dashboard/vm-dashboard.component';
import { UsersDashboardComponent } from './dashboards/users-dashboard/users-dashboard.component';
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
import { DynamicHooksComponent, provideDynamicHooks } from 'ngx-dynamic-hooks';
import { CtrComponent } from './step/ctr-component/ctr.component';
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
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { SessionStatisticsComponent } from './session-statistics/session-statistics.component';
import { SessionTimeStatisticsComponent } from './session-statistics/session-time-statistics/session-time-statistics.component';
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
import { CourseWizardComponent } from './course/course-wizard/course-wizard.component';
import { CourseDetailsComponent } from './course/course-details/course-details.component';
import { ScenarioWizardComponent } from './scenario/scenario-wizard/scenario-wizard.component';
import { ScenarioDetailComponent } from './scenario/scenario-detail/scenario-detail.component';
import { StepsScenarioComponent } from './scenario/steps-scenario/steps-scenario.component';
import { DashboardDetailsComponent } from './dashboards/dashboard-details/dashboard-details.component';
import { TaskComponent } from './scenario/task/task.component';
import { TaskFormComponent } from './scenario/task-form/task-form.component';
import { SingleTaskVerificationMarkdownComponent } from './step/single-task-verification-markdown/single-task-verification-markdown.component';

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
  syncIcon,
  downloadIcon,
  plusCircleIcon,
  exclamationTriangleIcon,
} from '@cds/core/icon';
import { ReadonlyTaskComponent } from './scenario/task/readonly-task/readonly-task.component';
import { HiddenMdComponent } from './step/hidden-md-component/hidden-md.component';
import { GlossaryMdComponent } from './step/glossary-md-component/glossary-md.component';
import { MermaidMdComponent } from './step/mermaid-md-component/mermaid-md.component';
import { NoteMdComponent } from './step/note-md-component/note-md.component';
import { ThemeService } from './data/theme.service';
import { SafeSvgPipe } from './pipes/safe-svg.pipe';
import { TooltipDirective } from './directives/tooltip.directive';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AuthnService } from './data/authn.service';
import { SessionProgressService } from './progress/session-progress.service';
import { CostService } from './data/cost.service';
import { CostDashboardComponent } from './dashboards/cost-dashboard/cost-dashboard.component';
import { CostStatisticsComponent } from './cost-statistics/cost-dashboard.component';
import { MonthlyCostChartComponent } from './dashboards/cost-dashboard/monthly-cost-chart/monthly-cost-chart.component';

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
  numberListIcon,
  syncIcon,
  downloadIcon,
  plusCircleIcon,
  exclamationTriangleIcon,
);

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

export function jwtOptionsFactory(): JwtConfig {
  const allowedDomainsRegex = environment.server.match(/.*\:\/\/?([^\/]+)/);
  let allowedDomains: string[] | undefined;
  let disallowedRoutes: string[] | undefined;
  if (allowedDomainsRegex && allowedDomainsRegex.length > 1) {
    allowedDomains = [allowedDomainsRegex[1]];
    disallowedRoutes = [allowedDomainsRegex[1] + '/auth/authenticate'];
  }
  return {
    tokenGetter: () => {
      return localStorage.getItem('hobbyfarm_admin_token') ?? '';
    },
    allowedDomains: allowedDomains,
    disallowedRoutes: disallowedRoutes,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SessionStatisticsComponent,
    CostStatisticsComponent,
    SessionTimeStatisticsComponent,
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
    CourseDetailsComponent,
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
    ProgressCardComponent,
    ProgressListComponent,
    EventUserListComponent,
    IntervalTimer,
    ProgressDashboardComponent,
    DashboardsComponent,
    VmDashboardComponent,
    UsersDashboardComponent,
    CostDashboardComponent,
    MonthlyCostChartComponent,
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
    CourseWizardComponent,
    ScenarioWizardComponent,
    ScenarioDetailComponent,
    StepsScenarioComponent,
    DashboardDetailsComponent,
    TaskComponent,
    TaskFormComponent,
    ReadonlyTaskComponent,
    SingleTaskVerificationMarkdownComponent,
    GlossaryMdComponent,
    HiddenMdComponent,
    MermaidMdComponent,
    NoteMdComponent,
    SafeSvgPipe,
    TooltipDirective,
    TooltipComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSplitModule,
    DlDateTimeDateModule,
    DlDateTimeInputModule,
    DlDateTimePickerModule,
    ClarityModule,
    BaseChartDirective,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    BrowserAnimationsModule,
    DragulaModule.forRoot(),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    ScrollingModule,
    DynamicHooksComponent,
  ],
  providers: [
    AuthnService,
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
    SessionProgressService,
    PredefinedServiceService,
    ThemeService,
    TypedSettingsService,
    CostService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService, RbacService], // rbacservice listed here to initialize it before anything else
    },
    provideDynamicHooks({
      parsers: [
        { component: CtrComponent, unescapeStrings: false },
        { component: GlossaryMdComponent, unescapeStrings: false },
        { component: MermaidMdComponent, unescapeStrings: false },
        { component: HiddenMdComponent, unescapeStrings: false },
        { component: NoteMdComponent, unescapeStrings: false },
        {
          component: SingleTaskVerificationMarkdownComponent,
          unescapeStrings: false,
        },
      ],
      options: {
        sanitize: false,
        convertHTMLEntities: false,
      },
    }),
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
