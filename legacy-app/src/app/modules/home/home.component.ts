import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetHomePageTenantInfoGQL } from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected shortName$: Observable<string>;

  constructor(getHomePageTenantInfoGQL: GetHomePageTenantInfoGQL) {
    this.shortName$ = getHomePageTenantInfoGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.currentTenant.shortName));
  }
}
