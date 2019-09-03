import { TestBed } from '@angular/core/testing';

import { VmtemplateService } from './vmtemplate.service';

describe('VmtemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VmtemplateService = TestBed.get(VmtemplateService);
    expect(service).toBeTruthy();
  });
});
