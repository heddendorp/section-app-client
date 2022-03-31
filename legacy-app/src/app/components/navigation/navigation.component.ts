import { Component, Inject } from '@angular/core';
import {
  GetTenantInfoGQL,
  GetTenantInfoQuery,
  MembershipStatus,
  Role,
} from '../../generated/generated';
import { first, map, Observable, ReplaySubject, shareReplay } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public Role = Role;
  public MembershipStatus = MembershipStatus;
  public tenant$: Observable<GetTenantInfoQuery['currentTenant']>;
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
    private breakpointObserver: BreakpointObserver,
    private getTenantInfo: GetTenantInfoGQL,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.tenant$ = this.getTenantInfo
      .watch()
      .valueChanges.pipe(map(({ data }) => data.currentTenant));
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
