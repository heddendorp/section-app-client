import { TestBed } from '@angular/core/testing';

import { CheckEventIdGuard } from './check-event-id.guard';

describe('CheckProfileIdGuard', () => {
  let guard: CheckEventIdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckEventIdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
