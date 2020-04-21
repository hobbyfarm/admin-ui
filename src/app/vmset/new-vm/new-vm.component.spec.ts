import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVmComponent } from './new-vm.component';

describe('NewVmComponent', () => {
  let component: NewVmComponent;
  let fixture: ComponentFixture<NewVmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
