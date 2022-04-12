import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { UserService } from 'src/app/data/user.service';
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
    public userService: UserService
  ) { }
  
  public vms: VirtualMachine[] = [];  

  ngOnInit(): void {
    this.getVmList()
  }

  ngOnChanges() {
    this.getVmList()
  }

  getVmList() {
    combineLatest([
      this.vmService.listByScheduledEvent(this.selectedEvent.id),
      this.userService.getUsers()
    ]).subscribe(([vmList, users]) => {
      const userMap = new Map(users.map(u => [u.id, u.email]));
      this.vms = vmList.map((vm) => ({
        ...vm,
        user: userMap.get(vm.user) ?? 'none',
      }))
    });  
  }
  
}
