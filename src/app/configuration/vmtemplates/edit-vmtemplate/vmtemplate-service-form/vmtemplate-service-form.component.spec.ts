import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VMTemplateServiceFormComponent } from './vmtemplate-service-form.component';

describe('VMTemplateServiceFormComponent', () => {
  let component: VMTemplateServiceFormComponent;
  let fixture: ComponentFixture<VMTemplateServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VMTemplateServiceFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VMTemplateServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
