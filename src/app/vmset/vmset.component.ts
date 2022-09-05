import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NewVmComponent } from './new-vm/new-vm.component';

@Component({
  selector: 'vmset',
  templateUrl: './vmset.component.html',
  styleUrls: ['./vmset.component.scss']
})
export class VmsetComponent {
  @Input()
  public vms: {}[] = []; // because JSONifying Maps is hard

  @Output()
  public vmsChange: EventEmitter<{}[]> = new EventEmitter<{}[]>();

  @Input()
  public createRbac : string[] = [];

  @Input()
  public createRbacOp : string = 'OR';

  @Input()
  public deleteRbac : string[] = [];

  @Input()
  public deleteRbacOp : string = 'OR';

  public addingIndex: number; 

  @ViewChild("newvm") newVmModal: NewVmComponent;

  openAddVm(i: number) {
    this.addingIndex = i;
    this.newVmModal.open();
  }

  addVM(vm: [string, string]) {
    this.vms[this.addingIndex][vm[0]] = vm[1];
    this.vmsChange.emit(this.vms);
  }

  deleteVM(setIndex: number, key: string) {
    delete this.vms[setIndex][key];
    this.vmsChange.emit(this.vms);
  }

  addVMSet() {
    this.vms.push({});
    this.vmsChange.emit(this.vms);
  }

  deleteVMSet(i: number) {
    this.vms.splice(i, 1);
    this.vmsChange.emit(this.vms);
  }
}
