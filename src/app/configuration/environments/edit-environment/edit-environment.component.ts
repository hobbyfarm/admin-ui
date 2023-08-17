import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ClrWizard } from '@clr/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Environment } from 'src/app/data/environment';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { EnvironmentService } from 'src/app/data/environment.service';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { RbacService } from 'src/app/data/rbac.service';

@Component({
  selector: 'edit-environment-wizard',
  templateUrl: './edit-environment.component.html',
  styleUrls: ['./edit-environment.component.scss'],
})
export class EditEnvironmentComponent implements OnInit, OnChanges {
  public environmentDetails: FormGroup;
  public environmentSpecifics: FormGroup;
  public templateMappings: FormGroup;
  public templateSelection: FormGroup;
  public ipMapping: FormGroup;
  public VMTemplates: VMTemplate[] = [];

  @Input()
  public updateEnv: Environment;

  @Output()
  public event: EventEmitter<boolean> = new EventEmitter(false);

  public env: Environment = new Environment();
  public virtualMachineTemplateList: Map<string, string> = new Map();

  constructor(
    private _fb: FormBuilder,
    private envService: EnvironmentService,
    private vmTemplateService: VmtemplateService,
    private rbacService: RbacService
  ) {
    this.rbacService
      .Grants('virtualmachinetemplates', 'list')
      .then((allowVMTemplateList: boolean) => {
        if (!allowVMTemplateList) {
          console.log('Disallow');
          return;
        }
        vmTemplateService
          .list()
          .subscribe((list: VMTemplate[]) =>
            list.forEach((v) =>
              this.virtualMachineTemplateList.set(v.id, v.name)
            )
          );
      });
  }

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;

  public buildEnvironmentDetails(edit: boolean = false) {
    this.environmentDetails = this._fb.group({
      display_name: [
        edit ? this.updateEnv.display_name : '',
        [Validators.required, Validators.minLength(4)],
      ],
      dnssuffix: [edit ? this.updateEnv.dnssuffix : ''],
      provider: [
        edit ? this.updateEnv.provider : '',
        [Validators.required, Validators.minLength(2)],
      ],
      ws_endpoint: [
        edit ? this.updateEnv.ws_endpoint : '',
        [
          Validators.required,
          Validators.pattern(
            /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
          ),
        ],
      ],
    });
  }

  public buildEnvironmentSpecifics() {
    this.environmentSpecifics = this._fb.group({
      params: this._fb.array([
        this._fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required],
        }),
      ]),
    });
  }

  public buildVMTSelection() {
    this.templateSelection = this._fb.group({
      vmt_select: ['', [Validators.required]],
    });
  }

  public buildIpMapping() {
    this.ipMapping = this._fb.group({
      mappings: this._fb.array([
        this._fb.group({
          from: ['', Validators.required],
          to: ['', Validators.required],
        }),
      ]),
    });
  }

  public buildTemplateMapping() {
    this.templateMappings = this._fb.group({
      templates: this._fb.array([]),
    });
  }

  public prepareEnvironmentSpecifics() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment
    var envKeys = Object.keys(this.updateEnv.environment_specifics);
    this.environmentSpecifics = this._fb.group({
      params: this._fb.array([]),
    });
    for (var i = 0; i < envKeys.length; i++) {
      this.newEnvironmentSpecific(
        envKeys[i],
        this.updateEnv.environment_specifics[envKeys[i]]
      );
    }
  }

  public prepareTemplateMapping() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment
    var templateKeys = Object.keys(this.updateEnv.template_mapping);
    this.templateMappings = this._fb.group({
      templates: this._fb.array([]),
    });

    for (var i = 0; i < templateKeys.length; i++) {
      var newGroup = this._fb.group({
        template: [templateKeys[i], Validators.required],
        count: [
          this.updateEnv.count_capacity[templateKeys[i]],
          [Validators.required, Validators.pattern(/-?\d+/)],
        ],
        params: this._fb.array([]),
      });
      var paramKeys = Object.keys(
        this.updateEnv.template_mapping[templateKeys[i]]
      );
      for (var j = 0; j < paramKeys.length; j++) {
        var newParam = this._fb.group({
          key: [paramKeys[j], Validators.required],
          value: [
            this.updateEnv.template_mapping[templateKeys[i]][paramKeys[j]],
            Validators.required,
          ], // yuck
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
      mappings: this._fb.array([]),
    });
    for (var i = 0; i < ipKeys.length; i++) {
      this.newIpMapping(
        ipKeys[i],
        this.updateEnv.ip_translation_map[ipKeys[i]]
      );
    }
  }

  public fixNullValues() {
    if (this.updateEnv.ip_translation_map == null) {
      this.updateEnv.ip_translation_map = {};
    }

    if (this.updateEnv.template_mapping == null) {
      this.updateEnv.template_mapping = {};
    }

    if (this.updateEnv.environment_specifics == null) {
      this.updateEnv.environment_specifics = {};
    }
  }

  ngOnChanges() {
    if (this.updateEnv) {
      this.fixNullValues();
      this.env = this.updateEnv;
      this._prepare();
      this.wizard.navService.goTo(this.wizard.pages.last, true);
      this.wizard.pages.first.makeCurrent();
    }
  }

  ngOnInit() {
    this._build();
    this.rbacService
      .Grants('virtualmachinetemplates', 'list')
      .then((listVmTemplates: boolean) => {
        if (listVmTemplates) {
          this.refreshVMTemplates();
        }
      });
  }

  private refreshVMTemplates() {
    this.vmTemplateService
      .list()
      .subscribe((vm: VMTemplate[]) => (this.VMTemplates = vm));
  }

  public getValidVMTemplates() {
    let vmtList = this.VMTemplates;
    let selectedVMTs = [];
    for (
      var i = 0;
      i < (this.templateMappings.get('templates') as FormArray).length;
      i++
    ) {
      // i = index of template
      selectedVMTs.push(
        this.templateMappings.get(['templates', i, 'template']).value
      );
    }

    vmtList = vmtList.filter((obj) => {
      return !selectedVMTs.includes(obj.id);
    });

    let selectionValid = false;

    vmtList.forEach((vmt) => {
      if (vmt.id == this.templateSelection.get('vmt_select').value) {
        selectionValid = true;
      }
    });

    if (!selectionValid && vmtList.length > 0) {
      this.templateSelection.get('vmt_select').setValue(vmtList[0]?.id);
    }

    return vmtList;
  }

  private _build() {
    this.buildEnvironmentDetails();
    this.buildEnvironmentSpecifics();
    this.buildIpMapping();
    this.buildTemplateMapping();
    this.buildVMTSelection();
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
      this.env = this.updateEnv;
      this._prepare();
    }
    this.wizard.open();
  }

  public copyEnvironmentDetails() {
    this.env.display_name = this.environmentDetails.get('display_name').value;
    this.env.dnssuffix = this.environmentDetails.get('dnssuffix').value;
    this.env.provider = this.environmentDetails.get('provider').value;
    this.env.ws_endpoint = this.environmentDetails.get('ws_endpoint').value;
  }

  public newIpMapping(from: string = '', to: string = '') {
    var newGroup = this._fb.group({
      from: [from, Validators.required],
      to: [to, Validators.required],
    });
    (this.ipMapping.get('mappings') as FormArray).push(newGroup);
  }

  public deleteIpMapping(mappingIndex: number) {
    (this.ipMapping.get('mappings') as FormArray).removeAt(mappingIndex);
  }

  public copyIpMapping() {
    this.env.ip_translation_map = {};
    for (
      var i = 0;
      i < (this.ipMapping.get('mappings') as FormArray).length;
      i++
    ) {
      var from = (this.ipMapping.get(['mappings', i]) as FormGroup).get(
        'from'
      ).value;
      var to = (this.ipMapping.get(['mappings', i]) as FormGroup).get(
        'to'
      ).value;
      this.env.ip_translation_map[from] = to;
    }
  }

  public newEnvironmentSpecific(key: string = '', value: string = '') {
    var newGroup = this._fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required],
    });
    (this.environmentSpecifics.get('params') as FormArray).push(newGroup);
  }

  public deleteEnvironmentSpecific(index: number) {
    (this.environmentSpecifics.get('params') as FormArray).removeAt(index);
  }

  public copyEnvironmentSpecifics() {
    // replace existing kv map
    this.env.environment_specifics = {};
    for (
      var i = 0;
      i < (this.environmentSpecifics.get('params') as FormArray).length;
      i++
    ) {
      var key = (this.environmentSpecifics.get(['params', i]) as FormGroup).get(
        'key'
      ).value;
      var value = (
        this.environmentSpecifics.get(['params', i]) as FormGroup
      ).get('value').value;
      this.env.environment_specifics[key] = value;
    }
  }

  public hasTemplateSelection() {
    return this.templateSelection.get('vmt_select').value != '';
  }

  public newTemplateMapping() {
    var newGroup = this._fb.group({
      template: [
        this.templateSelection.get('vmt_select').value,
        Validators.required,
      ],
      count: [0, [Validators.required, Validators.pattern(/-?\d+/)]],
      params: this._fb.array([]),
    });
    (this.templateMappings.get('templates') as FormArray).push(newGroup);
  }

  public deleteTemplateMapping(index: number) {
    (this.templateMappings.get('templates') as FormArray).removeAt(index);
  }

  public getTeplateCount(vmt: string) {
    if (!this.env.count_capacity) {
      return 0;
    }
    return this.env.count_capacity[vmt] ?? 0;
  }

  public copyTemplateMapping() {
    this.env.template_mapping = {};
    this.env.count_capacity = {};
    // naïve solution, using nested for loop. gross, but gets the job done.
    for (
      var i = 0;
      i < (this.templateMappings.get('templates') as FormArray).length;
      i++
    ) {
      // i = index of template
      var template = this.templateMappings.get([
        'templates',
        i,
        'template',
      ]).value;
      var count = this.templateMappings.get(['templates', i, 'count']).value;
      var templateMap = {};
      for (
        var j = 0;
        j <
        (this.templateMappings.get(['templates', i, 'params']) as FormArray)
          .length;
        j++
      ) {
        // j = index of param
        var key = this.templateMappings
          .get(['templates', i, 'params', j])
          .get('key').value;
        var value = this.templateMappings
          .get(['templates', i, 'params', j])
          .get('value').value;
        templateMap[key] = value;
      }
      this.env.template_mapping[template] = templateMap;
      this.env.count_capacity[template] = count;
    }
  }

  public newTemplateParameter(templateIndex: number) {
    var newParam = this._fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
    (
      (this.templateMappings.get('templates') as FormArray)
        .at(templateIndex)
        .get('params') as FormArray
    ).push(newParam);
  }

  public deleteTemplateParameter(
    templateIndex: number,
    parameterIndex: number
  ) {
    (
      (this.templateMappings.get('templates') as FormArray)
        .at(templateIndex)
        .get('params') as FormArray
    ).removeAt(parameterIndex);
  }

  public saveEnvironment() {
    if (this.updateEnv) {
      this.env.name = this.updateEnv.name;
      this.envService.update(this.env).subscribe((s: ServerResponse) => {
        this.event.next(true);
      });
    } else {
      this.envService.add(this.env).subscribe((s: ServerResponse) => {
        this.event.next(true);
      });
      this.env = new Environment();
    }
  }

  getVirtualMachineTemplateName(template: any) {
    return this.virtualMachineTemplateList.get(template as string) ?? template;
  }
}
