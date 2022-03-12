import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button
        (click)="startLogout()"
        class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-slate-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-slate-700"
      >
        Log out
      </button>
    </ng-container>
    <ng-template #loggedOut>
      <button
        (click)="startLogin()"
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
  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  startLogin() {
    const redirectPath = this.document.location.pathname
      ? this.document.location.pathname
      : '/';
    this.auth.loginWithRedirect({
      appState: { target: redirectPath },
    });
  }

  startLogout() {
    const redirectPath = this.document.location.origin;
    this.auth.logout({ returnTo: redirectPath });
  }
}
