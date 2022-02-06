import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button
        (click)="auth.logout()"
        class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700"
      >
        Log out
      </button>
    </ng-container>
    <ng-template #loggedOut>
      <button
        (click)="auth.loginWithRedirect()"
        class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
      >
        Log in
      </button>
    </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthButtonComponent {
  constructor(public auth: AuthService) {}
}
