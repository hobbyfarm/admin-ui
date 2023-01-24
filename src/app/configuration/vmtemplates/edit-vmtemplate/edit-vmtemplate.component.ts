import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { ObservedValueOf } from 'rxjs';
import { AlertComponent } from 'src/app/alert/alert.component';
import { CloudInitConfig } from 'src/app/data/cloud-init-config';
import { ServerResponse } from 'src/app/data/serverresponse';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { Webinterface } from 'src/app/data/webinterface';
import { WebinterfaceFormComponent } from './webinterface-form/webinterface-form.component';

@Component({
  selector: 'edit-vmtemplate-wizard',
  templateUrl: './edit-vmtemplate.component.html',
})
export class EditVmtemplateComponent implements OnInit, OnChanges {
  public templateDetails: FormGroup;
  public configMap: FormGroup;
  public buttonsDisabled: boolean = false;
  // public cloudConfigData: string = '';
  private cloudConfigKey: string = 'cloud-config'
  private webinterfaceKey: string = 'webinterfaces'


  //Moved
  // public webinterfaces: Map<string, Webinterface> = new Map() 
  public predefinedInterfaces: Webinterface[] = PredefinedWebInterfaces
  public selectedNewInterface: Webinterface = undefined;
  public cloudConfig: CloudInitConfig = new CloudInitConfig();  
  public newWebinterfaceFormGroup: FormGroup;
  public editWebinterface: Webinterface;
  public editCloudConfigModalOpen: boolean = false

  @Input()
  public editTemplate: VMTemplate;  

  @Output()
  public event: EventEmitter<boolean> = new EventEmitter(false);

  public template: VMTemplate = new VMTemplate();
  public selectWebinterfaceModalOpen: boolean = false
  public newWebinterfaceModalOpen: boolean = false


  constructor(
    private _fb: FormBuilder,
    private vmTemplateService: VmtemplateService
  ) { }

  ngOnInit(): void {
    this._build();
  }

  @ViewChild("wizard", {static: true}) wizard: ClrWizard;
  @ViewChild("alert") alert: AlertComponent;

  // form = this._fb.group({
  //   // Form is empty for now -> child form groups will be added dynamically
  // });

  // addChildForm<K extends keyof EditVmTemplateForm>(
  //   name: K,
  //   group: Exclude<EditVmTemplateForm[K], undefined>
  // ) {
  //   this.form.setControl(name, group);
  // }

  public open() {
    this.template = new VMTemplate();
    this.buttonsDisabled = false;
    this._build();
    this.wizard.reset();
    if (this.editTemplate) {
      this._prepare();
    }
    this.wizard.open();
  }

  private _build() {
    this.buildConfigMap();
    this.buildTemplateDetails();
    this.buildNewWebinterfaceDetails()
  }

  public buildNewWebinterfaceDetails(edit: boolean = false) {
    this.newWebinterfaceFormGroup = this._fb.group({
      name: [edit ? this.editWebinterface.name :  '' ],
      port: [edit ? this.editWebinterface.port :  undefined ],
      hasOwnTab: [edit ? this.editWebinterface.hasOwnTab :  false ],
      cloudConfigString: [edit ? this.editWebinterface.cloudConfigString :  '' ]
    })
  }

  public buildTemplateDetails(edit: boolean = false) {
    this.templateDetails = null;
    this.templateDetails = this._fb.group({
      name:     [edit ? this.editTemplate.name :              '', [Validators.required, Validators.minLength(4)]],
      image:    [edit ? this.editTemplate.image :             '', [Validators.required]],
      cpu:      [edit ? this.editTemplate.resources.cpu :      0 ],
      memory:   [edit ? this.editTemplate.resources.memory :   0 ],
      storage:  [edit ? this.editTemplate.resources.storage :  0 ]
    })
  }

  public buildConfigMap() {
    this.configMap = this._fb.group({
      mappings: this._fb.array([
        this._fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required]
        })
      ])
    })
  }

  public prepareConfigMap() {
    // differs from buildConfigMap() in that we are copying existing values
    // into the form
    let configKeys = Object.keys(this.editTemplate.config_map).filter(elem => elem !== this.cloudConfigKey && elem != this.webinterfaceKey)
    this.cloudConfig.webinterfaces = JSON.parse(this.editTemplate.config_map[this.webinterfaceKey], reviver)  ?? new Map()
    this.cloudConfig.buildNewYAMLFile()
    this.configMap = this._fb.group({
      mappings: this._fb.array([])
    });

    for (var i = 0; i < configKeys.length; i++) {
      this.newConfigMapping(configKeys[i], this.editTemplate.config_map[configKeys[i]]);
    }
  }

  public fixNullValues() {
    if (this.editTemplate.config_map == null) {
      this.editTemplate.config_map = {};
    }
  }

  public newConfigMapping(key: string = '', value: string = '') {
    var newGroup = this._fb.group({
      key:    [key, Validators.required],
      value:  [value, Validators.required]
    });
    (this.configMap.get('mappings') as FormArray).push(newGroup)
  }

  public deleteConfigMapping(mappingIndex: number) {
    (this.configMap.get('mappings') as FormArray).removeAt(mappingIndex);
  }

  public copyTemplateDetails() {
    this.template.name = this.templateDetails.get('name').value;
    this.template.image = this.templateDetails.get('image').value;
    this.template.resources = {cpu: 0, memory: 0, storage: 0};
    this.template.resources.cpu = this.templateDetails.get('cpu').value;
    this.template.resources.memory = this.templateDetails.get('memory').value;
    this.template.resources.storage = this.templateDetails.get('storage').value;
  }

  public copyConfigMap() {
    this.template.config_map = {};
    for (var i = 0; i < (this.configMap.get('mappings') as FormArray).length; i++) {
      var key = (this.configMap.get(['mappings', i]) as FormGroup).get('key').value;
      var value = (this.configMap.get(['mappings', i]) as FormGroup).get('value').value
      this.template.config_map[key] = value;
    }
    this.template.config_map[this.cloudConfigKey] = this.cloudConfig.cloudConfigYaml;
    // console.log(JSON.stringify([...this.cloudConfig.webinterfaces])) //TODO: Remove and add write operation back in
    let winterfces = this.cloudConfig.getWebinterfacesWithoutConfigMap()    
    this.template.config_map[this.webinterfaceKey] = JSON.stringify(winterfces, replacer)
  }
  public copyTemplate() {
    this.copyConfigMap();
    this.copyTemplateDetails();
  }

  public saveTemplate() {
    this.buttonsDisabled = true;
    if (this.editTemplate) {
      this.template.id = this.editTemplate.id;
      this.vmTemplateService.update(this.template)
      .subscribe(
        (s: ServerResponse) => {
          this.alert.success("VM Template saved", false, 1000)
          this.event.next(true);
          setTimeout(() => this.wizard.close(), 1000);
        },
        (e: HttpErrorResponse) => {
          this.alert.danger("Error saving VM Template: " + e.error.message, false, 3000);
          this.buttonsDisabled = false;
        }
      )
    } else {
      this.vmTemplateService.create(this.template)
      .subscribe(
        (s: ServerResponse) => {
          this.alert.success("VM Template saved", false, 1000)
          this.event.next(true);
          setTimeout(() => this.wizard.close(), 1000);
        },
        (e: HttpErrorResponse) => {
          this.alert.danger("Error saving VM Template: " + e.error.message, false, 3000);
          this.buttonsDisabled = false;
        }
      )
    }
  }

  private _prepare() {
    this.buildTemplateDetails(true);
    this.prepareConfigMap();
  }

  ngOnChanges() {
    if (this.editTemplate) {
      this.fixNullValues();
      this._prepare();
    } else {
      this.buildTemplateDetails();
      this.buildConfigMap();
    }
  }

  generateCloudConfig() {     
    // config.buildConfigFromText(this.cloudConfigData)
    console.log("As Map: ",this.cloudConfig)
    console.log("As String: ", this.cloudConfig.getConfigAsString())
  }


  openCloudInitSelect() {
    this.selectWebinterfaceModalOpen = true
  }

  openNewWebinterfaceModal() {
    this.buildNewWebinterfaceDetails()
    this.newWebinterfaceModalOpen = true
  }

  newWebinterfaceClose() {
    this.editWebinterface = new Webinterface()
    let newWebinterface: Webinterface = new Webinterface()
    newWebinterface.name = this.newWebinterfaceFormGroup.get('name').value;
    newWebinterface.port = this.newWebinterfaceFormGroup.get('port').value;
    newWebinterface.hasOwnTab = this.newWebinterfaceFormGroup.get('hasOwnTab').value;
    newWebinterface.cloudConfigString = this.newWebinterfaceFormGroup.get('cloudConfigString').value;
    newWebinterface.cloudConfigMap = this.cloudConfig.buildMapFromString(newWebinterface.cloudConfigString)    
    this.cloudConfig.addWebinterface(newWebinterface)    
    this.buildNewWebinterfaceDetails()
    this.newWebinterfaceModalOpen = false
  }

  selectModalClose() {
    this.cloudConfig.addWebinterface(this.selectedNewInterface)
    this.selectedNewInterface = undefined
    this.selectWebinterfaceModalOpen = false
  }

  editWebinterfaceClicked(editwebinterface: Webinterface) {
    this.editWebinterface = editwebinterface;
    this.buildNewWebinterfaceDetails(true)
    this.newWebinterfaceModalOpen = true
  }

  editCloudConfig() {
    this.cloudConfig.webinterfaces.forEach(element => {
      element.cloudConfigMap = this.cloudConfig.buildMapFromString(element.cloudConfigString)
      this.cloudConfig.addWebinterface(element)
    })
    // this.cloudConfigData = this.cloudConfig.buildNewYAMLFile()
    this.editCloudConfigModalOpen = true
  }

  
  DEBUG() {
    console.log(this.cloudConfig)
    console.log(JSON.stringify([...this.cloudConfig.webinterfaces]))
    // this.webinterfaces.forEach(element => console.log(JSON.stringify(Object.fromEntries(element))))
  }
}


export const PredefinedWebInterfaces: Webinterface[] = //This has to be modeled into a CRD and retrieved over the Backend
  [
    {name: "VS Code IDE", port: 8080, hasOwnTab: true, cloudConfigMap: new Map(), cloudConfigString: 
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
    {name: "Some other WebService", port: 8081, hasOwnTab: false, cloudConfigMap: new Map(), cloudConfigString: 
    `#cloud-config
    runcmd:
        - install some other Webservice
    otherCommand:
        - configure via cloud init
    ` 
  }
  ]


  function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }