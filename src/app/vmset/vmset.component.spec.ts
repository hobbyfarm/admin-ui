import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsetComponent } from './vmset.component';

describe('VmsetComponent', () => {
  let component: VmsetComponent;
  let fixture: ComponentFixture<VmsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
