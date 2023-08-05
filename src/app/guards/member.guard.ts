import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';
import { MembershipStatus } from '@tumi/legacy-app/generated/generated';

@Injectable({
  providedIn: 'root',
})
export class MemberGuard  {
  constructor(private permissions: PermissionsService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.permissions.isMember();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.permissions.isMember();
  }
}
