import { describe, expect, it } from 'vitest';

import { isGlobalAdminClaims } from './global-admin-claims';

describe('isGlobalAdminClaims', () => {
  it('rejects missing claims', () => {
    expect(isGlobalAdminClaims(undefined)).toBe(false);
    expect(isGlobalAdminClaims(null)).toBe(false);
  });

  it('rejects claims without a verified subject', () => {
    expect(
      isGlobalAdminClaims({
        'https://evorto.app/app_metadata': { globalAdmin: true },
      }),
    ).toBe(false);
    expect(
      isGlobalAdminClaims({
        sub: '',
        'https://evorto.app/app_metadata': { globalAdmin: true },
      }),
    ).toBe(false);
    expect(
      isGlobalAdminClaims({
        sub: '   ',
        'https://evorto.app/app_metadata': { globalAdmin: true },
      }),
    ).toBe(false);
  });

  it('rejects claims without the application metadata namespace', () => {
    expect(isGlobalAdminClaims({ sub: 'auth0|user' })).toBe(false);
  });

  it('rejects an explicit false global-admin claim', () => {
    expect(
      isGlobalAdminClaims({
        sub: 'auth0|user',
        'https://evorto.app/app_metadata': { globalAdmin: false },
      }),
    ).toBe(false);
  });

  it('accepts an explicit true global-admin claim with a subject', () => {
    expect(
      isGlobalAdminClaims({
        sub: 'auth0|admin',
        'https://evorto.app/app_metadata': { globalAdmin: true },
      }),
    ).toBe(true);
  });
});
