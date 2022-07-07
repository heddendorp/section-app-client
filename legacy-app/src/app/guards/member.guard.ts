import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';
import { MembershipStatus } from '@tumi/legacy-app/generated/generated';

@Injectable({
  providedIn: 'root',
})
export class MemberGuard implements CanActivate, CanLoad {
  constructor(private permissions: PermissionsService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isMember();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isMember();
  }
  isMember() {
    return this.permissions.hasStatus([
      MembershipStatus.Alumni,
      MembershipStatus.Full,
      MembershipStatus.Sponsor,
      MembershipStatus.Trial,
    ]);
  }
}
