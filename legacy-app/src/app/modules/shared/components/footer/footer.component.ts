import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  GetTenantInfoGQL,
  GetTenantInfoQuery,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public tenantInfo$: Observable<GetTenantInfoQuery['currentTenant']>;
  constructor(private getTenantInfoGQL: GetTenantInfoGQL) {
    this.tenantInfo$ = this.getTenantInfoGQL
      .watch()
      .valueChanges.pipe(map((r) => r.data.currentTenant));
  }
}
