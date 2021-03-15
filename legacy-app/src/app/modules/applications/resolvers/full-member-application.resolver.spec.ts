import { TestBed } from '@angular/core/testing';

import { FullMemberApplicationResolver } from './full-member-application.resolver';

describe('FullMemberApplicationResolver', () => {
  let resolver: FullMemberApplicationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FullMemberApplicationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
