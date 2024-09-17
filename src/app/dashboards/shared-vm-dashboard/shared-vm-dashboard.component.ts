import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import {
  VirtualMachine,
  VirtualMachineTypeShared,
} from 'src/app/data/virtualmachine';
import { VmService } from 'src/app/data/vm.service';
import { VmSet } from 'src/app/data/vmset';

interface dashboardVmSet extends VmSet {
  setVMs?: VirtualMachine[];
  stepOpen?: boolean;
  dynamic: boolean;
}

@Component({
  selector: 'shared-vm-dashboard',
  templateUrl: './shared-vm-dashboard.component.html',
  styleUrls: ['./shared-vm-dashboard.component.scss'],
})
export class SharedVmDashboardComponent implements OnChanges {
  @Input()
  selectedEvent: ScheduledEvent;

  constructor(
    public vmService: VmService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  public vms: VirtualMachine[] = [];
  public vmSets: dashboardVmSet[] = [];

  public selectedVM: VirtualMachine = new VirtualMachine();
  public openPanels: Set<String> = new Set();

  ngOnChanges() {
    this.getVmList();
  }

  setStepOpen(set) {
    this.openPanels.has(set.base_name)
      ? this.openPanels.delete(set.base_name)
      : this.openPanels.add(set.base_name);
  }

  getVmList() {
    this.vmService
      .listByScheduledEvent(this.selectedEvent.id)
      .subscribe((vmList) => {
        this.vms = vmList
          .filter((vm) => vm.vm_type == VirtualMachineTypeShared) // vm.vm_type!="Shared" && vm.user==''
          .map((vm) => ({
            ...vm,
          }));
        if (
          this.vms.length > 0
        ) {
          this.loadVmsFromScheduledEvent();
        }
        this.cd.detectChanges();
      });
  }

  // Used to load either dynamic or shared virtualMachines for an event
  private loadVmsFromScheduledEvent() {
    // dynamic machines have no associated vmSet
    if (this.vms.length > 0) {
      let groupedVms: Map<string, VirtualMachine[]> = this.groupByEnvironment(
        this.vms
      );
      // (shared) vms grouped by environment
      groupedVms.forEach((element, environment) => {
        let vmSet: dashboardVmSet = {
          ...new VmSet(),
          base_name: environment,
          stepOpen: this.openPanels.has(environment),
          dynamic: false,
        };
        vmSet.setVMs = element;
        vmSet.count = element.length;
        vmSet.available = element.filter((vm) => vm.status == 'running').length;
        vmSet.environment = environment;
        this.vmSets.push(vmSet);
      });
    }
  }

  openTerminal(vm: VirtualMachine) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/terminal', vm.id, vm.ws_endpoint])
    );
    window.open(url, '_blank');
    return;
  }

  groupByEnvironment(vms: VirtualMachine[]) {
    let envMap = new Map<string, VirtualMachine[]>();
    vms.forEach((element) => {
      if (envMap.has(element.environment_id)) {
        let envVms = envMap.get(element.environment_id);
        envVms.push(element);
        envMap.set(element.environment_id, envVms);
      } else {
        let envVms: VirtualMachine[] = [element];
        envMap.set(element.environment_id, envVms);
      }
    });
    return envMap;
  }
}
