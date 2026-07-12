import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';
import { isGlobalAdminClaims } from './global-admin-claims';

export const globalAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.idTokenClaims$.pipe(map(isGlobalAdminClaims));
};
