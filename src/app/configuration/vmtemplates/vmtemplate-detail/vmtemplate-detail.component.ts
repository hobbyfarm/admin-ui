import { Component, OnInit, Input } from '@angular/core';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';

@Component({
  selector: 'vmtemplate-detail',
  templateUrl: './vmtemplate-detail.component.html',
  styleUrls: ['./vmtemplate-detail.component.scss']
})
export class VmTemplateDetailComponent implements OnInit {
  @Input() id: string;

  public loading: boolean;
  public currentVmTemplate: VMTemplate;

  constructor(public vmTemplateService: VmtemplateService) {}

  ngOnInit() {
    this.loading = true;
    // Make the server call
    this.vmTemplateService.get(this.id).subscribe((t: VMTemplate) => {
      this.currentVmTemplate = t;
      this.loading = false;
    });
  }
}
