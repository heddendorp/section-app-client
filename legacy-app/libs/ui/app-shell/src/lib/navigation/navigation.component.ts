import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import {
  GetTenantInfoGQL,
  GetTenantInfoQuery,
  MembershipStatus,
  Role,
} from '@tumi/data-access';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'tumi-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  public Role = Role;
  public MembershipStatus = MembershipStatus;
  public tenant$: Observable<GetTenantInfoQuery['currentTenant']>;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private getTenantInfo: GetTenantInfoGQL
  ) {
    this.tenant$ = this.getTenantInfo
      .watch()
      .valueChanges.pipe(map(({ data }) => data.currentTenant));
  }

  async closeSidenav(drawer: MatSidenav): Promise<void> {
    const isHandset = await this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map((result) => result.matches),
        first()
      )
      .toPromise();
    if (isHandset) {
      await drawer.close();
    }
  }
}
