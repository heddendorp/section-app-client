import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService, EventService } from '@tumi/services';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private events: EventService, private auth: AuthService) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const id = route.paramMap.get('id');
    if (id !== null) {
      try {
        await this.events.getOne$(id).pipe(first()).toPromise();
      } catch (e) {
        console.log(e);
        return await this.auth.login();
      }
      return true;
    }
    return false;
  }
}
