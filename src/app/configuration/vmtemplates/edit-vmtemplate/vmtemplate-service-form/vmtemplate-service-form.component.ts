import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { CloudInitConfig } from 'src/app/data/cloud-init-config';
import { PredefinedServiceService } from 'src/app/data/predefinedservice.service';
import {
  getCloudConfigString,
  VMTemplateServiceConfiguration,
} from 'src/app/data/vm-template-service-configuration';
import * as uuid from 'uuid';

@Component({
  selector: 'app-vmtemplate-service-form',
  templateUrl: './vmtemplate-service-form.component.html',
  styleUrls: ['./vmtemplate-service-form.component.scss'],
})
export class VMTemplateServiceFormComponent implements OnInit {
  public predefinedInterfaces: VMTemplateServiceConfiguration[];

  @Input()
  cloudConfig: CloudInitConfig;

  public selectedNewInterface: VMTemplateServiceConfiguration = undefined;
  public newVMServiceFormGroup: FormGroup<{
    name: FormControl<string>;
    port: FormControl<number>;
    path: FormControl<string>;
    hasOwnTab: FormControl<boolean>;
    noPathRewriting: FormControl<boolean>;
    proxyHostHeaderRewriting: FormControl<boolean>;
    proxyOriginHeaderRewriting: FormControl<boolean>;
    disallowIFrame: FormControl<boolean>;
    cloudConfigString: FormControl<string>;
    hasWebinterface: FormControl<boolean>;
  }>;
  public editVMService: VMTemplateServiceConfiguration;
  public dragServices = [];

  //Open/Close Modals
  public editCloudConfigModalOpen: boolean = false;
  public selectVMServiceModalOpen: boolean = false;
  public newVMServiceModalOpen: boolean = false;

  private DEFAULT_PORT = 80;
  private DEFAULT_PATH = '/';

  constructor(
    private fb: NonNullableFormBuilder,
    private pdsService: PredefinedServiceService
  ) {}

  ngOnInit(): void {
    this.buildNewVMServiceDetails();
    this.pdsService
      .list()
      .subscribe((vmtsc: VMTemplateServiceConfiguration[]) => {
        this.predefinedInterfaces = vmtsc;
      });
  }

  ngDoCheck() {
    const newServices = Array.from(this.cloudConfig.vmServices.values());
    if (
      //Check if the Input cloudConfig changed, since basic Changedetection (ngOnChanges()) only works for primitive Datatypes
      !(
        this.dragServices.length === newServices.length &&
        newServices.every((elem) => this.dragServices.includes(elem))
      )
    ) {
      this.dragServices = Array.from(this.cloudConfig.vmServices.values());
    }
  }

  changeOrder(event: VMTemplateServiceConfiguration[]) {
    this.dragServices = event;
    const newOrderedMap = new Map(
      this.dragServices.map((service) => [service.name, service])
    );
    this.cloudConfig.vmServices = newOrderedMap;
    this.cloudConfig.buildNewYAMLFile();
  }

  public buildNewVMServiceDetails(edit: boolean = false) {
    this.newVMServiceFormGroup = this.fb.group({
      name: this.fb.control<string>(edit ? this.editVMService.name : ''),
      port: this.fb.control<number>(
        edit ? this.editVMService.port ?? this.DEFAULT_PORT : this.DEFAULT_PORT
      ),
      path: this.fb.control<string>(
        edit ? this.editVMService.path ?? this.DEFAULT_PATH : this.DEFAULT_PATH
      ),
      hasOwnTab: this.fb.control<boolean>(
        edit ? this.editVMService.hasOwnTab : false
      ),
      noPathRewriting: this.fb.control<boolean>(
        edit ? this.editVMService.noRewriteRootPath : false
      ),
      proxyHostHeaderRewriting: this.fb.control<boolean>(
        edit ? this.editVMService.rewriteHostHeader : true
      ),
      proxyOriginHeaderRewriting: this.fb.control<boolean>(
        edit ? this.editVMService.rewriteOriginHeader : false
      ),
      disallowIFrame: this.fb.control<boolean>(
        edit ? this.editVMService.disallowIFrame : true
      ),
      cloudConfigString: this.fb.control<string>(
        edit ? getCloudConfigString(this.editVMService) : ''
      ),
      hasWebinterface: this.fb.control<boolean>(
        edit ? this.editVMService.hasWebinterface : false
      ),
    });
  }

  openCloudInitSelect() {
    this.selectVMServiceModalOpen = true;
  }

  openNewVMServiceModal() {
    this.editVMService = null;
    this.buildNewVMServiceDetails();
    this.newVMServiceModalOpen = true;
  }

  newVMServiceClose() {
    let newVMService: VMTemplateServiceConfiguration =
      new VMTemplateServiceConfiguration();
    newVMService.id = this.editVMService?.id ?? uuid.v4();
    newVMService.name = this.newVMServiceFormGroup.controls.name.value;
    newVMService.hasWebinterface =
      this.newVMServiceFormGroup.controls.hasWebinterface.value;
    newVMService.port = this.newVMServiceFormGroup.controls.port.value;
    newVMService.path = this.newVMServiceFormGroup.controls.path.value;
    newVMService.hasOwnTab =
      this.newVMServiceFormGroup.controls.hasOwnTab.value;
    newVMService.noRewriteRootPath =
      this.newVMServiceFormGroup.controls.noPathRewriting.value;
    newVMService.rewriteHostHeader =
      this.newVMServiceFormGroup.controls.proxyHostHeaderRewriting.value;
    newVMService.rewriteOriginHeader =
      this.newVMServiceFormGroup.controls.proxyOriginHeaderRewriting.value;
    newVMService.disallowIFrame =
      this.newVMServiceFormGroup.controls.disallowIFrame.value;
    newVMService.cloudConfigString =
      this.newVMServiceFormGroup.controls.cloudConfigString.value;
    newVMService.cloudConfigMap = this.cloudConfig.buildMapFromString(
      newVMService.cloudConfigString
    );
    this.cloudConfig.addVMService(newVMService);
    this.buildNewVMServiceDetails();
    this.newVMServiceModalOpen = false;
    this.editVMService = null;
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
