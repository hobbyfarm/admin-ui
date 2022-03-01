import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedCallComponent } from './timed-call.component';

describe('TimedCallComponent', () => {
  let component: TimedCallComponent;
  let fixture: ComponentFixture<TimedCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimedCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimedCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
