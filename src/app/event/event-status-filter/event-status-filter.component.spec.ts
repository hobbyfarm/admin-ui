import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStatusFilterComponent } from './event-status-filter.component';

describe('EventStatusFilterComponent', () => {
  let component: EventStatusFilterComponent;
  let fixture: ComponentFixture<EventStatusFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventStatusFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
