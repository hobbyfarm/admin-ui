import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Progress } from 'src/app/data/progress';
import { ProgressService } from 'src/app/data/progress.service';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { UserService } from 'src/app/data/user.service';
import { VirtualMachine } from 'src/app/data/virtualmachine';
import { VmService } from 'src/app/data/vm.service';
import { VmSet } from 'src/app/data/vmset';
import { VmSetService } from 'src/app/data/vmset.service';

interface dashboardVmSet extends VmSet {
  setVMs?: VirtualMachine[],
  stepOpen?: boolean
  dynamic: boolean
}

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
    public vmSetService: VmSetService,
    public userService: UserService,
    public progressService: ProgressService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  public vms: VirtualMachine[] = [];
  public vmSets: dashboardVmSet[] = [];

  public selectedVM: VirtualMachine = new VirtualMachine();
  public openPanels: Set<String> = new Set()

  ngOnInit(): void {    
    this.getVmList()
  }

  ngOnChanges() {
    this.getVmList()
  }

  setStepOpen(set) {
    this.openPanels.has(set.base_name) ? this.openPanels.delete(set.base_name) : this.openPanels.add(set.base_name)    
  }

  getVmList() {
    combineLatest([
      this.vmService.listByScheduledEvent(this.selectedEvent.id),
      this.vmSetService.getVMSetByScheduledEvent(this.selectedEvent.id),
      this.userService.getUsers()
    ]).subscribe(([vmList, vmSet, users]) => {
      const userMap = new Map(users.map(u => [u.id, u.email]));
      this.vms = vmList.map((vm) => ({
        ...vm,
        user: userMap.get(vm.user) ?? '-',
      }))

      this.vmSets = vmSet.map((set) => ({
        ...set,
        setVMs: this.vms.filter(vm => vm.vm_set_id === set.id),
        stepOpen: this.openPanels.has(set.base_name),
        dynamic: false,
        available: this.vms.filter(vm => vm.vm_set_id === set.id && vm.status == "running").length    
      })
      )
      // dynamic machines have no associated vmSet
      if (this.vms.filter(vm => vm.vm_set_id == "").length > 0) {
        let groupedVms: Map<string, VirtualMachine[]> = this.groupByEnvironment(this.vms.filter(vm => vm.vm_set_id == ""));
        groupedVms.forEach((element, environment) => {
          let vmSet: dashboardVmSet = {
            ...new VmSet(),
            base_name: environment,
            stepOpen: this.openPanels.has(environment),
            dynamic: true
          }
          vmSet.setVMs = element
          vmSet.count = element.length
          vmSet.available = element.filter(vm => vm.status == "running").length
          vmSet.environment = environment
          this.vmSets.push(vmSet)     
        });     
      }
      this.cd.detectChanges() //The async Code above updates values after Angulars usual change-detection so we call this Method to prevent Errors
    });    
  }

  openUsersTerminal(vm: VirtualMachine) {   
    if (!vm.user) return; 
    var userId: string; //get the Users ID who has the VM allocated to him
    this.userService.getUsers().subscribe((users) => {
      userId = users.filter((user) => user.email === vm.user)[0]?.id
    })
    if (!userId) return;
    var progress: Progress //If there is a valid User ID, get all active Progresses of that user.
    this.progressService.listByScheduledEvent(this.selectedEvent.id, false).subscribe((progressList) => {
      progress = progressList.filter((p) => 
      p.user === userId,
      )[0]
      if(!progress) return; //Since a User can only have one active Session, navigate to the corresponding Step the User is currently at.
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/session', progress.session, 'steps', Math.max(progress.current_step - 1, 0),])
      );
      window.open(url, '_blank');
    })
  }

  groupByEnvironment(vms: VirtualMachine[]) {
    let envMap = new Map<string, VirtualMachine[]>();
    vms.forEach(element => {
      if(envMap.has(element.environment_id)){
         let envVms = envMap.get(element.environment_id);
         envVms.push(element);
         envMap.set(element.environment_id, envVms);
      }else{
        let envVms: VirtualMachine[] = [element];
        envMap.set(element.environment_id, envVms);
      }
    });
    return envMap;
  }

}
