import { Injectable } from '@angular/core';
import {
  MembershipStatus,
  Role,
  UserRolesGQL,
  UserRolesQuery,
} from '@tumi/legacy-app/generated/generated';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  skipUntil,
  switchMap,
} from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { Price } from '@tumi/legacy-app/utils';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(
    private auth: AuthService,
    private userRoles: UserRolesGQL,
  ) {}

  isAdmin() {
    return this.hasRole([Role.Admin]);
  }

  isMember() {
    return this.hasStatus([
      MembershipStatus.Alumni,
      MembershipStatus.Full,
      MembershipStatus.Sponsor,
      MembershipStatus.Trial,
    ]);
  }

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
              user.currentTenant?.status ?? MembershipStatus.None,
            );
          }),
        );
      }),
      distinctUntilChanged(),
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
          }),
        );
      }),
      distinctUntilChanged(),
    );
  }

  getPricesForUser(prices: Price[]): Observable<Price[]> {
    if (!prices) {
      return of([]);
    }
    return this.auth.isAuthenticated$.pipe(
      skipUntil(this.auth.isLoading$.pipe(filter((loading) => !loading))),
      switchMap((authenticated) => {
        if (!authenticated) {
          const defaultPrice = prices.find((price) => price.defaultPrice);
          if (defaultPrice) {
            return of([defaultPrice]);
          }
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
                esnFulfilled = user.hasESNCard;
              } else {
                esnFulfilled = true;
              }
              return (
                esnFulfilled &&
                price.allowedStatusList.includes(
                  user.currentTenant?.status ?? MembershipStatus.None,
                )
              );
            });
          }),
        );
      }),
    );
  }
}
