import { inject, Injectable } from '@angular/core';
import {
  GetAppStartupInfoGQL,
  GetAppStartupInfoQuery,
  HomePageStrategy,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private getAppStartupInfoGQL = inject(GetAppStartupInfoGQL);
  private auth = inject(AuthService);
  private _currencyCode: string | undefined;
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
  get currencyCode(): string | undefined {
    if (!this._currencyCode) console.error('Currency code not set');
    return this._currencyCode;
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

  public async init(): Promise<void> {
    const startupInfo = await firstValueFrom(this.getAppStartupInfoGQL.fetch());
    this._currencyCode = startupInfo.data?.currentTenant?.currency;
    this._banners = startupInfo.data?.currentTenant?.settings?.banners;
    this._formConfig =
      startupInfo.data?.currentTenant?.settings?.userDataCollection;
    this._navData = {
      homePageStrategy: startupInfo.data.currentTenant.homePageStrategy,
      homePageLink: startupInfo.data.currentTenant.homePageLink,
      showPWAInstall: startupInfo.data.currentTenant.settings.showPWAInstall,
      brandIconUrl: startupInfo.data.currentTenant.settings.brandIconUrl,
    };
  }
}
