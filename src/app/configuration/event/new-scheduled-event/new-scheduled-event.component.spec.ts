import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScheduledEventComponent } from './new-scheduled-event.component';

describe('NewScheduledEventComponent', () => {
  let component: NewScheduledEventComponent;
  let fixture: ComponentFixture<NewScheduledEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewScheduledEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScheduledEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
