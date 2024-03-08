import { Component, EventEmitter, Output, ViewChild, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'new-vm',
  templateUrl: './new-vm.component.html',
})
export class NewVmComponent implements OnChanges {
  public modalOpen: boolean = false;
  public vmtemplates: VMTemplate[] = [];

  @Input()
  public vms: {}[] = []; // because JSONifying Maps is hard

  @Input()
  public listVms: boolean;

  @Output()
  public vm: EventEmitter<[string, string]> = new EventEmitter(null);

  @ViewChild('modal') modal: ClrModal;

  constructor(public vmTemplateService: VmtemplateService) {}

  ngOnChanges(): void {
    if (this.listVms) {
      this.vmTemplateService
        .list()
        .subscribe((v: VMTemplate[]) => (this.vmtemplates = v));
    }
  }

  public open(): void {
    this.vmform.reset();
    if (!this.listVms) {
      this.vmform.disable();
    }
    this.modal.open();
  }

  public vmform: FormGroup<{
    vm_name: FormControl<string>;
    vm_template: FormControl<string>;
  }> = new FormGroup({
    vm_name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(4),
      this.validateUniqueVmName()
    ]),
    vm_template: new FormControl<string | null>(null, [Validators.required]),
  });

  addVM() {
    const vm_name = this.vmform.controls.vm_name.value;
    const vm_template = this.vmform.controls.vm_template.value;

    this.vm.emit([vm_name, vm_template]);

    this.modal.close();
  }

  private validateUniqueVmName(): ValidatorFn {
    return (control: FormControl<string | null>) => {
      const vmName = control.value;
      const isNotUnique = vmName && this.vms.some((vmSet: {}) => vmSet.hasOwnProperty(vmName))
      if (isNotUnique) {
        return {
          notUnique: true,
        };
      }
      return null;
    };
  }
}
