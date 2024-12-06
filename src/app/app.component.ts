import { Component, OnDestroy, OnInit } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons } from '@cds/core/icon';
import { AppConfigService } from './app-config.service';
import {
  distinctUntilChanged,
  filter,
  map,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ThemeService } from './data/theme.service';
import { AuthnService } from './data/authn.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {
  private config = this.configService.getConfig();
  private logo = this.config.logo || '/assets/default/logo.svg';
  private themeHandler: Subscription;
  private currentTheme?: 'system' | 'dark' | 'light';

  constructor(
    private configService: AppConfigService,
    private themeService: ThemeService,
    private authenticationService: AuthnService,
  ) {}
  ngOnInit(): void {
    this.configService.getLogo(this.logo).then((obj: string) => {
      ClarityIcons.addIcons(['logo', obj]);
    });
    this.themeHandler = this.authenticationService.isLoggedIn$
      .pipe(
        distinctUntilChanged(), // Only trigger the subscription on login status change
        map((isLoggedIn) => {
          if (!isLoggedIn && !this.currentTheme) {
            return 'applySystemTheme';
          } else if (isLoggedIn) {
            return 'updateTheme';
          } else {
            return 'noop';
          }
        }),
        filter(
          (status: 'applySystemTheme' | 'updateTheme' | 'noop') =>
            status !== 'noop',
        ),
        switchMap((status) => {
          if (status == 'applySystemTheme') {
            return this.themeService.enableSystemThemeListener(
              this.themeService.applySystemTheme(),
            );
          } else {
            return this.themeService
              .listenToThemeChanges()
              .pipe(tap((theme) => (this.currentTheme = theme)));
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.themeHandler.unsubscribe();
  }
}
