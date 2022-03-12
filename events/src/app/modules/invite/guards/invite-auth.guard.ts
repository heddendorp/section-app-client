import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InviteAuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (isPlatformServer(this.platformId)) {
      return true;
    }
    const redirectPath = state.url;
    return this.auth.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          console.log('Not logged in, logging in with path: ', redirectPath);
          this.auth.loginWithRedirect({
            appState: { target: redirectPath },
          });
        }
      })
    );
  }
}
