import { of } from 'rxjs';

export class AuthShim {
  public loginWithRedirect() {}
  public get isAuthenticated$() {
    return of(false);
  }
}
