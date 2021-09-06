import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { GetTenantsGQL } from '@tumi/data-access';

@Component({
  selector: 'tumi-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    getTenants: GetTenantsGQL
  ) {
    auth.user$.subscribe((user) => {
      console.log(user);
    });
    getTenants.watch().valueChanges.subscribe((res) => console.log(res));
  }
}
