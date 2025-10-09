import { Component, OnInit, Input } from '@angular/core';
import { VMTemplateServiceConfiguration } from 'src/app/data/vm-template-service-configuration';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';

@Component({
  selector: 'vmtemplate-detail',
  templateUrl: './vmtemplate-detail.component.html',
  styleUrls: ['./vmtemplate-detail.component.scss'],
})
export class VmTemplateDetailComponent implements OnInit {
  @Input() id: string;

  public loading: boolean;
  public currentVmTemplate: VMTemplate;
  public cloudConfigData: string = '';

  configMap: Record<string, string> = {};
  webinterfaces: VMTemplateServiceConfiguration[] = [];

  constructor(public vmTemplateService: VmtemplateService) {}

  ngOnInit() {
    this.loading = true;
    this.vmTemplateService.get(this.id).subscribe((t: VMTemplate) => {
      this.currentVmTemplate = t;
      this.cloudConfigData = this.currentVmTemplate.config_map['cloud-config']
        ? this.currentVmTemplate.config_map['cloud-config']
        : 'No Cloud Config defined';
      const raw = this.currentVmTemplate.config_map['webinterfaces']
        ? (JSON.parse(this.currentVmTemplate.config_map['webinterfaces']) as
            | VMTemplateServiceConfiguration[]
            | Record<string, VMTemplateServiceConfiguration>)
        : [];

      this.webinterfaces = Array.isArray(raw) ? raw : Object.values(raw);

      delete this.currentVmTemplate.config_map['webinterfaces'];
      delete this.currentVmTemplate.config_map['cloud-config'];
      this.configMap = this.currentVmTemplate.config_map;
      this.loading = false;
    });
  }

  isEmpty(object: Record<string, unknown>): boolean {
    return Object.keys(object).length === 0;
  }
}
