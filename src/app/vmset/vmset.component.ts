import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { RbacService } from '../data/rbac.service';
import { NewVmComponent } from './new-vm/new-vm.component';

@Component({
  selector: 'vmset',
  templateUrl: './vmset.component.html',
  styleUrls: ['./vmset.component.scss']
})
export class VmsetComponent implements OnInit {
  @Input()
  public vms: {}[] = []; // because JSONifying Maps is hard

  @Output()
  public vmsChange: EventEmitter<{}[]> = new EventEmitter<{}[]>();

  @Input()
  public updateRbac : boolean;

  public addingIndex: number;

  public allowedAddVm: Promise<boolean>;

  private newVmModal: NewVmComponent;

  @ViewChild('newvm', { static: false }) set content(content: NewVmComponent) {
     if(content) {
          this.newVmModal = content;
     }
  }

  constructor(public rbacService: RbacService) {}

  ngOnInit(): void {
    this.allowedAddVm = this.rbacService.Grants("virtualmachinetemplates", "list");
  }

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

  resetVmSet(){
    this.vms = [];
    this.vmsChange.emit(this.vms);
  }
}
