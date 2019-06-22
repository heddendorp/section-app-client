import { TestBed } from '@angular/core/testing';

import { TutorService } from './tutor.service';

describe('TutorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TutorService = TestBed.get(TutorService);
    expect(service).toBeTruthy();
  });
});
