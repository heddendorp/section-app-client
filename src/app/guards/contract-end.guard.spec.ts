import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ConfigService } from '@tumi/legacy-app/services/config.service';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { contractEndGuard } from './contract-end.guard';

describe('contractEndGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  let config: { contractEndedHard: boolean };
  let expiredUrl: UrlTree;
  let createUrlTree: Mock;

  beforeEach(() => {
    config = { contractEndedHard: false };
    expiredUrl = {} as UrlTree;
    createUrlTree = vi.fn().mockReturnValue(expiredUrl);

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: config },
        { provide: Router, useValue: { createUrlTree } },
      ],
    });
  });

  it('allows navigation while the contract is active', () => {
    const result = TestBed.runInInjectionContext(() =>
      contractEndGuard(route, state),
    );

    expect(result).toBe(true);
    expect(createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects hard-expired tenants to the explanation page', () => {
    config.contractEndedHard = true;

    const result = TestBed.runInInjectionContext(() =>
      contractEndGuard(route, state),
    );

    expect(result).toBe(expiredUrl);
    expect(createUrlTree).toHaveBeenCalledTimes(1);
    expect(createUrlTree).toHaveBeenCalledWith(['/expired']);
  });
});
