import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { first, map, shareReplay, startWith } from 'rxjs/operators';
import { AuthService } from '@tumi/services';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  isAuthenticated$: Observable<boolean> = this.authService.authenticated$;
  isAdmin$: Observable<boolean> = this.authService.isAdmin$;
  isTutor$: Observable<boolean> = this.authService.isTutor$;
  isHandset$: Observable<boolean>;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      map((handset) => (isPlatformServer(platformId) ? true : handset)),
      shareReplay(1)
    );
  }

  public login(): Promise<void> {
    return this.authService.login();
  }

  public logout(): Promise<void> {
    return this.authService.logout();
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
