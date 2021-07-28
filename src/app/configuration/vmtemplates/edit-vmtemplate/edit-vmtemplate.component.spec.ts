import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVmtemplateComponent } from './edit-vmtemplate.component';

describe('EditVmtemplateComponent', () => {
  let component: EditVmtemplateComponent;
  let fixture: ComponentFixture<EditVmtemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVmtemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVmtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
