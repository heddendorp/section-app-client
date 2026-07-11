import { Provider } from '@angular/core';
import { AuthGuard, AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

const localTestAuth = {
  error$: of(null),
  idTokenClaims$: of(null),
  isAuthenticated$: of(false),
  isLoading$: of(false),
  user$: of(null),
  getAccessTokenSilently: () => of(''),
  loginWithRedirect: () => of(undefined),
  logout: () => of(undefined),
};

const localTestAuthGuard = {
  canActivate: () => false,
  canActivateChild: () => false,
  canLoad: () => false,
};

export function provideLocalTestAuth(): Provider[] {
  return [
    { provide: AuthService, useValue: localTestAuth },
    { provide: AuthGuard, useValue: localTestAuthGuard },
  ];
}
