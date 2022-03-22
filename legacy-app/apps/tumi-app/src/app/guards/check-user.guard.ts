import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GetCurrentUserGQL } from '@tumi/data-access';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckUserGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private getCurrentUser: GetCurrentUserGQL
  ) {}
  private redirectWithoutUser(): Observable<UrlTree | boolean> {
    return this.getCurrentUser.fetch().pipe(
      map(({ data }) => {
        if (data.currentUser) {
          return true;
        } else {
          return this.router.parseUrl('/profile/new');
        }
      })
    );
  }

  canActivate(): Observable<UrlTree | boolean> {
    return this.redirectWithoutUser();
  }

  canLoad(): Observable<UrlTree | boolean> {
    return this.redirectWithoutUser();
  }
}
