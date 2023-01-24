import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defer, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CloudInitConfig } from 'src/app/data/cloud-init-config';
import { Webinterface } from 'src/app/data/webinterface';

@Component({
  selector: 'app-webinterface-form',
  templateUrl: './webinterface-form.component.html',
  styleUrls: ['./webinterface-form.component.scss']
})
export class WebinterfaceFormComponent implements OnInit {

  public predefinedInterfaces: Webinterface[] = PredefinedWebInterfaces //Placeholder until managed in Backend

  @Input()
  public cloudConfig: CloudInitConfig;  

  
  public selectedNewInterface: Webinterface = undefined;  
  public newWebinterfaceFormGroup: FormGroup;
  public editWebinterface: Webinterface;

  //Open/Close Modals
  public editCloudConfigModalOpen: boolean = false
  public selectWebinterfaceModalOpen: boolean = false
  public newWebinterfaceModalOpen: boolean = false

  // form = this.fb.group({
  //   webinterfaces: this.fb.array([])
  // });

  // @Input()
  // set initialWebinterfaces(data: Map<string, Webinterface>) {
  //   this.form.patchValue({
  //     webinterfaces: data
  //   });
  // }

  // @Output()
  // formReady = of(this.form)

  // @Output()
  // valueChange = defer(() =>
  //   this.form.valueChanges.pipe(
  //     startWith(this.form.value),
  //     map(
  //       (formValue): Partial<Webinterface> => ({ //MAYBE?
  //         // TODO: formValue.TODO,
  //         // TODO2: formValue.TODO2,
  //       })
  //     )
  //   )
  // );

  constructor(
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
  }

  public buildNewWebinterfaceDetails(edit: boolean = false) {
    this.newWebinterfaceFormGroup = this.fb.group({
      name: [edit ? this.editWebinterface.name :  '' ],
      port: [edit ? this.editWebinterface.port :  undefined ],
      hasOwnTab: [edit ? this.editWebinterface.hasOwnTab :  false ],
      cloudConfigString: [edit ? this.editWebinterface.cloudConfigString :  '' ]
    })
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