import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridSortOrder } from '@clr/angular';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';
import { EditVmtemplateComponent } from './edit-vmtemplate/edit-vmtemplate.component';

@Component({
  selector: 'app-vmtemplates',
  templateUrl: './vmtemplates.component.html',
  styleUrls: ['./vmtemplates.component.scss']
})
export class VmtemplatesComponent implements OnInit {
  public templates: VMTemplate[] = [];
  public editTemplate: VMTemplate;
  public deleteTemplate: VMTemplate;
  public ascSort = ClrDatagridSortOrder.ASC;

  constructor(
    public vmTemplateService: VmtemplateService
  ) { }

  @ViewChild("editTemplateWizard") editWizard: EditVmtemplateComponent;
  @ViewChild("deleteConfirmation") deleteConfirmation: DeleteConfirmationComponent;

  ngOnInit(): void {
    this.refresh();
  }

  public refresh() {
    this.vmTemplateService.list()
    .subscribe(
      (vm: VMTemplate[]) => this.templates = vm
    )
  }

  public openEdit(index: number) {
    this.editTemplate = this.templates[index];
    this.editWizard.open();
  }

  public openNew() {
    this.editTemplate = undefined;
    this.editWizard.open();
  }

  public openDelete(index:  number) {
    this.deleteTemplate = this.templates[index];
    this.deleteConfirmation.open();
  }
  
  public doDelete() {
    this.vmTemplateService.delete(this.deleteTemplate.id)
    .subscribe(
      ()
    )
  }
}
