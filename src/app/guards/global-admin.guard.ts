import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

export const globalAdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.idTokenClaims$.pipe(
    map(
      (claims) =>
        claims &&
        claims['https://evorto.app/app_metadata'] &&
        claims['https://evorto.app/app_metadata'].globalAdmin === true,
    ),
  );
};
