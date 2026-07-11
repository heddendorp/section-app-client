import { TestBed } from '@angular/core/testing';
import {
  Currency,
  GetAppStartupInfoGQL,
  GetAppStartupInfoQuery,
  HomePageStrategy,
} from '@tumi/legacy-app/generated/generated';
import { of } from 'rxjs';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let startupResult: { data?: GetAppStartupInfoQuery };
  let fetchSpy: Mock;

  const startupInfo: GetAppStartupInfoQuery = {
    currentTenant: {
      id: 'tenant-1',
      currency: Currency.Eur,
      homePageStrategy: HomePageStrategy.Link,
      homePageLink: 'https://example.test',
      contractEnd: '2099-12-31T12:00:00.000Z',
      hardContractEnd: false,
      settings: {
        showPWAInstall: true,
        timezone: 'Europe/Berlin',
        brandIconUrl: 'https://example.test/icon.svg',
        userDataCollection: [
          { label: 'Diet', options: ['Vegan'], type: 'select' },
        ],
        banners: [
          {
            title: 'Notice',
            body: 'Test notice',
            color: 'blue',
            link: 'https://example.test/notice',
            displayToMembershipStatus: [],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    startupResult = { data: startupInfo };
    fetchSpy = vi.fn(() => of(startupResult));

    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        {
          provide: GetAppStartupInfoGQL,
          useValue: { fetch: fetchSpy },
        },
      ],
    });
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('loads the startup settings used during application bootstrap', async () => {
    const service = TestBed.inject(ConfigService);

    await service.init();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(service.currencyCode).toBe(Currency.Eur);
    expect(service.timezone).toBe('Europe/Berlin');
    expect(service.banners).toEqual(startupInfo.currentTenant.settings.banners);
    expect(service.formConfig).toEqual(
      startupInfo.currentTenant.settings.userDataCollection,
    );
    expect(service.navData).toEqual({
      homePageStrategy: HomePageStrategy.Link,
      homePageLink: 'https://example.test',
      showPWAInstall: true,
      brandIconUrl: 'https://example.test/icon.svg',
    });
    expect(service.contractEnded).toBe(false);
    expect(service.contractEndedHard).toBe(false);
  });

  it('fails bootstrap when the tenant configuration is missing', async () => {
    startupResult = { data: undefined };
    const service = TestBed.inject(ConfigService);

    await expect(service.init()).rejects.toThrow(
      'Failed to load application startup configuration',
    );
  });

  it('exposes contract-end state separately for admins and hard expiry', async () => {
    startupResult = {
      data: {
        currentTenant: {
          ...startupInfo.currentTenant,
          contractEnd: '2000-01-01T12:00:00.000Z',
          hardContractEnd: true,
        },
      },
    };
    const service = TestBed.inject(ConfigService);

    await service.init();

    expect(service.contractEnded).toBe(true);
    expect(service.contractEndedForAdmin).toBe(false);
    expect(service.contractEndedHard).toBe(true);

    service.userIsAdmin = true;
    expect(service.contractEndedForAdmin).toBe(true);
  });

  it('clears the preview preference when metadata disables preview access', () => {
    localStorage.setItem('evorto_new_ui', 'true');
    const service = TestBed.inject(ConfigService);

    service.setMetadata({ uiPreview: false }, { uiPreview: false });

    expect(service.uiPreview).toBe(false);
    expect(localStorage.getItem('evorto_new_ui')).toBeNull();
  });
});
