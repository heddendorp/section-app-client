import { inject, Injectable } from '@angular/core';
import {
  GetAppStartupInfoGQL,
  GetAppStartupInfoQuery,
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

  public async init(): Promise<void> {
    const startupInfo = await firstValueFrom(this.getAppStartupInfoGQL.fetch());
    this._currencyCode = startupInfo.data?.currentTenant?.currency;
    this._banners = startupInfo.data?.currentTenant?.settings?.banners;
    this._formConfig =
      startupInfo.data?.currentTenant?.settings?.userDataCollection;
  }
}
