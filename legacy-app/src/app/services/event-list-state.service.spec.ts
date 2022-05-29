import { TestBed } from '@angular/core/testing';

import { EventListStateService } from './event-list-state.service';

describe('EventListStateService', () => {
  let service: EventListStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventListStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
