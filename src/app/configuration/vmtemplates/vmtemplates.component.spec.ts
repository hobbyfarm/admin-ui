import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmtemplatesComponent } from './vmtemplates.component';

describe('VmtemplatesComponent', () => {
  let component: VmtemplatesComponent;
  let fixture: ComponentFixture<VmtemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmtemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VmtemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
