import { TestBed } from '@angular/core/testing';

import { RolebindingService } from './rolebinding.service';

describe('RolebindingService', () => {
  let service: RolebindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolebindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
