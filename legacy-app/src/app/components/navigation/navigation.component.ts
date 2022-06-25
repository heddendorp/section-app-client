import { Component, Inject } from '@angular/core';
import {
  GetTenantInfoGQL,
  GetTenantInfoQuery,
  MembershipStatus,
  Role,
} from '../../generated/generated';
import {
  first,
  map,
  Observable,
  ReplaySubject,
  share,
  shareReplay,
} from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public Role = Role;
  public MembershipStatus = MembershipStatus;
  public tenant$: Observable<GetTenantInfoQuery['currentTenant']>;
  public outstandingRating$: Observable<boolean>;
  public installEvent$ = new ReplaySubject<
    Event & { prompt: () => Promise<void> }
  >(1);
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    public auth: AuthService,
    private breakpointObserver: BreakpointObserver,
    private getTenantInfo: GetTenantInfoGQL,
    @Inject(DOCUMENT) public document: Document
  ) {
    const tenantChanges = this.getTenantInfo.watch().valueChanges.pipe(share());
    this.tenant$ = tenantChanges.pipe(map(({ data }) => data.currentTenant));
    this.outstandingRating$ = tenantChanges.pipe(
      map(({ data }) => data.currentUser?.outstandingRating ?? false)
    );
    const { defaultView } = document;
    if (defaultView) {
      defaultView.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.installEvent$.next(e as Event & { prompt: () => Promise<void> });
      });
    }
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
