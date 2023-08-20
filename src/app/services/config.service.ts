import { inject, Injectable } from '@angular/core';
import { GetTenantCurrencyCodeGQL } from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private getTenantCurrencyCodeGQL = inject(GetTenantCurrencyCodeGQL);
  private _currencyCode: string | undefined;

  get currencyCode(): string | undefined {
    if (!this._currencyCode) console.error('Currency code not set');
    return this._currencyCode;
  }

  public async init(): Promise<void> {
    this._currencyCode = await firstValueFrom(
      this.getTenantCurrencyCodeGQL
        .fetch()
        .pipe(map((result) => result.data.currentTenant.currency)),
    );
  }
}
