import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './root/root.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { EventComponent } from './event/event.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewScheduledEventComponent } from './event/new-scheduled-event/new-scheduled-event.component';
import { AtobPipe } from './atob.pipe';
import { ScenarioService } from './data/scenario.service';
import { DlDateTimePickerDateModule, DlDateTimePickerModule} from 'angular-bootstrap-datetimepicker';
import { ScenarioComponent } from './scenario/scenario.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { UserComponent } from './user/user/user.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EnvironmentsComponent } from './configuration/environments/environments.component';
import { EditEnvironmentComponent } from './configuration/environments/edit-environment/edit-environment.component';

export function tokenGetter() {
  return localStorage.getItem("hobbyfarm_admin_token");
}

export function jwtOptionsFactory() {
  return {
    tokenGetter: tokenGetter,
    whitelistedDomains: [
      environment.server.replace(/(^\w+:|^)\/\//, ''),
    ],
    blacklistedRoutes: [
      environment.server.replace(/(^\w+:|^)\/\//, '') + "/auth/authenticate"
    ],
    skipWhenExpired: true
  }
}


@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    HomeComponent,
    HeaderComponent,
    EventComponent,
    LoginComponent,
    NewScheduledEventComponent,
    AtobPipe,
    ScenarioComponent,
    UserComponent,
    ConfigurationComponent,
    EnvironmentsComponent,
    EditEnvironmentComponent
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
    BrowserAnimationsModule
  ],
  providers: [
    ScenarioService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
