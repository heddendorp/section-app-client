import { TestBed } from '@angular/core/testing';

import { TenantHeaderInterceptor } from './tenant-header.interceptor';

describe('TenantHeaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TenantHeaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TenantHeaderInterceptor = TestBed.inject(TenantHeaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
