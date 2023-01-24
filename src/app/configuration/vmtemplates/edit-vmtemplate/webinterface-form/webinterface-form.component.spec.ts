import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinterfaceFormComponent } from './webinterface-form.component';

describe('WebinterfaceFormComponent', () => {
  let component: WebinterfaceFormComponent;
  let fixture: ComponentFixture<WebinterfaceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebinterfaceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinterfaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
