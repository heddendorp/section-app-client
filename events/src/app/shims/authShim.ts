import { of } from 'rxjs';

export class AuthShim {
  public loginWithRedirect() {}
  public isAuthenticated$() {
    return of(false);
  }
}
