import { CanActivateFn, Router } from '@angular/router';
import { ConfigService } from '@tumi/legacy-app/services/config.service';
import { inject } from '@angular/core';

export const contractEndGuard: CanActivateFn = () => {
  const config = inject(ConfigService);
  if (config.contractEndedHard) {
    return inject(Router).createUrlTree(['/expired']);
  }
  return true;
};
