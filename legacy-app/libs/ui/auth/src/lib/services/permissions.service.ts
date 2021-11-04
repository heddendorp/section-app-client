import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {
  MembershipStatus,
  Role,
  UserRolesGQL,
  UserRolesQuery,
} from '@tumi/data-access';
import { Observable, of } from 'rxjs';
import { filter, map, skipUntil, switchMap } from 'rxjs/operators';
import { Price } from '@tumi/shared/data-types';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private auth: AuthService, private userRoles: UserRolesGQL) {}

  public hasStatus(allowList: MembershipStatus[]): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      skipUntil(this.auth.isLoading$.pipe(filter((loading) => !loading))),
      switchMap((authenticated) => {
        if (!authenticated) {
          return of(false);
        }
        return this.userRoles.watch().valueChanges.pipe(
          map(({ data }) => data.currentUser),
          map((user: UserRolesQuery['currentUser']) => {
            if (!user) {
              return false;
            }
            return allowList.includes(
              user.currentTenant?.status ?? MembershipStatus.None
            );
          })
        );
      })
    );
  }

  public hasRole(allowList: Role[]): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      skipUntil(this.auth.isLoading$.pipe(filter((loading) => !loading))),
      switchMap((authenticated) => {
        if (!authenticated) {
          return of(false);
        }
        return this.userRoles.watch().valueChanges.pipe(
          map(({ data }) => data.currentUser),
          map((user: UserRolesQuery['currentUser']) => {
            if (!user) {
              return false;
            }
            return allowList.includes(user.currentTenant?.role ?? Role.User);
          })
        );
      })
    );
  }

  getPricesForUser(prices: Price[]): Observable<Price[]> {
    return this.auth.isAuthenticated$.pipe(
      skipUntil(this.auth.isLoading$.pipe(filter((loading) => !loading))),
      switchMap((authenticated) => {
        if (!authenticated) {
          return of([]);
        }
        return this.userRoles.watch().valueChanges.pipe(
          map(({ data }) => data.currentUser),
          map((user: UserRolesQuery['currentUser']) => {
            if (!user) {
              return [];
            }
            return prices.filter((price) => {
              if (price.defaultPrice) return true;
              let esnFulfilled;
              if (price.esnCardRequired) {
                esnFulfilled = user.hasESNcard;
              } else {
                esnFulfilled = true;
              }
              return (
                esnFulfilled &&
                price.allowedStatusList.includes(
                  user.currentTenant?.status ?? MembershipStatus.None
                )
              );
            });
          })
        );
      })
    );
  }
}
