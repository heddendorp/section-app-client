import { TestBed } from '@angular/core/testing';

import { MoneyService } from './money.service';

describe('MoneyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoneyService = TestBed.get(MoneyService);
    expect(service).toBeTruthy();
  });
});
