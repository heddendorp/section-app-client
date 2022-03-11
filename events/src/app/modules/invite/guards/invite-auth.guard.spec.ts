import { TestBed } from '@angular/core/testing';

import { InviteAuthGuard } from './invite-auth.guard';

describe('InviteAuthGuard', () => {
  let guard: InviteAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InviteAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
