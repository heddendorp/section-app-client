import { TestBed } from '@angular/core/testing';

import { CheckTemplateIdGuard } from './check-template-id.guard';

describe('CheckTemplateIdGuard', () => {
  let guard: CheckTemplateIdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckTemplateIdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
