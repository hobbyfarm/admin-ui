import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScenarioComponent } from './add-scenario.component';

describe('AddScenarioComponent', () => {
  let component: AddScenarioComponent;
  let fixture: ComponentFixture<AddScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScenarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
