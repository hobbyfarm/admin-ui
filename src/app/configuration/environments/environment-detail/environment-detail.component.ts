import { Component, OnInit, Input } from '@angular/core';
import { Environment } from 'src/app/data/environment';
import { EnvironmentService } from 'src/app/data/environment.service';

@Component({
  selector: 'environment-detail',
  templateUrl: './environment-detail.component.html',
  styleUrls: ['./environment-detail.component.scss']
})
export class EnvironmentDetailComponent implements OnInit {
  @Input() id: string;

  public loading: boolean;
  public currentEnvironment: Environment;

  constructor(public environmentService: EnvironmentService) {}

  ngOnInit() {
    this.loading = true;
    // Make the server call
    this.environmentService.get(this.id).subscribe((e: Environment) => {
      this.currentEnvironment = e;
      this.loading = false;
    });
  }
}
