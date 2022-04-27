import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { filter, retry, tap } from 'rxjs';
import { GetCurrentUserGQL } from '@tumi/legacy-app/generated/generated';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    router: Router,
    getUser: GetCurrentUserGQL
  ) {
    auth.isAuthenticated$.pipe(filter((auth) => auth)).subscribe(() => {
      getUser
        .fetch()
        .pipe(retry(3))
        .subscribe((user) => {
          if (
            !user.data.currentUser ||
            !user.data.currentUser.profileComplete
          ) {
            router.navigate(['/', 'profile', 'new']);
          }
        });
    });
  }
}
