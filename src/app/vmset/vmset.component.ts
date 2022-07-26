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
  public modified: EventEmitter<boolean> = new EventEmitter(false);

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
    this.modified.emit(true);
    this.vms[this.addingIndex][vm[0]] = vm[1];
  }

  deleteVM(setIndex: number, key: string) {
    this.modified.emit(true);
    delete this.vms[setIndex][key];
  }

  addVMSet() {
    this.modified.emit(true);
    this.vms.push({});
  }

  deleteVMSet(i: number) {
    this.modified.emit(true);
    this.vms.splice(i, 1);
  }
}
