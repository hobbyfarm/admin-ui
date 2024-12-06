import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { DEFAULT_ALERT_WARNING_DURATION } from 'src/app/alert/alert';
import { AlertComponent } from 'src/app/alert/alert.component';
import { CloudInitConfig } from 'src/app/data/cloud-init-config';
import { PredefinedServiceService } from 'src/app/data/predefinedservice.service';
import { Protocol } from 'src/app/data/protocol';
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
  predefinedInterfaces: VMTemplateServiceConfiguration[];

  @Input()
  cloudConfig: CloudInitConfig;

  public selectedNewInterface?: VMTemplateServiceConfiguration;
  public newVMServiceFormGroup: FormGroup<{
    name: FormControl<string>;
    port: FormControl<number>;
    path: FormControl<string>;
    protocol: FormControl<Protocol>;
    hasOwnTab: FormControl<boolean>;
    noPathRewriting: FormControl<boolean>;
    proxyHostHeaderRewriting: FormControl<boolean>;
    proxyOriginHeaderRewriting: FormControl<boolean>;
    disallowIFrame: FormControl<boolean>;
    disableAuthorizationHeader: FormControl<boolean>;
    cloudConfigString: FormControl<string>;
    hasWebinterface: FormControl<boolean>;
  }>;
  public editVMService: VMTemplateServiceConfiguration | null;
  public dragServices: VMTemplateServiceConfiguration[] = [];

  //Open/Close Modals
  public editCloudConfigModalOpen: boolean = false;
  public selectVMServiceModalOpen: boolean = false;
  public newVMServiceModalOpen: boolean = false;

  private DEFAULT_PORT = 80;
  private DEFAULT_PATH = '/';

  @ViewChild('alert') alert: AlertComponent;

  constructor(
    private fb: NonNullableFormBuilder,
    private pdsService: PredefinedServiceService,
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
      this.dragServices.map((service) => [service.name, service]),
    );
    this.cloudConfig.vmServices = newOrderedMap;
    this.cloudConfig.buildNewYAMLFile();
  }

  public buildNewVMServiceDetails(
    vmSvcConfig: VMTemplateServiceConfiguration | null = null,
  ) {
    this.newVMServiceFormGroup = this.fb.group({
      name: this.fb.control<string>(vmSvcConfig ? vmSvcConfig.name : ''),
      port: this.fb.control<number>(
        vmSvcConfig
          ? (vmSvcConfig.port ?? this.DEFAULT_PORT)
          : this.DEFAULT_PORT,
      ),
      path: this.fb.control<string>(
        vmSvcConfig
          ? (vmSvcConfig.path ?? this.DEFAULT_PATH)
          : this.DEFAULT_PATH,
      ),
      protocol: this.fb.control<Protocol>(
        vmSvcConfig ? (vmSvcConfig.protocol ?? 'http') : 'http',
      ),
      hasOwnTab: this.fb.control<boolean>(
        vmSvcConfig ? (vmSvcConfig.hasOwnTab ?? false) : false,
      ),
      noPathRewriting: this.fb.control<boolean>(
        vmSvcConfig ? (vmSvcConfig.noRewriteRootPath ?? false) : false,
      ),
      proxyHostHeaderRewriting: this.fb.control<boolean>(
        vmSvcConfig ? (vmSvcConfig.rewriteHostHeader ?? true) : true,
      ),
      proxyOriginHeaderRewriting: this.fb.control<boolean>(
        vmSvcConfig ? (vmSvcConfig.rewriteOriginHeader ?? false) : false,
      ),
      disallowIFrame: this.fb.control<boolean>(
        vmSvcConfig ? (vmSvcConfig.disallowIFrame ?? true) : true,
      ),
      disableAuthorizationHeader: this.fb.control<boolean>(
        vmSvcConfig ? (vmSvcConfig.disableAuthorizationHeader ?? true) : true,
      ),
      cloudConfigString: this.fb.control<string>(
        vmSvcConfig ? getCloudConfigString(vmSvcConfig) : '',
      ),
      hasWebinterface: this.fb.control<boolean>(
        vmSvcConfig ? vmSvcConfig.hasWebinterface : false,
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
    newVMService.protocol = this.newVMServiceFormGroup.controls.protocol.value;
    newVMService.hasOwnTab =
      this.newVMServiceFormGroup.controls.hasOwnTab.value;
    newVMService.noRewriteRootPath =
      this.newVMServiceFormGroup.controls.noPathRewriting.value;
    newVMService.rewriteHostHeader =
      this.newVMServiceFormGroup.controls.proxyHostHeaderRewriting.value;
    newVMService.rewriteOriginHeader =
      this.newVMServiceFormGroup.controls.proxyOriginHeaderRewriting.value;
    newVMService.disableAuthorizationHeader =
      this.newVMServiceFormGroup.controls.disableAuthorizationHeader.value;
    newVMService.disallowIFrame =
      this.newVMServiceFormGroup.controls.disallowIFrame.value;
    newVMService.cloudConfigString =
      this.newVMServiceFormGroup.controls.cloudConfigString.value;
    newVMService.cloudConfigMap = this.cloudConfig.buildMapFromString(
      newVMService.cloudConfigString,
    );
    this.cloudConfig.addVMService(newVMService);
    this.buildNewVMServiceDetails();
    this.newVMServiceModalOpen = false;
    this.editVMService = null;
  }

  selectModalClose() {
    if (
      !this.selectedNewInterface ||
      !this.selectedNewInterface.cloudConfigString
    ) {
      const alertMsg =
        'Please select a valid predefined service or press "cancel"';
      this.alert.warning(alertMsg, true, DEFAULT_ALERT_WARNING_DURATION);
      return;
    }
    this.selectedNewInterface.cloudConfigMap =
      this.cloudConfig.buildMapFromString(
        this.selectedNewInterface.cloudConfigString,
      );
    this.cloudConfig.addVMService(this.selectedNewInterface);
    this.selectedNewInterface = undefined;
    this.selectVMServiceModalOpen = false;
  }

  editVMServiceClicked(editVMService: VMTemplateServiceConfiguration) {
    this.editVMService = editVMService;
    this.buildNewVMServiceDetails(editVMService);
    this.newVMServiceModalOpen = true;
  }
}
