import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InviteAuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const redirectPath = this.document.location.pathname
      ? this.document.location.pathname
      : '/';
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
