import { Component, Input, OnInit } from '@angular/core';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { VirtualMachine } from 'src/app/data/virtualmachine';
import { VmService } from 'src/app/data/vm.service';

@Component({
  selector: 'vm-dashboard',
  templateUrl: './vm-dashboard.component.html',
  styleUrls: ['./vm-dashboard.component.scss']
})
export class VmDashboardComponent implements OnInit {

  @Input()
  selectedEvent: ScheduledEvent;

  constructor(
    public vmService: VmService,
  ) { }
  
  public vms: VirtualMachine[] = [];  

  ngOnInit(): void {
    this.getVmList()
  }

  ngOnChanges() {
    this.getVmList()
  }

  getVmList() {
    // this.vmService.listByScheduledEvent(this.selectedEvent.id).subscribe(
    //   (vm) => {
    //     console.log(vm)
    //     this.vms = vm
    //   }
    // )

    this.vmService.list().subscribe(
      (vm) => {
        console.log(vm)
        this.vms = vm
      }
    )
  }
  
}


