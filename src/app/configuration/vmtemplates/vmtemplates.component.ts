import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridSortOrder } from '@clr/angular';
import { AlertComponent } from 'src/app/alert/alert.component';
import { RbacService } from 'src/app/data/rbac.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';
import { EditVmtemplateComponent } from './edit-vmtemplate/edit-vmtemplate.component';

@Component({
  selector: 'app-vmtemplates',
  templateUrl: './vmtemplates.component.html',
})
export class VmtemplatesComponent implements OnInit {
  public templates: VMTemplate[] = [];
  public editTemplate: VMTemplate | null;
  public deleteTemplate: VMTemplate;
  public ascSort = ClrDatagridSortOrder.ASC;
  public showActionOverflow: boolean = false;

  constructor(
    public vmTemplateService: VmtemplateService,
    public rbacService: RbacService
  ) {}

  @ViewChild('editTemplateWizard') editWizard: EditVmtemplateComponent;
  @ViewChild('deleteConfirmation')
  deleteConfirmation: DeleteConfirmationComponent;
  @ViewChild('alert') alert: AlertComponent;

  ngOnInit(): void {
    const authorizationRequests = Promise.all([
      this.rbacService.Grants('virtualmachinetemplates', 'get'),
      this.rbacService.Grants('virtualmachinetemplates', 'update'),
      this.rbacService.Grants('virtualmachinetemplates', 'delete'),
    ]);

    authorizationRequests.then((permissions: [boolean, boolean, boolean]) => {
      const allowGet: boolean = permissions[0];
      const allowUpdate: boolean = permissions[1];
      const allowDelete: boolean = permissions[2];
      this.showActionOverflow = allowDelete || (allowGet && allowUpdate);
    });
    this.refresh();
  }

  public refresh() {
    this.vmTemplateService
      .list()
      .subscribe((vm: VMTemplate[]) => (this.templates = vm));
  }

  public openEdit(partialTemplate: VMTemplate) {
    // "t" is only a partial VMTemplate, we need to get the full
    this.vmTemplateService
      .get(partialTemplate.id)
      .subscribe((t: VMTemplate) => {
        this.editTemplate = t;
        this.editWizard.open();
      });
  }

  public openNew() {
    this.editTemplate = null;
    this.editWizard.open();
  }

  public openDelete(t: VMTemplate) {
    this.deleteTemplate = t;
    this.deleteConfirmation.open();
  }

  public doDelete() {
    this.vmTemplateService.delete(this.deleteTemplate.id).subscribe({
      next: (s: ServerResponse) => {
        this.alert.success('Deleted virtual machine template', false, 1000);
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
        this.alert.danger(
          'Error deleting virtual machine template: ' + e.error.message,
          false,
          3000
        );
      },
    });
  }
}
