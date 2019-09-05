import { TestBed } from '@angular/core/testing';

import { PDFService } from './pdf.service';

describe('PDFService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PDFService = TestBed.get(PDFService);
    expect(service).toBeTruthy();
  });
});
