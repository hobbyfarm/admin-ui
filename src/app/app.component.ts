import { Component } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons } from '@cds/core/icon';
import { Router } from '@angular/router';
import { AppConfigService } from './app-config.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {

  private config = this.configService.getConfig();
  public logo = this.config.logo || '/assets/default/logo.svg';

  constructor(
    public router: Router,
    public configService: AppConfigService
  ) {
    this.configService.getLogo(this.logo)
      .then((obj: string) => {
        ClarityIcons.addIcons(['logo', obj]);
      })
  }

}
