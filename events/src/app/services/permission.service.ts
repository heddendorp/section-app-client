import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {
  GetPermissionsGQL,
  MembershipStatus,
  Role,
} from '@tumi/events/graphQL';
import { map, Observable, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionRef;

  constructor(
    private auth: AuthService,
    private getPermissionsGQL: GetPermissionsGQL
  ) {
    this.permissionRef = this.getPermissionsGQL.watch();
    this.auth.isAuthenticated$.subscribe(() => this.permissionRef.refetch());
  }

  public hasStatus(
    ...allowList: (keyof typeof MembershipStatus)[]
  ): Observable<boolean> {
    return this.permissionRef.valueChanges.pipe(
      map((res) => {
        const currentStatus = res.data?.currentUser?.currentTenant?.status;
        if (!currentStatus) {
          return false;
        }
        return allowList
          .map((key) => MembershipStatus[key])
          .includes(currentStatus);
      }),
      share()
    );
  }

  public hasRole(...allowList: (keyof typeof Role)[]): Observable<boolean> {
    return this.permissionRef.valueChanges.pipe(
      map((res) => {
        const currentStatus = res.data?.currentUser?.currentTenant?.role;
        if (!currentStatus) {
          return false;
        }
        return allowList.map((key) => Role[key]).includes(currentStatus);
      }),
      share()
    );
  }
}
