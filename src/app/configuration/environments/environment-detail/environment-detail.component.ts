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
  public stackBoxExpanded: boolean[] = [];
  public templateMappingsExpanded: boolean = false;
  public currentEnvironment: Environment;

  constructor(public environmentService: EnvironmentService) {}

  ngOnInit() {
    this.loading = true;
    // Make the server call
    this.environmentService.get(this.id).subscribe((e: Environment) => {
      // initialize two-way binding variables for stack block state
      const templateMappingsCount: number = Object.keys(e.template_mapping).length;
      for(let i = 0; i < templateMappingsCount; ++i) {
        this.stackBoxExpanded.push(false);
      }

      this.currentEnvironment = e;
      this.loading = false;
    });
  }

  expandAll(event: Event) {
    event.stopPropagation();
    this.templateMappingsExpanded = true;
    for(let i = 0; i < this.stackBoxExpanded.length; ++i) {
      this.stackBoxExpanded[i] = true;
    }
  }

  collapseAll(event: Event) {
    event.stopPropagation();
    this.templateMappingsExpanded = false;
    for(let i = 0; i < this.stackBoxExpanded.length; ++i) {
      this.stackBoxExpanded[i] = false;
    }
  }

  isEmpty(object: Object) {
    return Object.keys(object).length == 0;
  }
}
