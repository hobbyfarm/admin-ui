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
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Environment } from 'src/app/data/environment';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { EnvironmentService } from 'src/app/data/environment.service';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { RbacService } from 'src/app/data/rbac.service';
import { KeyValueGroup } from 'src/app/data/forms';

type TemplateMapping = FormGroup<{
  template: FormControl<string>;
  count: FormControl<number>;
  params: FormArray<KeyValueGroup>;
}>;

type FromToGroup = FormGroup<{
  from: FormControl<string>;
  to: FormControl<string>;
}>;

@Component({
  selector: 'edit-environment-wizard',
  templateUrl: './edit-environment.component.html',
  styleUrls: ['./edit-environment.component.scss'],
})
export class EditEnvironmentComponent implements OnInit, OnChanges {
  public environmentDetails: FormGroup<{
    display_name: FormControl<string>;
    dnssuffix: FormControl<string>;
    provider: FormControl<string>;
    ws_endpoint: FormControl<string>;
  }>;

  public environmentSpecifics: FormGroup<{
    params: FormArray<KeyValueGroup>;
  }>;
  public templateMappings: FormGroup<{
    templates: FormArray<TemplateMapping>;
  }>;
  public templateSelection: FormGroup<{
    vmt_select: FormControl<string>;
  }>;
  public ipMapping: FormGroup<{
    mappings: FormArray<FromToGroup>;
  }>;
  public VMTemplates: VMTemplate[] = [];

  @Input()
  public updateEnv: Environment;

  @Output()
  public event: EventEmitter<boolean> = new EventEmitter(false);

  public env: Environment = new Environment();

  constructor(
    private _fb: NonNullableFormBuilder,
    private envService: EnvironmentService,
    private vmTemplateService: VmtemplateService,
    private rbacService: RbacService
  ) {}

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;

  public buildEnvironmentDetails(edit: boolean = false) {
    this.environmentDetails = this._fb.group({
      display_name: this._fb.control<string>(
        edit ? this.updateEnv.display_name : '',
        [Validators.required, Validators.minLength(4)]
      ),
      dnssuffix: this._fb.control<string>(edit ? this.updateEnv.dnssuffix : ''),
      provider: this._fb.control<string>(edit ? this.updateEnv.provider : '', [
        Validators.required,
        Validators.minLength(2),
      ]),
      ws_endpoint: this._fb.control<string>(
        edit ? this.updateEnv.ws_endpoint : '',
        [
          Validators.required,
          Validators.pattern(
            /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
          ),
        ]
      ),
    });
  }

  public buildEnvironmentSpecifics() {
    this.environmentSpecifics = this._fb.group({
      params: this._fb.array([
        this._fb.group({
          key: this._fb.control<string>('', Validators.required),
          value: this._fb.control<string>('', Validators.required),
        }),
      ]),
    });
  }

  public buildVMTSelection() {
    this.templateSelection = this._fb.group({
      vmt_select: this._fb.control<string>('', Validators.required),
    });
  }

  public buildIpMapping() {
    this.ipMapping = this._fb.group({
      mappings: this._fb.array<FromToGroup>([
        this._fb.group({
          from: this._fb.control<string>('', Validators.required),
          to: this._fb.control<string>('', Validators.required),
        }),
      ]),
    });
  }

  public buildTemplateMapping() {
    this.templateMappings = this._fb.group({
      templates: this._fb.array<TemplateMapping>([]),
    });
  }

  public prepareEnvironmentSpecifics() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment
    const envKeys = Object.keys(this.updateEnv.environment_specifics);
    this.environmentSpecifics = this._fb.group({
      params: this._fb.array<KeyValueGroup>([]),
    });
    for (let i = 0; i < envKeys.length; i++) {
      this.newEnvironmentSpecific(
        envKeys[i],
        this.updateEnv.environment_specifics[envKeys[i]]
      );
    }
  }

  public prepareTemplateMapping() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment
    const templateKeys = Object.keys(this.updateEnv.template_mapping);
    this.templateMappings = this._fb.group({
      templates: this._fb.array<TemplateMapping>([]),
    });

    for (let i = 0; i < templateKeys.length; i++) {
      const newGroup: TemplateMapping = this._fb.group({
        template: this._fb.control<string>(
          templateKeys[i],
          Validators.required
        ),
        count: this._fb.control<number>(
          this.updateEnv.count_capacity[templateKeys[i]],
          [Validators.required, Validators.pattern(/-?\d+/)]
        ),
        params: this._fb.array<KeyValueGroup>([]),
      });
      const paramKeys = Object.keys(
        this.updateEnv.template_mapping[templateKeys[i]]
      );
      for (let j = 0; j < paramKeys.length; j++) {
        const newParam: KeyValueGroup = this._fb.group({
          key: this._fb.control<string>(paramKeys[j], Validators.required),
          value: this._fb.control<string>(
            this.updateEnv.template_mapping[templateKeys[i]][paramKeys[j]],
            Validators.required
          ), // yuck
        });
        newGroup.controls.params.push(newParam);
      }
      this.templateMappings.controls.templates.push(newGroup);
    }
  }

  public prepareIpMapping() {
    // prepare differs from 'build' in that we are filling out a form with
    // values from an existing environment
    const ipKeys = Object.keys(this.updateEnv.ip_translation_map);
    this.ipMapping = this._fb.group({
      mappings: this._fb.array<FromToGroup>([]),
    });
    for (let i = 0; i < ipKeys.length; i++) {
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
    let selectedVMTs: string[] = [];
    for (let i = 0; i < this.templateMappings.controls.templates.length; i++) {
      // i = index of template
      selectedVMTs.push(
        this.templateMappings.controls.templates.at(i).controls.template.value
      );
    }

    vmtList = vmtList.filter((obj) => {
      return !selectedVMTs.includes(obj.id);
    });

    let selectionValid = false;

    vmtList.forEach((vmt) => {
      if (vmt.id == this.templateSelection.controls.vmt_select.value) {
        selectionValid = true;
      }
    });

    if (!selectionValid && vmtList.length > 0) {
      this.templateSelection.controls.vmt_select.setValue(vmtList[0]?.id);
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
    const newGroup: FromToGroup = this._fb.group({
      from: this._fb.control<string>(from, Validators.required),
      to: this._fb.control<string>(to, Validators.required),
    });
    this.ipMapping.controls.mappings.push(newGroup);
  }

  public deleteIpMapping(mappingIndex: number) {
    this.ipMapping.controls.mappings.removeAt(mappingIndex);
  }

  public copyIpMapping() {
    this.env.ip_translation_map = {};
    for (let i = 0; i < this.ipMapping.controls.mappings.length; i++) {
      const from = this.ipMapping.controls.mappings.at(i).controls.from.value;
      const to = this.ipMapping.controls.mappings.at(i).controls.to.value;
      this.env.ip_translation_map[from] = to;
    }
  }

  public newEnvironmentSpecific(key: string = '', value: string = '') {
    const newGroup: KeyValueGroup = this._fb.group({
      key: this._fb.control<string>(key, Validators.required),
      value: this._fb.control<string>(value, Validators.required),
    });
    this.environmentSpecifics.controls.params.push(newGroup);
  }

  public deleteEnvironmentSpecific(index: number) {
    this.environmentSpecifics.controls.params.removeAt(index);
  }

  public copyEnvironmentSpecifics() {
    // replace existing kv map
    this.env.environment_specifics = {};
    for (let i = 0; i < this.environmentSpecifics.controls.params.length; i++) {
      const key =
        this.environmentSpecifics.controls.params.at(i).controls.key.value;
      const value =
        this.environmentSpecifics.controls.params.at(i).controls.value.value;
      this.env.environment_specifics[key] = value;
    }
  }

  public hasTemplateSelection() {
    return this.templateSelection.controls.vmt_select.value != '';
  }

  public newTemplateMapping() {
    const newGroup: TemplateMapping = this._fb.group({
      template: this._fb.control<string>(
        this.templateSelection.controls.vmt_select.value,
        Validators.required
      ),
      count: this._fb.control<number>(0, [
        Validators.required,
        Validators.pattern(/-?\d+/),
      ]),
      params: this._fb.array<KeyValueGroup>([]),
    });
    this.templateMappings.controls.templates.push(newGroup);
  }

  public deleteTemplateMapping(index: number) {
    this.templateMappings.controls.templates.removeAt(index);
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
    for (let i = 0; i < this.templateMappings.controls.templates.length; i++) {
      // i = index of template
      const template =
        this.templateMappings.controls.templates.at(i).controls.template.value;
      const count =
        this.templateMappings.controls.templates.at(i).controls.count.value;
      const templateMap: { [key: string]: string } = {};
      for (
        let j = 0;
        j <
        this.templateMappings.controls.templates.at(i).controls.params.length;
        j++
      ) {
        // j = index of param
        const key = this.templateMappings.controls.templates
          .at(i)
          .controls.params.at(j).controls.key.value;
        const value = this.templateMappings.controls.templates
          .at(i)
          .controls.params.at(j).controls.value.value;
        templateMap[key] = value;
      }
      this.env.template_mapping[template] = templateMap;
      this.env.count_capacity[template] = count;
    }
  }

  public newTemplateParameter(templateIndex: number) {
    const newParam: KeyValueGroup = this._fb.group({
      key: this._fb.control<string>('', Validators.required),
      value: this._fb.control<string>('', Validators.required),
    });
    this.templateMappings.controls.templates
      .at(templateIndex)
      .controls.params.push(newParam);
  }

  public deleteTemplateParameter(
    templateIndex: number,
    parameterIndex: number
  ) {
    this.templateMappings.controls.templates
      .at(templateIndex)
      .controls.params.removeAt(parameterIndex);
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
}
