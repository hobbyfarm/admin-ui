import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnvironmentComponent } from './edit-environment.component';

describe('NewEnvironmentComponent', () => {
  let component: EditEnvironmentComponent;
  let fixture: ComponentFixture<EditEnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEnvironmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
