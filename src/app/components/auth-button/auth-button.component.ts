import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { filter, tap } from 'rxjs';
import { GetCurrentUserGQL } from '@tumi/legacy-app/generated/generated';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    AsyncPipe,
    NgOptimizedImage,
  ],
})
export class AuthButtonComponent {
  public userPicture: string = '';

  constructor(
    public auth: AuthService,
    private snackBar: MatSnackBar,
    router: Router,
    getUser: GetCurrentUserGQL,
  ) {
    auth.isAuthenticated$.pipe(filter((auth) => auth)).subscribe(() => {
      getUser
        .fetch()
        .pipe(
          tap((user) => {
            this.userPicture = user.data.currentUser?.picture || '';
            if (
              !user.data.currentUser ||
              !user.data.currentUser.profileComplete
            ) {
              void router.navigate(['/', 'profile', 'complete']);
            }
          }),
        )
        .subscribe({
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
