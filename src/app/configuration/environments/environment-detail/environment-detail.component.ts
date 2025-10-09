import { Component, OnInit, Input } from '@angular/core';
import { Environment } from 'src/app/data/environment';
import { EnvironmentService } from 'src/app/data/environment.service';
import { RbacService } from 'src/app/data/rbac.service';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';

@Component({
  selector: 'environment-detail',
  templateUrl: './environment-detail.component.html',
  styleUrls: ['./environment-detail.component.scss'],
})
export class EnvironmentDetailComponent implements OnInit {
  @Input() id: string;

  public loading: boolean;
  public stackBoxExpanded: boolean[] = [];
  public templateMappingsExpanded: boolean = false;
  public currentEnvironment: Environment;

  public virtualMachineTemplateList: Map<string, string> = new Map();

  constructor(
    public environmentService: EnvironmentService,
    public rbacService: RbacService,
    public vmTemplateService: VmtemplateService,
  ) {
    this.rbacService
      .Grants('virtualmachinetemplates', 'list')
      .then((allowVMTemplateList: boolean) => {
        if (!allowVMTemplateList) {
          return;
        }
        vmTemplateService
          .list()
          .subscribe((list: VMTemplate[]) =>
            list.forEach((v) =>
              this.virtualMachineTemplateList.set(v.id, v.name),
            ),
          );
      });
  }

  ngOnInit() {
    this.loading = true;
    // Make the server call
    this.environmentService.get(this.id).subscribe((e: Environment) => {
      // initialize two-way binding variables for stack block state
      const templateMappingsCount: number = Object.keys(
        e.template_mapping,
      ).length;
      for (let i = 0; i < templateMappingsCount; ++i) {
        this.stackBoxExpanded.push(false);
      }

      this.currentEnvironment = e;
      this.loading = false;
    });
  }

  expandAll(event: Event) {
    event.stopPropagation();
    this.templateMappingsExpanded = true;
    for (let i = 0; i < this.stackBoxExpanded.length; ++i) {
      this.stackBoxExpanded[i] = true;
    }
  }

  collapseAll(event: Event) {
    event.stopPropagation();
    this.templateMappingsExpanded = false;
    for (let i = 0; i < this.stackBoxExpanded.length; ++i) {
      this.stackBoxExpanded[i] = false;
    }
  }

  isEmpty(object: Record<string, unknown>): boolean {
    return Object.keys(object).length === 0;
  }

  getLimit(vmt: string) {
    if (!this.currentEnvironment.count_capacity) {
      return 0;
    }
    return this.currentEnvironment.count_capacity[vmt] ?? 0;
  }

  getVirtualMachineTemplateName(template: unknown): string {
    const key = String(template ?? '');
    return this.virtualMachineTemplateList.get(key) ?? key;
  }
}
