import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProgressService } from 'src/app/data/progress.service';
import { ScheduledEventBase } from 'src/app/data/scheduledevent';
import { UserService } from 'src/app/data/user.service';
import { VirtualMachine } from 'src/app/data/virtualmachine';
import { VmService } from 'src/app/data/vm.service';
import { VmSet } from 'src/app/data/vmset';
import { VmSetService } from 'src/app/data/vmset.service';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';
import { environment } from 'src/environments/environment';
import { VmDashboardComponent } from './vm-dashboard.component';

type DashboardVmSet = VmDashboardComponent['vmSets'][number];

describe('VmDashboardComponent', () => {
  let component: VmDashboardComponent;
  let fixture: ComponentFixture<VmDashboardComponent>;
  let httpMock: HttpTestingController;
  let deleteModalSpy: jasmine.SpyObj<DeleteConfirmationComponent>;

  const vmServiceStub = {
    listByScheduledEvent: jasmine
      .createSpy('listByScheduledEvent')
      .and.returnValue(of([])),
  };
  const vmSetServiceStub = {
    getVMSetByScheduledEvent: jasmine
      .createSpy('getVMSetByScheduledEvent')
      .and.returnValue(of([])),
  };
  const userServiceStub = {
    list: jasmine.createSpy('list').and.returnValue(of([])),
  };
  const progressServiceStub = {
    listByScheduledEvent: jasmine
      .createSpy('listByScheduledEvent')
      .and.returnValue(of([])),
  };
  const routerStub = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    serializeUrl: jasmine.createSpy('serializeUrl'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VmDashboardComponent],
      providers: [
        { provide: VmService, useValue: vmServiceStub },
        { provide: VmSetService, useValue: vmSetServiceStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: ProgressService, useValue: progressServiceStub },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(VmDashboardComponent);
    component = fixture.componentInstance;
    component.selectedEvent = { id: 'event-1' } as ScheduledEventBase;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    deleteModalSpy = jasmine.createSpyObj<DeleteConfirmationComponent>(
      'DeleteConfirmationComponent',
      ['open'],
    );
    component.deleteModal = deleteModalSpy;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scope multi selection to the current accordion panel', () => {
    const firstVm = createVm('vm-1');
    const secondVm = createVm('vm-2');
    const firstSet = createVmSet('set-1', 'Set One', [firstVm]);
    const secondSet = createVmSet('set-2', 'Set Two', [secondVm]);

    component.vmSets = [firstSet, secondSet];

    component.updateSelectedVMs(firstSet, [firstVm]);
    component.updateSelectedVMs(secondSet, [secondVm]);

    expect(firstSet.selectedVMs).toEqual([]);
    expect(secondSet.selectedVMs).toEqual([secondVm]);
    expect(component.hasSelectedVMs(firstSet)).toBeFalse();
    expect(component.hasSelectedVMs(secondSet)).toBeTrue();
  });

  it('should open bulk delete confirmation with the selected VM count', () => {
    const firstVm = createVm('vm-1');
    const secondVm = createVm('vm-2');
    const vmSet = createVmSet('set-1', 'Set One', [firstVm, secondVm]);
    vmSet.selectedVMs = [firstVm, secondVm];

    component.openBulkDeleteConfirmation(vmSet);

    expect(component.deleteMessage).toBe(
      'Are you sure you want to delete 2 VMs?',
    );
    expect(deleteModalSpy.open).toHaveBeenCalled();
  });

  it('should delete all selected VMs for one panel and reset the loading state', () => {
    const firstVm = createVm('vm-1');
    const secondVm = createVm('vm-2');
    const vmSet = createVmSet('set-1', 'Set One', [firstVm, secondVm]);
    vmSet.selectedVMs = [firstVm, secondVm];
    component.vmSets = [vmSet];
    spyOn(component, 'getVmList');

    component.openBulkDeleteConfirmation(vmSet);
    component.handleDelete(true);

    expect(component.isBulkDeleteLoading(vmSet)).toBeTrue();

    const firstRequest = httpMock.expectOne(
      `${environment.server}/vm/${firstVm.id}`,
    );
    expect(firstRequest.request.method).toBe('DELETE');
    firstRequest.flush({ message: 'deleted successfully' });

    const secondRequest = httpMock.expectOne(
      `${environment.server}/vm/${secondVm.id}`,
    );
    expect(secondRequest.request.method).toBe('DELETE');
    secondRequest.flush({ message: 'deleted successfully' });

    expect(component.isBulkDeleteLoading(vmSet)).toBeFalse();
    expect(vmSet.selectedVMs).toEqual([]);
    expect(component.deleteMessage).toBe(
      'Are you sure you want to delete this VM?',
    );
    expect(component.getVmList).toHaveBeenCalled();
  });
});

function createVm(id: string): VirtualMachine {
  return {
    ...new VirtualMachine(),
    id,
    user: 'user@example.com',
  };
}

function createVmSet(
  id: string,
  baseName: string,
  setVMs: VirtualMachine[],
): DashboardVmSet {
  return {
    ...new VmSet(),
    id,
    base_name: baseName,
    environment: 'env-1',
    dynamic: false,
    selectedVMs: [],
    setVMs,
  };
}
