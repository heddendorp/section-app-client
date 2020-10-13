import { TestBed } from '@angular/core/testing';

import { MoneyService } from './money.service';

describe('MoneyService', () => {
  let service: MoneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
