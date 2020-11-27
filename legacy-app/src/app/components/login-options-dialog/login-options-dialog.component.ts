import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-options-dialog',
  template: `
    <h1 mat-dialog-title>Select Login Method</h1>
    <mat-dialog-content>
      <mat-action-list>
        <button mat-list-item mat-dialog-close="google">
          <mat-icon mat-list-icon svgIcon="icon-google-logo"></mat-icon>
          <h3 mat-line>Google Account</h3>
        </button>
        <button mat-list-item mat-dialog-close="facebook">
          <mat-icon mat-list-icon svgIcon="icon-facebook-new"></mat-icon>
          <h3 mat-line>Facebook Account</h3>
        </button>
        <button mat-list-item mat-dialog-close="microsoft">
          <mat-icon mat-list-icon svgIcon="icon-microsoft"></mat-icon>
          <h3 mat-line>Microsoft Account</h3>
        </button>
        <button mat-list-item mat-dialog-close="mail">
          <mat-icon mat-list-icon svgIcon="icon-email"></mat-icon>
          <h3 mat-line>With email</h3>
        </button>
      </mat-action-list>
      <p style="margin-top: 1rem;">
        We suggest logging in by using one of your existing social accounts.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginOptionsDialogComponent {
  constructor() {}
}
