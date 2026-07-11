import { inject, Injectable } from '@angular/core';
import {
  GetAppStartupInfoGQL,
  GetAppStartupInfoQuery,
  HomePageStrategy,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private getAppStartupInfoGQL = inject(GetAppStartupInfoGQL);
  private _currencyCode: string | undefined;
  private _contractEnd: Date | undefined;
  private _hardContractEnd = false;
  private _userIsAdmin = false;
  private _banners: GetAppStartupInfoQuery['currentTenant']['settings']['banners'] =
    [];
  private _formConfig: GetAppStartupInfoQuery['currentTenant']['settings']['userDataCollection'] =
    [];
  private _navData!: {
    homePageStrategy: HomePageStrategy;
    homePageLink: string | null | undefined;
    showPWAInstall: boolean;
    brandIconUrl: string | null | undefined;
  };
  private _timezone: string | undefined;
  private _user_metadata: any;
  private _app_metadata: any;

  get uiPreview() {
    return this._user_metadata?.uiPreview ?? false;
  }

  get currencyCode(): string | undefined {
    if (!this._currencyCode) console.error('Currency code not set');
    return this._currencyCode;
  }

  get timezone(): string | undefined {
    if (!this._timezone) console.error('Timezone not set');
    return this._timezone;
  }

  get banners(): GetAppStartupInfoQuery['currentTenant']['settings']['banners'] {
    return this._banners;
  }

  get formConfig(): GetAppStartupInfoQuery['currentTenant']['settings']['userDataCollection'] {
    return this._formConfig;
  }

  get navData() {
    return this._navData;
  }

  public set userIsAdmin(value: boolean) {
    this._userIsAdmin = value;
  }

  get contractEnded() {
    if (!this._contractEnd) return false;
    return this._contractEnd <= new Date();
  }

  get contractEndedForAdmin() {
    return this._userIsAdmin && this.contractEnded;
  }

  get contractEndedHard() {
    return this._hardContractEnd && this.contractEnded;
  }

  public setMetadata(user_metadata: any, app_metadata: any) {
    this._user_metadata = user_metadata;
    this._app_metadata = app_metadata;
    if (!app_metadata.uiPreview) {
      localStorage.removeItem('evorto_new_ui');
    }
  }

  public async init(): Promise<void> {
    const startupInfo = await firstValueFrom(this.getAppStartupInfoGQL.fetch());
    const tenant = startupInfo.data?.currentTenant;
    if (!tenant) {
      throw new Error('Failed to load application startup configuration');
    }

    this._currencyCode = tenant.currency;
    this._timezone = tenant.settings.timezone;
    this._banners = tenant.settings.banners;
    this._formConfig = tenant.settings.userDataCollection;
    this._navData = {
      homePageStrategy: tenant.homePageStrategy,
      homePageLink: tenant.homePageLink,
      showPWAInstall: tenant.settings.showPWAInstall,
      brandIconUrl: tenant.settings.brandIconUrl,
    };
    this._contractEnd = DateTime.fromISO(tenant.contractEnd)
      .endOf('day')
      .toJSDate();
    this._hardContractEnd = tenant.hardContractEnd;
  }
}
