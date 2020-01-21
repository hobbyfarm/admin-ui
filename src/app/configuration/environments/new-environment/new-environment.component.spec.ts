import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEnvironmentComponent } from './new-environment.component';

describe('NewEnvironmentComponent', () => {
  let component: NewEnvironmentComponent;
  let fixture: ComponentFixture<NewEnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEnvironmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
