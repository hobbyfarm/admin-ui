import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { ServerResponse } from 'src/app/data/serverresponse';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';

@Component({
  selector: 'edit-vmtemplate-wizard',
  templateUrl: './edit-vmtemplate.component.html',
  styleUrls: ['./edit-vmtemplate.component.scss']
})
export class EditVmtemplateComponent implements OnInit, OnChanges {
  public templateDetails: FormGroup;
  public countMap: FormGroup;

  @Input()
  public editTemplate: VMTemplate;
  public template: VMTemplate = new VMTemplate();

  @Output()
  public event: EventEmitter<boolean> = new EventEmitter(false);

  constructor(
    private _fb: FormBuilder,
    private vmTemplateService: VmtemplateService
  ) { }

  ngOnInit(): void {
    this._build();
  }

  @ViewChild("wizard", {static: true}) wizard: ClrWizard;

  public open() {
    this.template = new VMTemplate();
    this._build();
    this.wizard.reset();
    if (this.editTemplate) {
      this._prepare();
    }
    this.wizard.open();
  }

  private _build() {
    this.buildCountMap();
    this.buildTemplateDetails();
  }

  public buildTemplateDetails(edit: boolean = false) {
    this.templateDetails = null;
    this.templateDetails = this._fb.group({
      name: [edit ? this.editTemplate.name : '', [Validators.required, Validators.minLength(4)]],
      image: [edit ? this.editTemplate.image : '', [Validators.required]],
      cpu: [ edit ? this.editTemplate.resources.cpu : 0 ],
      memory: [ edit ? this.editTemplate.resources.memory : 0 ],
      storage: [ edit ? this.editTemplate.resources.storage : 0 ]
    })
  }

  public buildCountMap() {
    this.countMap = this._fb.group({
      mappings: this._fb.array([
        this._fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required]
        })
      ])
    })
  }

  public prepareCountMap() {
    // differs from buildCountMap() in that we are copying existing values
    // into the form
    var countKeys = Object.keys(this.editTemplate.count_map)
    this.countMap = this._fb.group({
      mappings: this._fb.array([])
    });

    for (var i = 0; i < countKeys.length; i++) {
      this.newCountMapping(countKeys[i], this.editTemplate.count_map[countKeys[i]]);
    }
  }

  public fixNullValues() {
    if (this.editTemplate.count_map == null) {
      this.editTemplate.count_map = {};
    }
  }

  public newCountMapping(key: string = '', value: string = '') {
    var newGroup = this._fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required]
    });
    (this.countMap.get('mappings') as FormArray).push(newGroup)
  }

  public deleteCountMapping(mappingIndex: number) {
    (this.countMap.get('mappings') as FormArray).removeAt(mappingIndex);
  }

  public copyTemplateDetails() {
    this.template.name = this.templateDetails.get('name').value;
    this.template.image = this.templateDetails.get('image').value;
    this.template.resources = {cpu: 0, memory: 0, storage: 0};
    this.template.resources.cpu = this.templateDetails.get('cpu').value;
    this.template.resources.memory = this.templateDetails.get('memory').value;
    this.template.resources.storage = this.templateDetails.get('storage').value;
  }

  public copyCountMap() {
    this.template.count_map = {};
    for (var i = 0; i < (this.countMap.get('mappings') as FormArray).length; i++) {
      var key = (this.countMap.get(['mappings', i]) as FormGroup).get('key').value;
      var value = (this.countMap.get(['mappings', i]) as FormGroup).get('value').value
      this.template.count_map[key] = value;
    }
  }

  public copyTemplate() {
    this.copyCountMap();
    this.copyTemplateDetails();
  }

  public saveTemplate() {
    if (this.editTemplate) {
      this.template.id = this.editTemplate.id;
      this.vmTemplateService.update(this.template)
      .subscribe(
        (s: ServerResponse) => {
          this.event.next(true);
        }
      )
    } else {
      this.vmTemplateService.create(this.template)
      .subscribe(
        (s: ServerResponse) => {
          this.event.next(true);
        }
      )
    }
  }

  private _prepare() {
    this.buildTemplateDetails(true);
    this.prepareCountMap();
  }

  ngOnChanges() {
    if (this.editTemplate) {
      this.fixNullValues();
      this._prepare();
    } else {
      this.buildTemplateDetails();
      this.buildCountMap();
    }
  }
}
