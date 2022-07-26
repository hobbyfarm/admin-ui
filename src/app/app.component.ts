import { Component } from '@angular/core';
import { ClarityIcons } from '@clr/icons';
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
        ClarityIcons.add({
          "logo": obj
        })
      })
  }

}
