import { TestBed } from '@angular/core/testing';

import { EventListResolver } from './event-list.resolver';

describe('EventListResolver', () => {
  let resolver: EventListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EventListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
