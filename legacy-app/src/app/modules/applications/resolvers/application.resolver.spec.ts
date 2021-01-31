import { TestBed } from '@angular/core/testing';

import { ApplicationResolver } from './application.resolver';

describe('ApplicationResolver', () => {
  let resolver: ApplicationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ApplicationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
