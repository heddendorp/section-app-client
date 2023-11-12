import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  GetTenantInfoGQL,
  GetTenantInfoQuery,
} from '@tumi/legacy-app/generated/generated';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [NgFor, RouterLink, AsyncPipe, IconURLPipe, NgOptimizedImage],
})
export class FooterComponent {
  public tenantInfo$: Observable<GetTenantInfoQuery['currentTenant']>;
  constructor(private getTenantInfoGQL: GetTenantInfoGQL) {
    this.tenantInfo$ = this.getTenantInfoGQL
      .watch()
      .valueChanges.pipe(map((r) => r.data.currentTenant));
  }
}
