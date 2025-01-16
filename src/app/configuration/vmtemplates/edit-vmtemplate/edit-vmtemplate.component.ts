import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { DEFAULT_ALERT_ERROR_DURATION } from 'src/app/alert/alert';
import { AlertComponent } from 'src/app/alert/alert.component';
import { CloudInitConfig } from 'src/app/data/cloud-init-config';
import { EitherAllOrNoneValidator } from '../../../validators/eitherallornone.validator';
import { FloatValidator } from '../../../validators/float.validator';
import { GenericKeyValueGroup } from 'src/app/data/forms';
import { ServerResponse } from 'src/app/data/serverresponse';
import { VMTemplateServiceConfiguration } from 'src/app/data/vm-template-service-configuration';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import * as uuid from 'uuid';

@Component({
  selector: 'edit-vmtemplate-wizard',
  templateUrl: './edit-vmtemplate.component.html',
  styleUrls: ['./edit-vmtemplate.component.scss'],
})
export class EditVmtemplateComponent implements OnInit, OnChanges {
  public templateDetails: FormGroup<{
    name: FormControl<string>;
    image: FormControl<string>;
  }>;
  public costDetails: FormGroup<{
    cost_base_price: FormControl<string>;
    cost_time_unit: FormControl<string>;
  }>;
  public configMap: FormGroup<{
    mappings: FormArray<GenericKeyValueGroup<string>>;
  }>;
  public buttonsDisabled: boolean = false;

  public cloudConfigKey: string = 'cloud-config';
  public vmServiceKey: string = 'webinterfaces';
  public cloudConfig: CloudInitConfig = new CloudInitConfig();

  @Input()
  public editTemplate: VMTemplate | null;

  @Output()
  public event: EventEmitter<boolean> = new EventEmitter(false);

  public template: VMTemplate = new VMTemplate();
  public uneditedTemplate: VMTemplate = new VMTemplate();
  public selectWebinterfaceModalOpen: boolean = false;
  public newWebinterfaceModalOpen: boolean = false;

  constructor(
    private _fb: NonNullableFormBuilder,
    private vmTemplateService: VmtemplateService,
  ) {}

  ngOnInit(): void {
    this._build();
  }

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;
  @ViewChild('alert') alert: AlertComponent;

  public open() {
    this.template = new VMTemplate();
    this.buttonsDisabled = false;
    this._build();
    this.wizard.reset();
    if (this.editTemplate) {
      this._prepare(this.editTemplate);
    }
    this.wizard.open();
  }

  private _build() {
    this.buildConfigMap();
    this.buildCostDetails()
    this.buildTemplateDetails();
  }

  public buildTemplateDetails(vmTemplate: VMTemplate | null = null) {
    this.templateDetails = this._fb.group({
      name: this._fb.control<string>(vmTemplate ? vmTemplate.name : '', [
        Validators.required,
        Validators.minLength(4),
      ]),
      image: this._fb.control<string>(
        vmTemplate ? vmTemplate.image : '',
        Validators.required,
      ),
    });
  }

  public buildCostDetails(vmTemplate: VMTemplate | null = null) {
    this.costDetails = this._fb.group(
      {
        cost_base_price: this._fb.control<string>(
          vmTemplate?.cost_base_price ?? '',
          FloatValidator(0, Number.MAX_VALUE),
        ),
        cost_time_unit: this._fb.control<string>(
          vmTemplate?.cost_time_unit ?? '',
        ),
      },
      {
        validators: [EitherAllOrNoneValidator(['cost_base_price', 'cost_time_unit'])],
      }
    );
  }

  public buildConfigMap() {
    this.configMap = this._fb.group({
      mappings: this._fb.array<GenericKeyValueGroup<string>>([
        this._fb.group({
          key: this._fb.control<string>('', Validators.required),
          value: this._fb.control<string>('', Validators.required),
        }),
      ]),
    });
  }

  private buildVMServices(configMapData?: string) {
    if (configMapData) {
      let temp = JSON.parse(configMapData);
      let resultMap = new Map();
      temp.forEach((entry) => {
        entry.cloudConfigMap = new Map(Object.entries(entry['cloudConfigMap'])); // Convert Object to map
        entry['id'] = entry['id'] ?? uuid.v4(); //Catch old entries, that do not have an ID
        resultMap.set(entry['id'], entry);
      });
      return resultMap;
    } else return new Map();
  }

  public prepareConfigMap(vmTemplate: VMTemplate) {
    // differs from buildConfigMap() in that we are copying existing values
    // into the form
    let configKeys = Object.keys(vmTemplate.config_map).filter(
      (elem) => elem !== this.cloudConfigKey && elem != this.vmServiceKey,
    );
    this.cloudConfig.vmServices = this.buildVMServices(
      vmTemplate.config_map[this.vmServiceKey],
    );
    this.cloudConfig.buildNewYAMLFile();
    this.configMap = this._fb.group({
      mappings: this._fb.array<GenericKeyValueGroup<string>>([]),
    });

    for (let i = 0; i < configKeys.length; i++) {
      this.newConfigMapping(
        configKeys[i],
        vmTemplate.config_map[configKeys[i]],
      );
    }
  }

  public fixNullValues(vmTemplate: VMTemplate) {
    if (vmTemplate.config_map == null) {
      vmTemplate.config_map = {};
    }
  }

  public newConfigMapping(key: string = '', value: string = '') {
    const newGroup: GenericKeyValueGroup<string> = this._fb.group({
      key: this._fb.control<string>(key, Validators.required),
      value: this._fb.control<string>(value, Validators.required),
    });
    this.configMap.controls.mappings.push(newGroup);
  }

  public deleteConfigMapping(mappingIndex: number) {
    this.configMap.controls.mappings.removeAt(mappingIndex);
  }

  public copyTemplateDetails() {
    this.template.name = this.templateDetails.controls.name.value;
    this.template.image = this.templateDetails.controls.image.value;
  }

  public copyCostDetails() {
    this.template.cost_base_price = this.costDetails.controls.cost_base_price.value
      ? this.costDetails.controls.cost_base_price.value
      : undefined;
    this.template.cost_time_unit = this.costDetails.controls.cost_time_unit.value
      ? this.costDetails.controls.cost_time_unit.value
      : undefined;
  }


  public copyConfigMap() {
    this.template.config_map = {};
    for (let i = 0; i < this.configMap.controls.mappings.length; i++) {
      const key = this.configMap.controls.mappings.at(i).controls.key.value;
      const value = this.configMap.controls.mappings.at(i).controls.value.value;
      this.template.config_map[key] = value;
    }
    this.template.config_map[this.cloudConfigKey] =
      this.cloudConfig.cloudConfigYaml;
    let tempArray: VMTemplateServiceConfiguration[] = [];
    this.cloudConfig.vmServices.forEach(
      (vmService: VMTemplateServiceConfiguration) => {
        tempArray.push(vmService);
      },
    );
    let jsonString = JSON.stringify(tempArray);
    this.template.config_map[this.vmServiceKey] = jsonString;
  }
  public copyTemplate() {
    this.copyConfigMap();
    this.copyCostDetails()
    this.copyTemplateDetails();
  }

  public saveTemplate() {
    this.buttonsDisabled = true;
    if (this.editTemplate) {
      this.template.id = this.editTemplate.id;
      this.vmTemplateService.update(this.template).subscribe({
        next: (_s: ServerResponse) => {
          const alertMsg = 'VM Template saved';
          this.alert.success(alertMsg, false, 1000);
          this.event.next(true);
          setTimeout(() => this.wizard.close(), 1000);
        },
        error: (e: HttpErrorResponse) => {
          this.alert.danger(
            'Error saving VM Template: ' + e.message,
            false,
            DEFAULT_ALERT_ERROR_DURATION,
          );
          this.buttonsDisabled = false;
        },
      });
    } else {
      this.vmTemplateService.create(this.template).subscribe({
        next: (_s: ServerResponse) => {
          const alertMsg = 'VM Template saved';
          this.alert.success(alertMsg, false, 1000);
          this.event.next(true);
          setTimeout(() => this.wizard.close(), 1000);
        },
        error: (e: HttpErrorResponse) => {
          this.alert.danger(
            'Error saving VM Template: ' + e.message,
            false,
            DEFAULT_ALERT_ERROR_DURATION,
          );
          this.buttonsDisabled = false;
        },
      });
    }
  }

  private _prepare(vmTemplate: VMTemplate) {
    this.buildTemplateDetails(vmTemplate);
    this.buildCostDetails(vmTemplate);
    this.prepareConfigMap(vmTemplate);
  }

  ngOnChanges() {
    if (this.editTemplate) {
      this.fixNullValues(this.editTemplate);
      this._prepare(this.editTemplate);
      this.wizard.navService.goTo(this.wizard.pages.last, true);
      this.wizard.pages.first.makeCurrent();
    } else {
      this.buildTemplateDetails();
      this.buildCostDetails();
      this.buildConfigMap();
    }
    this.uneditedTemplate = structuredClone(this.template);
  }
}
