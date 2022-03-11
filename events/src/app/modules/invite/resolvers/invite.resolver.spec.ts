import { TestBed } from '@angular/core/testing';

import { InviteResolver } from './invite.resolver';

describe('InviteResolver', () => {
  let resolver: InviteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InviteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
