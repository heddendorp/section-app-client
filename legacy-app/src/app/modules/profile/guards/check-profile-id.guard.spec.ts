import { TestBed } from '@angular/core/testing';

import { CheckProfileIdGuard } from './check-profile-id.guard';

describe('CheckProfileIdGuard', () => {
  let guard: CheckProfileIdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckProfileIdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
