import { TestBed } from '@angular/core/testing';

import { USerService } from './user.service';

describe('USerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: USerService = TestBed.get(USerService);
    expect(service).toBeTruthy();
  });
});
