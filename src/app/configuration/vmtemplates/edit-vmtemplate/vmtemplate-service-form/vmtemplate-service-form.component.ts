import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudInitConfig } from 'src/app/data/cloud-init-config';
import { VMTemplateServiceConfiguration } from 'src/app/data/vm-template-service-configuration';

@Component({
  selector: 'app-vmtemplate-service-form',
  templateUrl: './vmtemplate-service-form.component.html',
  styleUrls: ['./vmtemplate-service-form.component.scss']
})
export class VMTemplateServiceFormComponent implements OnInit {
  public predefinedInterfaces: VMTemplateServiceConfiguration[] = PredefinedWebInterfaces //Placeholder until managed in Backend

  @Input()
  public cloudConfig: CloudInitConfig;


  public selectedNewInterface: VMTemplateServiceConfiguration = undefined;
  public newVMServiceFormGroup: FormGroup;
  public editVMService: VMTemplateServiceConfiguration;

  //Open/Close Modals
  public editCloudConfigModalOpen: boolean = false
  public selectVMServiceModalOpen: boolean = false
  public newVMServiceModalOpen: boolean = false

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildNewVMServiceDetails()
  }

  public buildNewVMServiceDetails(edit: boolean = false) {
    this.newVMServiceFormGroup = this.fb.group({
      name: [edit ? this.editVMService.name : ''],
      port: [edit ? this.editVMService.port : undefined],
      hasOwnTab: [edit ? this.editVMService.hasOwnTab : false],
      cloudConfigString: [edit ? this.editVMService.cloudConfigString : ''],
      hasWebinterface: [edit ? this.editVMService.hasWebinterface : false]
    })
  }


  openCloudInitSelect() {
    this.selectVMServiceModalOpen = true
  }

  openNewVMServiceModal() {
    this.buildNewVMServiceDetails()
    this.newVMServiceModalOpen = true
  }


  newVMServiceClose() {   
      let newVMService: VMTemplateServiceConfiguration = new VMTemplateServiceConfiguration()
      newVMService.name = this.newVMServiceFormGroup.get('name').value;
      newVMService.hasWebinterface = this.newVMServiceFormGroup.get('hasWebinterface').value;
      newVMService.port = this.newVMServiceFormGroup.get('port').value;
      newVMService.hasOwnTab = this.newVMServiceFormGroup.get('hasOwnTab').value;
      newVMService.cloudConfigString = this.newVMServiceFormGroup.get('cloudConfigString').value;
      newVMService.cloudConfigMap = this.cloudConfig.buildMapFromString(newVMService.cloudConfigString)
      this.cloudConfig.addVMService(newVMService)
      this.buildNewVMServiceDetails()
      this.newVMServiceModalOpen = false
  }

  selectModalClose() {
    this.selectedNewInterface.cloudConfigMap = this.cloudConfig.buildMapFromString(this.selectedNewInterface.cloudConfigString)
    this.cloudConfig.addVMService(this.selectedNewInterface)
    this.selectedNewInterface = undefined
    this.selectVMServiceModalOpen = false
  }

  editVMServiceClicked(editVMService: VMTemplateServiceConfiguration) {
    this.editVMService = editVMService;
    this.buildNewVMServiceDetails(true)
    this.newVMServiceModalOpen = true
  }

}


export const PredefinedWebInterfaces: VMTemplateServiceConfiguration[] = //This has to be modeled into a CRD and retrieved over the Backend
  [
    {
      name: "VS Code IDE", port: 8080, hasOwnTab: true, cloudConfigMap: new Map(), hasWebinterface: true,
      cloudConfigString:
        `#cloud-config
    runcmd:
        - export HOME=/root
        - curl -fsSL https://code-server.dev/install.sh > codeServerInstall.sh
        - /bin/sh codeServerInstall.sh && systemctl enable --now code-server@root
        - |
          sleep 5 && sed -i.bak 's/auth: password/auth: none/' ~/.config/code-server/config.yaml
        - sudo systemctl restart code-server@root
    `
    },
    {
      name: "Test-Service without Webinterface", cloudConfigMap: new Map(), hasWebinterface: false,
      cloudConfigString:
        `#cloud-config
    runcmd:
        - touch /root/test.txt
    `
    },
    {
      name: "Test-Interface without Cloud Config", port: 8081, hasOwnTab: false, hasWebinterface: true,
      
    }
  ]