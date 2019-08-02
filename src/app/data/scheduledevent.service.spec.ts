import { TestBed } from '@angular/core/testing';

import { ScheduledeventService } from './scheduledevent.service';

describe('ScheduledeventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduledeventService = TestBed.get(ScheduledeventService);
    expect(service).toBeTruthy();
  });
});
