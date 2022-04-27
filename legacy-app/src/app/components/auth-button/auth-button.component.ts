import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { filter, retry, tap } from 'rxjs';
import { GetCurrentUserGQL } from '@tumi/legacy-app/generated/generated';
import { Router } from '@angular/router';
import { retryBackoff } from 'backoff-rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private snackBar: MatSnackBar,
    router: Router,
    getUser: GetCurrentUserGQL
  ) {
    auth.isAuthenticated$.pipe(filter((auth) => auth)).subscribe(() => {
      getUser
        .fetch()
        .pipe(retryBackoff({ initialInterval: 100, maxRetries: 5 }))
        .subscribe({
          next: (user) => {
            if (
              !user.data.currentUser ||
              !user.data.currentUser.profileComplete
            ) {
              router.navigate(['/', 'profile', 'new']);
            }
          },
          error: (err) => {
            console.log(err);
            this.snackBar
              .open('Error loading user', 'Reload Page', { duration: 0 })
              .afterDismissed()
              .subscribe(() => {
                window.location.reload();
              });
          },
        });
    });
  }
}
