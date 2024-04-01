import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { filter, switchMap, tap } from 'rxjs';
import { GetCurrentUserGQL, Role } from '@tumi/legacy-app/generated/generated';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ConfigService } from '@tumi/legacy-app/services/config.service';

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
    config: ConfigService,
  ) {
    auth.isAuthenticated$.pipe(filter((auth) => auth)).subscribe(() => {
      getUser
        .fetch()
        .pipe(
          tap(async (res) => {
            const user = res.data.currentUser;
            if (user) {
              // @ts-ignore
              await window.clarity('identify', user.id);
              // @ts-ignore
              await window.clarity('set', 'status', user.status);
              // @ts-ignore
              await window.clarity('set', 'role', user.role);
              if (user.role === Role.Admin) {
                // @ts-ignore
                await window.clarity('upgrade', 'isAdmin');
              }
            }
          }),
          tap((user) => {
            this.userPicture = user.data.currentUser?.picture || '';
            if (
              !user.data.currentUser ||
              !user.data.currentUser.profileComplete
            ) {
              if (!location.pathname.includes('/page')) {
                void router.navigate(['/', 'profile', 'complete']);
              }
            }
          }),
          switchMap(() => auth.idTokenClaims$),
        )
        .subscribe({
          next: (claims) => {
            if (claims) {
              config.setMetadata(
                claims['https://evorto.app/app_metadata'],
                claims['https://evorto.app/user_metadata'],
              );
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
