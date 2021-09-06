import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { GetCurrentUserGQL } from '@tumi/data-access';
import { Router } from '@angular/router';

@Component({
  selector: 'tumi-auth-button',
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
    auth.user$.subscribe(() => {
      getUser.fetch().subscribe((user) => {
        if (!user.data.currentUser) {
          router.navigateByUrl('/profile/new');
        }
      });
    });
  }
}
