import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudInitConfig } from 'src/app/data/cloud-init-config';
import { PredefinedServiceService } from 'src/app/data/predefinedservice.service';
import {
  getCloudConfigString,
  VMTemplateServiceConfiguration,
} from 'src/app/data/vm-template-service-configuration';

@Component({
  selector: 'app-vmtemplate-service-form',
  templateUrl: './vmtemplate-service-form.component.html',
  styleUrls: ['./vmtemplate-service-form.component.scss'],
})
export class VMTemplateServiceFormComponent implements OnInit {
  public predefinedInterfaces: VMTemplateServiceConfiguration[];

  @Input()
  public cloudConfig: CloudInitConfig;

  public selectedNewInterface: VMTemplateServiceConfiguration = undefined;
  public newVMServiceFormGroup: FormGroup;
  public editVMService: VMTemplateServiceConfiguration;

  //Open/Close Modals
  public editCloudConfigModalOpen: boolean = false;
  public selectVMServiceModalOpen: boolean = false;
  public newVMServiceModalOpen: boolean = false;

  private DEFAULT_PORT = 80;
  private DEFAULT_PATH = '/';

  constructor(private fb: FormBuilder, private pdsService: PredefinedServiceService) {}

  ngOnInit(): void {
    this.buildNewVMServiceDetails();
    this.pdsService.list().subscribe((vmtsc: VMTemplateServiceConfiguration[]) => {
      this.predefinedInterfaces = vmtsc;
    });
  }

  public buildNewVMServiceDetails(edit: boolean = false) {
    this.newVMServiceFormGroup = this.fb.group({
      name: [edit ? this.editVMService.name : ''],
      port: [
        edit ? this.editVMService.port ?? this.DEFAULT_PORT : this.DEFAULT_PORT,
      ],
      path: [
        edit ? this.editVMService.path ?? this.DEFAULT_PATH : this.DEFAULT_PATH,
      ],
      hasOwnTab: [edit ? this.editVMService.hasOwnTab : false],
      noPathRewriting: [edit ? this.editVMService.noRewriteRootPath : false],
      proxyHostHeaderRewriting: [
        edit ? this.editVMService.rewriteHostHeader : true,
      ],
      proxyOriginHeaderRewriting: [
        edit ? this.editVMService.rewriteOriginHeader : false,
      ],
      disallowIFrame: [
        edit ? this.editVMService.disallowIFrame : true,
      ],
      cloudConfigString: [edit ? getCloudConfigString(this.editVMService) : ''],
      hasWebinterface: [edit ? this.editVMService.hasWebinterface : false],
    });
  }

  openCloudInitSelect() {
    this.selectVMServiceModalOpen = true;
  }

  openNewVMServiceModal() {
    this.buildNewVMServiceDetails();
    this.newVMServiceModalOpen = true;
  }

  newVMServiceClose() {
    let newVMService: VMTemplateServiceConfiguration =
      new VMTemplateServiceConfiguration();
    newVMService.name = this.newVMServiceFormGroup.get('name').value;
    newVMService.hasWebinterface =
      this.newVMServiceFormGroup.get('hasWebinterface').value;
    newVMService.port = this.newVMServiceFormGroup.get('port').value;
    newVMService.path = this.newVMServiceFormGroup.get('path').value;
    newVMService.hasOwnTab = this.newVMServiceFormGroup.get('hasOwnTab').value;
    newVMService.noRewriteRootPath =
      this.newVMServiceFormGroup.get('noPathRewriting').value;
    newVMService.rewriteHostHeader = this.newVMServiceFormGroup.get(
      'proxyHostHeaderRewriting'
    ).value;
    newVMService.rewriteOriginHeader = this.newVMServiceFormGroup.get(
      'proxyOriginHeaderRewriting'
    ).value;
    newVMService.disallowIFrame = this.newVMServiceFormGroup.get(
      'disallowIFrame'
    ).value;
    newVMService.cloudConfigString =
      this.newVMServiceFormGroup.get('cloudConfigString').value;
    newVMService.cloudConfigMap = this.cloudConfig.buildMapFromString(
      newVMService.cloudConfigString
    );
    this.cloudConfig.addVMService(newVMService);
    this.buildNewVMServiceDetails();
    this.newVMServiceModalOpen = false;
  }

  selectModalClose() {
    this.selectedNewInterface.cloudConfigMap =
      this.cloudConfig.buildMapFromString(
        this.selectedNewInterface.cloudConfigString
      );
    this.cloudConfig.addVMService(this.selectedNewInterface);
    this.selectedNewInterface = undefined;
    this.selectVMServiceModalOpen = false;
  }

  editVMServiceClicked(editVMService: VMTemplateServiceConfiguration) {
    this.editVMService = editVMService;
    this.buildNewVMServiceDetails(true);
    this.newVMServiceModalOpen = true;
  }
}