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
import { ConfigurationComponent } from './configuration/configuration.component';
import { HeaderComponent } from './header/header.component';
import { EventComponent } from './configuration/event/event.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewScheduledEventComponent } from './configuration/event/new-scheduled-event/new-scheduled-event.component';
import { AtobPipe } from './atob.pipe';
import { ScenarioService } from './data/scenario.service';

export function tokenGetter() {
  return localStorage.getItem("hobbyfarm_admin_token");
}

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    HomeComponent,
    ConfigurationComponent,
    HeaderComponent,
    EventComponent,
    LoginComponent,
    NewScheduledEventComponent,
    AtobPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [environment.server],
        blacklistedRoutes: [environment.server + "/auth/authenticate"]
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
