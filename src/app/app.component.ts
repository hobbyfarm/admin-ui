import { Component, OnDestroy, OnInit } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons } from '@cds/core/icon';
import { Router } from '@angular/router';
import { AppConfigService } from './app-config.service';
import { Subscription } from 'rxjs';
import { ThemeService } from './data/theme.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {
  private config = this.configService.getConfig();
  private logo = this.config.logo || '/assets/default/logo.svg';
  private themeSubscription: Subscription;

  constructor(
    private router: Router,
    private configService: AppConfigService,
    private themeService: ThemeService
  ) {}
  ngOnInit(): void {
    this.configService.getLogo(this.logo).then((obj: string) => {
      ClarityIcons.addIcons(['logo', obj]);
    });
    this.themeSubscription = this.themeService.listenToThemeChanges();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
