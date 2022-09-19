import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'new-vm',
  templateUrl: './new-vm.component.html',
})
export class NewVmComponent implements OnInit {
  public modalOpen: boolean = false;
  public vmtemplates: VMTemplate[] = [];

  @Input()
  public listVms: boolean;

  @Output()
  public vm: EventEmitter<[string, string]> = new EventEmitter(null);

  @ViewChild('modal') modal: ClrModal;

  constructor(
    public vmTemplateService: VmtemplateService
  ) { }

  ngOnInit(): void {
    if(this.listVms) {
      this.vmTemplateService.list()
      .subscribe(
        (v: VMTemplate[]) => this.vmtemplates = v
      )
    }
  }

  public open(): void {
    this.vmform.reset();
    if(!this.listVms) {
      this.vmform.disable();
    }
    this.modal.open();
  }

  public vmform: FormGroup = new FormGroup({
    'vm_name': new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'vm_template': new FormControl(null, [
      Validators.required
    ])
  })

  addVM() {
    var vm_name = this.vmform.get('vm_name').value;
    var vm_template = this.vmform.get('vm_template').value;

    this.vm.emit([vm_name, vm_template]);

    this.modal.close();
  }

}
