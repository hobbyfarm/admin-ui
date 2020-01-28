import { Component, OnInit, ViewChild, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ClrWizard } from '@clr/angular';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Environment } from 'src/app/data/environment';
import { EnvironmentService } from 'src/app/data/environment.service';
import { ServerResponse } from 'src/app/data/serverresponse';

@Component({
  selector: 'edit-environment-wizard',
  templateUrl: './edit-environment.component.html',
  styleUrls: ['./edit-environment.component.scss']
})
export class EditEnvironmentComponent implements OnInit, OnChanges {
  public environmentDetails: FormGroup;
  public environmentSpecifics: FormGroup;
  public templateMappings: FormGroup;
  public ipMapping: FormGroup;

  @Input()
  public updateEnv: Environment;

  @Output()
  public event: EventEmitter<boolean> = new EventEmitter(false);

  public env: Environment = new Environment();

  constructor(
    private _fb: FormBuilder,
    private envService: EnvironmentService
  ) { }


  @ViewChild("wizard", { static: true }) wizard: ClrWizard;

  public buildEnvironmentDetails(edit: boolean = false) {
    this.environmentDetails = this._fb.group({
      display_name: [edit ? this.updateEnv.display_name : '', [Validators.required, Validators.minLength(4)]],
      dnssuffix: [edit ? this.updateEnv.dnssuffix : ''],
      provider: [edit ? this.updateEnv.provider : '', [Validators.required, Validators.minLength(2)]],
      ws_endpoint: [edit ? this.updateEnv.ws_endpoint : '', [Validators.required, Validators.pattern(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/)]],
      capacity_mode: [edit ? this.updateEnv.capacity_mode : '', Validators.required],
      burst_capable: [edit ? this.updateEnv.burst_capable : true]
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

  public prepareEnvironmentSpecifics() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment 
    var envKeys = Object.keys(this.updateEnv.environment_specifics);
    this.environmentSpecifics = this._fb.group({
      params: this._fb.array([])
    });
    for (var i = 0; i < envKeys.length; i++) {
      this.newEnvironmentSpecific(envKeys[i], this.updateEnv.environment_specifics[envKeys[i]]);
    }
  }

  public prepareTemplateMapping() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment
    var templateKeys = Object.keys(this.updateEnv.template_mapping);
    this.templateMappings = this._fb.group({
      templates: this._fb.array([])
    })

    for (var i = 0; i < templateKeys.length; i++) {
      var newGroup = this._fb.group({
        template: [templateKeys[i], Validators.required],
        params: this._fb.array([])
      });
      var paramKeys = Object.keys(this.updateEnv.template_mapping[templateKeys[i]]);
      for (var j = 0; j < paramKeys.length; j++) {
        var newParam = this._fb.group({
          key: [paramKeys[j], Validators.required],
          value: [this.updateEnv.template_mapping[templateKeys[i]][paramKeys[j]], Validators.required] // yuck
        });
        (newGroup.get('params') as FormArray).push(newParam);
      }
      (this.templateMappings.get('templates') as FormArray).push(newGroup);
    }
  }

  public prepareIpMapping() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment
    var ipKeys = Object.keys(this.updateEnv.ip_translation_map);
    this.ipMapping = this._fb.group({
      mappings: this._fb.array([])
    });
    for (var i = 0; i < ipKeys.length; i++) {
      this.newIpMapping(ipKeys[i], this.updateEnv.ip_translation_map[ipKeys[i]]);
    }
  }

  ngOnChanges() {
    if (this.updateEnv) {
      this._prepare();
    }
  }

  ngOnInit() {
    this._build();
  }

  private _build() {
    this.buildEnvironmentDetails();
    this.buildEnvironmentSpecifics();
    this.buildIpMapping();
    this.buildTemplateMapping();
  }

  private _prepare() {
    this.buildEnvironmentDetails(true);
    this.prepareEnvironmentSpecifics();
    this.prepareIpMapping();
    this.prepareTemplateMapping();
  }

  public open() {
    this.env = new Environment();
    this._build();
    this.wizard.reset();
    if (this.updateEnv) {
      this._prepare();
    }
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

  public newIpMapping(from: string = '', to: string = '') {
    var newGroup = this._fb.group({
      from: [from, Validators.required],
      to: [to, Validators.required]
    });
    (this.ipMapping.get('mappings') as FormArray).push(newGroup);
  }

  public deleteIpMapping(mappingIndex: number) {
    (this.ipMapping.get('mappings') as FormArray).removeAt(mappingIndex);
  }

  public copyIpMapping() {
    this.env.ip_translation_map = {};
    for (var i = 0; i < (this.ipMapping.get('mappings') as FormArray).length; i++) {
      var from = (this.ipMapping.get(['mappings', i]) as FormGroup).get('from').value;
      var to = (this.ipMapping.get(['mappings', i]) as FormGroup).get('to').value;
      this.env.ip_translation_map[from] = to;
    }
  }

  public newEnvironmentSpecific(key: string = '', value: string = '') {
    var newGroup = this._fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required]
    });
    (this.environmentSpecifics.get('params') as FormArray).push(newGroup);
  }

  public deleteEnvironmentSpecific(index: number) {
    (this.environmentSpecifics.get('params') as FormArray).removeAt(index);
  }

  public copyEnvironmentSpecifics() {
    // replace existing kv map
    this.env.environment_specifics = {};
    for (var i = 0; i < (this.environmentSpecifics.get('params') as FormArray).length; i++) {
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
    for (var i = 0; i < (this.templateMappings.get('templates') as FormArray).length; i++) { // i = index of template
      var template = this.templateMappings.get(['templates', i, 'template']).value;
      var templateMap = {};
      for (var j = 0; j < (this.templateMappings.get(['templates', i, 'params']) as FormArray).length; j++) { // j = index of param
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
    if (this.updateEnv) {
      this.env.name = this.updateEnv.name;
      this.envService.update(this.env)
        .subscribe(
          (s: ServerResponse) => {
            this.event.next(true);
          }
        )
    } else {
      this.envService.add(this.env)
        .subscribe(
          (s: ServerResponse) => {
            this.event.next(true);
          }
        )
    }
  }
}
