import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  combineLatest,
  concatMap,
  finalize,
  from,
  map,
  of,
  toArray,
} from 'rxjs';
import { Progress } from 'src/app/data/progress';
import { ProgressService } from 'src/app/data/progress.service';
import { ScheduledEventBase } from 'src/app/data/scheduledevent';
import { UserService } from 'src/app/data/user.service';
import { VirtualMachine } from 'src/app/data/virtualmachine';
import { VmService } from 'src/app/data/vm.service';
import { VmSet } from 'src/app/data/vmset';
import { VmSetService } from 'src/app/data/vmset.service';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';
import { timeSince } from 'src/app/utils';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from 'src/app/data/serverresponse';

interface dashboardVmSet extends VmSet {
  setVMs?: VirtualMachine[];
  selectedVMs?: VirtualMachine[];
  stepOpen?: boolean;
  dynamic: boolean;
}

@Component({
  selector: 'vm-dashboard',
  templateUrl: './vm-dashboard.component.html',
  styleUrls: ['./vm-dashboard.component.scss'],
})
export class VmDashboardComponent implements OnInit, OnChanges {
  @Input()
  selectedEvent: ScheduledEventBase;

  constructor(
    public vmService: VmService,
    public vmSetService: VmSetService,
    public userService: UserService,
    public progressService: ProgressService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public http: HttpClient,
  ) {}

  public vms: VirtualMachine[] = [];
  public vmSets: dashboardVmSet[] = [];

  public selectedVM: VirtualMachine | undefined;
  public deleteMessage: string = 'Are you sure you want to delete this VM?';
  public openPanels: Set<string> = new Set();

  private selectedVMsForDelete: VirtualMachine[] = [];
  private selectedVmIdsByPanel: Map<string, Set<string>> = new Map();
  private bulkDeleteLoadingPanels: Set<string> = new Set();
  private bulkDeletePanelKey: string | null = null;

  @ViewChild('deleteModal') deleteModal: DeleteConfirmationComponent;

  ngOnInit(): void {
    this.getVmList();
  }

  ngOnChanges() {
    this.getVmList();
  }

  setStepOpen(set: dashboardVmSet) {
    this.openPanels.has(set.base_name)
      ? this.openPanels.delete(set.base_name)
      : this.openPanels.add(set.base_name);
  }

  getVmList() {
    combineLatest([
      this.vmService.listByScheduledEvent(this.selectedEvent.id),
      this.vmSetService.getVMSetByScheduledEvent(this.selectedEvent.id),
      this.userService.list(),
    ]).subscribe(([vmList, vmSet, users]) => {
      const userMap = new Map(users.map((u) => [u.id, u.email]));
      this.vms = vmList.map((vm) => ({
        ...vm,
        user: userMap.get(vm.user) ?? '-',
      }));
      this.vmSets = vmSet.map((set) => ({
        ...set,
        setVMs: this.vms.filter((vm) => vm.vm_set_id === set.id),
        selectedVMs: [],
        stepOpen: this.openPanels.has(set.base_name),
        dynamic: false,
        available: this.vms.filter(
          (vm) => vm.vm_set_id === set.id && vm.status == 'running',
        ).length,
      }));
      // dynamic machines have no associated vmSet
      if (this.vms.filter((vm) => vm.vm_set_id == '').length > 0) {
        const groupedVms: Map<string, VirtualMachine[]> =
          this.groupByEnvironment(this.vms.filter((vm) => vm.vm_set_id == ''));
        groupedVms.forEach((element, environment) => {
          const vmSet: dashboardVmSet = {
            ...new VmSet(),
            base_name: environment,
            selectedVMs: [],
            stepOpen: this.openPanels.has(environment),
            dynamic: true,
          };
          vmSet.setVMs = element;
          vmSet.count = element.length;
          vmSet.available = element.filter(
            (vm) => vm.status == 'running',
          ).length;
          vmSet.environment = environment;
          this.vmSets.push(vmSet);
        });
      }
      this.reapplySelections();
      this.cd.detectChanges(); //The async Code above updates values after Angulars usual change-detection so we call this Method to prevent Errors
    });
  }

  getVmAge(vm: VirtualMachine): string {
    return timeSince(new Date(vm.creation_timestamp), new Date(), 2);
  }

  openUsersTerminal(vm: VirtualMachine) {
    if (!vm.user) return;
    let userId: string | undefined; //get the Users ID who has the VM allocated to him
    this.userService.list().subscribe((users) => {
      userId = users.filter((user) => user.email === vm.user)[0]?.id;
    });
    if (!userId) return;
    let progress: Progress; //If there is a valid User ID, get all active Progresses of that user.
    this.progressService
      .listByScheduledEvent(this.selectedEvent.id, false)
      .subscribe((progressList) => {
        progress = progressList.filter((p) => p.user === userId)[0];
        if (!progress) return; //Since a User can only have one active Session, navigate to the corresponding Step the User is currently at.
        const url = this.router.serializeUrl(
          this.router.createUrlTree([
            '/session',
            progress.session,
            'steps',
            Math.max(progress.current_step - 1, 0),
          ]),
        );
        window.open(url, '_blank');
      });
  }

  groupByEnvironment(vms: VirtualMachine[]) {
    const envMap = new Map<string, VirtualMachine[]>();
    vms.forEach((element) => {
      const envVms = envMap.get(element.environment_id);
      if (envVms) {
        envVms.push(element);
        envMap.set(element.environment_id, envVms);
      } else {
        const envVms: VirtualMachine[] = [element];
        envMap.set(element.environment_id, envVms);
      }
    });
    return envMap;
  }

  getPanelKey(set: dashboardVmSet): string {
    return set.id ? `vmset:${set.id}` : `dynamic:${set.environment}`;
  }

  hasSelectedVMs(set: dashboardVmSet): boolean {
    return (set.selectedVMs?.length ?? 0) > 0;
  }

  isBulkDeleteLoading(set: dashboardVmSet): boolean {
    return this.bulkDeleteLoadingPanels.has(this.getPanelKey(set));
  }

  updateSelectedVMs(set: dashboardVmSet, selectedVMs: VirtualMachine[]): void {
    const panelKey = this.getPanelKey(set);

    if (selectedVMs.length > 0) {
      this.clearSelectionsExcept(panelKey);
      this.selectedVmIdsByPanel.set(
        panelKey,
        new Set(selectedVMs.map((vm) => vm.id)),
      );
    } else {
      this.selectedVmIdsByPanel.delete(panelKey);
    }

    set.selectedVMs = selectedVMs;
  }

  openBulkDeleteConfirmation(set: dashboardVmSet): void {
    const selectedVMs = [...(set.selectedVMs ?? [])];

    if (selectedVMs.length < 1) {
      return;
    }

    this.selectedVM = undefined;
    this.selectedVMsForDelete = selectedVMs;
    this.bulkDeletePanelKey = this.getPanelKey(set);
    this.deleteMessage =
      selectedVMs.length === 1
        ? 'Are you sure you want to delete this VM?'
        : `Are you sure you want to delete ${selectedVMs.length} VMs?`;
    this.deleteModal.open();
  }

  openDeleteConfirmation(vm: VirtualMachine): void {
    this.selectedVM = vm;
    this.selectedVMsForDelete = [];
    this.bulkDeletePanelKey = null;
    this.deleteMessage = 'Are you sure you want to delete this VM?';
    this.deleteModal.open();
  }

  handleDelete(confirm: boolean): void {
    if (!confirm) {
      this.resetDeleteState();
      return;
    }

    const targetVMs = this.selectedVM
      ? [this.selectedVM]
      : [...this.selectedVMsForDelete];

    if (targetVMs.length < 1) {
      this.resetDeleteState();
      return;
    }

    const bulkDeletePanelKey = this.bulkDeletePanelKey;

    if (bulkDeletePanelKey) {
      this.bulkDeleteLoadingPanels.add(bulkDeletePanelKey);
    }

    from(targetVMs)
      .pipe(
        concatMap((vm) =>
          this.http
            .delete<ServerResponse>(environment.server + '/vm/' + vm.id)
            .pipe(
              map((response: ServerResponse) => ({
                vmId: vm.id,
                success: response.message == 'deleted successfully',
              })),
              catchError((err) => {
                console.error('Error on VM deletion:', vm.id, err);
                return of({ vmId: vm.id, success: false });
              }),
            ),
        ),
        toArray(),
        finalize(() => {
          if (bulkDeletePanelKey) {
            this.bulkDeleteLoadingPanels.delete(bulkDeletePanelKey);
            this.clearSelectionForPanel(bulkDeletePanelKey);
          }
          this.resetDeleteState();
          this.getVmList();
        }),
      )
      .subscribe((results) => {
        const failedVmIds = results
          .filter((result) => !result.success)
          .map((result) => result.vmId);

        if (failedVmIds.length > 0) {
          console.error('Failed to delete VMs:', failedVmIds);
          return;
        }

        console.log(
          'Deleted VMs:',
          results.map((result) => result.vmId),
        );
      });
  }

  private clearSelectionsExcept(panelKey: string): void {
    for (const [key] of this.selectedVmIdsByPanel) {
      if (key !== panelKey) {
        this.selectedVmIdsByPanel.delete(key);
      }
    }

    this.vmSets.forEach((set) => {
      if (this.getPanelKey(set) !== panelKey) {
        set.selectedVMs = [];
      }
    });
  }

  private clearSelectionForPanel(panelKey: string): void {
    this.selectedVmIdsByPanel.delete(panelKey);
    this.vmSets.forEach((set) => {
      if (this.getPanelKey(set) === panelKey) {
        set.selectedVMs = [];
      }
    });
  }

  private reapplySelections(): void {
    this.vmSets.forEach((set) => {
      const panelKey = this.getPanelKey(set);
      const selectedVmIds = this.selectedVmIdsByPanel.get(panelKey);

      if (!selectedVmIds) {
        set.selectedVMs = [];
        return;
      }

      const selectedVMs = (set.setVMs ?? []).filter((vm) =>
        selectedVmIds.has(vm.id),
      );

      if (selectedVMs.length < 1) {
        this.selectedVmIdsByPanel.delete(panelKey);
      }

      set.selectedVMs = selectedVMs;
    });
  }

  private resetDeleteState(): void {
    this.selectedVM = undefined;
    this.selectedVMsForDelete = [];
    this.bulkDeletePanelKey = null;
    this.deleteMessage = 'Are you sure you want to delete this VM?';
  }
}
