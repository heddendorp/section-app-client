import { TestBed } from '@angular/core/testing';

import { EventDataResolver } from './event-data.resolver';

describe('EventDataService', () => {
  let service: EventDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDataResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
