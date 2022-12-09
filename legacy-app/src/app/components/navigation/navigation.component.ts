import { Component } from '@angular/core';
import {
  GetTenantInfoGQL,
  GetTenantInfoQuery,
  HomePageStrategy,
  MembershipStatus,
  Role,
} from '../../generated/generated';
import { map, Observable, ReplaySubject, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public Role = Role;
  public MembershipStatus = MembershipStatus;
  public tenantInfo$: Observable<GetTenantInfoQuery['currentTenant']>;
  public HomePageStrategy = HomePageStrategy;
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
    private getTenantInfoGQL: GetTenantInfoGQL
  ) {
    const { defaultView } = document;
    if (defaultView) {
      defaultView.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.installEvent$.next(e as Event & { prompt: () => Promise<void> });
      });
    }
    this.tenantInfo$ = this.getTenantInfoGQL
      .watch()
      .valueChanges.pipe(map((r) => r.data.currentTenant));
  }

  preventProp($event: MouseEvent) {
    $event.stopPropagation();
  }
}
