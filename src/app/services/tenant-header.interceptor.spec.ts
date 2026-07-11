import {
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TenantHeaderInterceptor } from './tenant-header.interceptor';

describe('TenantHeaderInterceptor', () => {
  let interceptor: TenantHeaderInterceptor;
  let next: HttpHandler;
  let handle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    interceptor = new TenantHeaderInterceptor();
    handle = vi.fn().mockReturnValue(of(new HttpResponse()));
    next = { handle } as HttpHandler;
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('adds the selected tenant to application requests with headers', () => {
    localStorage.setItem('tenantId', 'tumi');
    const request = new HttpRequest('POST', '/graphql', null, {
      headers: new HttpHeaders({ 'x-client-name': 'legacy-app' }),
    });

    interceptor.intercept(request, next).subscribe();

    const forwardedRequest = handle.mock.calls.at(
      -1,
    )?.[0] as HttpRequest<unknown>;
    expect(forwardedRequest.headers.get('x-tumi-tenant')).toBe('tumi');
    expect(forwardedRequest.headers.get('x-client-name')).toBe('legacy-app');
  });

  it('does not add a tenant header when no tenant is selected', () => {
    const request = new HttpRequest('GET', '/health', null, {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    });

    interceptor.intercept(request, next).subscribe();

    const forwardedRequest = handle.mock.calls.at(
      -1,
    )?.[0] as HttpRequest<unknown>;
    expect(forwardedRequest).toBe(request);
    expect(forwardedRequest.headers.has('x-tumi-tenant')).toBe(false);
  });

  it('leaves headerless requests untouched', () => {
    localStorage.setItem('tenantId', 'tumi');
    const request = new HttpRequest('GET', '/assets/icon.svg');

    interceptor.intercept(request, next).subscribe();

    expect(handle).toHaveBeenCalledTimes(1);
    expect(handle).toHaveBeenCalledWith(request);
    expect(request.headers.has('x-tumi-tenant')).toBe(false);
  });
});
