import { Component } from '@angular/core';
import { ClarityIcons } from '@clr/icons';
import { Router } from '@angular/router';
import { AppConfigService } from './app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private config = this.configService.getConfig();
  public favicon = this.config.favicon || "/assets/default/favicon.png";
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

    if (this.config.favicon) {
      var fi = <HTMLLinkElement>document.querySelector("#favicon")
      fi.href = this.config.favicon;
    }
  }

}
