import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Environment } from 'src/app/data/environment';
import { EnvironmentService } from 'src/app/data/environment.service';
import { ServerResponse } from 'src/app/data/serverresponse';

@Component({
  selector: 'new-environment-wizard',
  templateUrl: './new-environment.component.html',
  styleUrls: ['./new-environment.component.scss']
})
export class NewEnvironmentComponent implements OnInit {
  public environmentDetails: FormGroup;
  public environmentSpecifics: FormGroup;
  public templateMappings: FormGroup;
  public ipMapping: FormGroup;
  
  public env: Environment = new Environment();

  constructor(
    private _fb: FormBuilder,
    private envService: EnvironmentService
  ) { }


  @ViewChild("wizard", { static: true }) wizard: ClrWizard;

  public buildEnvironmentDetails() {
    this.environmentDetails = this._fb.group({
      display_name: ['', [Validators.required, Validators.minLength(4)]],
      dnssuffix: [''],
      provider: ['', [Validators.required, Validators.minLength(2)]],
      ws_endpoint: ['', [Validators.required, Validators.pattern(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/)]],
      capacity_mode: ['', Validators.required],
      burst_capable: [true]
    });
  }

  public buildEnvironmentSpecifics() {
    this.environmentSpecifics = this._fb.group({
      params: this._fb.array([
        this._fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required]
        })
      ])
    });
  }

  public buildIpMapping() {
    this.ipMapping = this._fb.group({
      mappings: this._fb.array([
        this._fb.group({
          from: ['', Validators.required],
          to: ['', Validators.required]
        })
      ])
    });
  }

  public buildTemplateMapping() {
    this.templateMappings = this._fb.group({
      templates: this._fb.array([
        this._fb.group({
          template: ['', Validators.required],
          params: this._fb.array([
            this._fb.group({
              key: ['', Validators.required],
              value: ['', Validators.required]
            })
          ])
        })
      ])
    });
  }

  ngOnInit() {
    this.buildEnvironmentDetails();
    this.buildEnvironmentSpecifics();
    this.buildIpMapping();
    this.buildTemplateMapping();
  }

  public open() {
    this.env = new Environment();
    this.buildEnvironmentDetails();
    this.buildEnvironmentSpecifics();
    this.buildIpMapping();
    this.buildTemplateMapping();
    this.wizard.reset();
    this.wizard.open();
  }

  public copyEnvironmentDetails() {
    this.env.display_name = this.environmentDetails.get('display_name').value;
    this.env.dnssuffix = this.environmentDetails.get('dnssuffix').value;
    this.env.provider = this.environmentDetails.get('provider').value;
    this.env.ws_endpoint = this.environmentDetails.get('ws_endpoint').value;
    this.env.capacity_mode = this.environmentDetails.get('capacity_mode').value;
    this.env.burst_capable = (this.environmentDetails.get('burst_capable').value as boolean);
  }

  public newIpMapping() {
    var newGroup = this._fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required]
    });
    (this.ipMapping.get('mappings') as FormArray).push(newGroup);
  }

  public deleteIpMapping(mappingIndex: number) {
    (this.ipMapping.get('mappings') as FormArray).removeAt(mappingIndex);
  }

  public copyIpMapping() {
    this.env.ip_translation_map = {};
    for(var i = 0; i < (this.ipMapping.get('mappings') as FormArray).length; i++) {
      var from = (this.ipMapping.get(['mappings', i]) as FormGroup).get('from').value;
      var to = (this.ipMapping.get(['mappings', i]) as FormGroup).get('to').value;
      this.env.ip_translation_map[from] = to;
    }
  }

  public newEnvironmentSpecific() {
    var newGroup = this._fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    (this.environmentSpecifics.get('params') as FormArray).push(newGroup);
  }

  public deleteEnvironmentSpecific(index: number) {
    (this.environmentSpecifics.get('params') as FormArray).removeAt(index);
  }

  public copyEnvironmentSpecifics() {
    // replace existing kv map
    this.env.environment_specifics = {};
    for(var i = 0; i < (this.environmentSpecifics.get('params') as FormArray).length; i++) {
      var key = (this.environmentSpecifics.get(['params', i]) as FormGroup).get('key').value;
      var value = (this.environmentSpecifics.get(['params', i]) as FormGroup).get('value').value;
      this.env.environment_specifics[key] = value;
    }
  }

  public newTemplateMapping() {
    var newGroup = this._fb.group({
      template: ['', Validators.required],
      params: this._fb.array([
        this._fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required]
        })
      ])
    });
    (this.templateMappings.get('templates') as FormArray).push(newGroup);
  }

  public deleteTemplateMapping(index: number) {
    (this.templateMappings.get('templates') as FormArray).removeAt(index);
  }

  public copyTemplateMapping() {
    this.env.template_mapping = {};
    // naïve solution, using nested for loop. gross, but gets the job done.
    for(var i = 0; i < (this.templateMappings.get('templates') as FormArray).length; i++) { // i = index of template
      var template = this.templateMappings.get(['templates', i, 'template']).value;
      var templateMap = {};
      for(var j = 0; j < (this.templateMappings.get(['templates', i, 'params']) as FormArray).length; j++) { // j = index of param
        var key = this.templateMappings.get(['templates', i, 'params', j]).get('key').value;
        var value = this.templateMappings.get(['templates', i, 'params', j]).get('value').value;
        templateMap[key] = value;
      }
      this.env.template_mapping[template] = templateMap;
    }
  }

  public newTemplateParameter(templateIndex: number) {
    var newParam = this._fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    ((this.templateMappings.get('templates') as FormArray).at(templateIndex).get('params') as FormArray).push(newParam);
  }

  public deleteTemplateParameter(templateIndex: number, parameterIndex: number) {
    ((this.templateMappings.get("templates") as FormArray).at(templateIndex).get("params") as FormArray).removeAt(parameterIndex);
  }

  public saveEnvironment() {
    console.log("saving ", this.env);
    this.envService.add(this.env)
    .subscribe(
      (s: ServerResponse) => {
        console.log(s);
      }
    )
  }
}
