import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/remote-config';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from '@tumi/models';
import { AuthService } from '@tumi/services';
import { Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { version } from '../../../../package.json';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  isAuthenticated$: Observable<boolean> = this.authService.authenticated$;
  user$: Observable<User> = this.authService.user$;
  isHandset$: Observable<boolean>;
  showTutorApplication$: Observable<boolean>;
  appVersion = version;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private remoteConfig: AngularFireRemoteConfig,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      map((handset) => (isPlatformServer(platformId) ? true : handset)),
      shareReplay(1)
    );
    this.showTutorApplication$ = this.remoteConfig.booleans.showTutorApplication;
  }

  public login(): Promise<boolean> {
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
