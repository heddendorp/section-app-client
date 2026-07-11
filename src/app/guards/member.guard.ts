import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';

@Injectable({
  providedIn: 'root',
})
export class MemberGuard {
  constructor(private permissions: PermissionsService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.permissions.isMember();
  }

  canLoad():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.permissions.isMember();
  }
}
