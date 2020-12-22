import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login-options-dialog',
  template: `
    <h1 class="text-lg font-bold" mat-dialog-title>Select Login Method</h1>
    <mat-dialog-content class="relative">
      <mat-action-list
        [disabled]="askAccept | ngrxPush"
        [class.disabled]="askAccept | ngrxPush"
      >
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
      <div
        *ngIf="askAccept | ngrxPush"
        class="absolute inset-y-4 inset-x-10 h-52"
        fxLayout="column"
        fxLayoutAlign="space-evenly center"
      >
        <p class="font-bold text-lg">
          You're accepting our
          <a class="styled" routerLink="/page/privacy" target="_blank"
            >Privacy Policy</a
          >
          by logging in.
        </p>
        <button mat-flat-button (click)="acceptPrivacy()">Continue</button>
      </div>
      <p style="margin-top: 1rem;">
        We suggest logging in by using one of your existing social accounts.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-action-list.disabled {
        filter: blur(3px);
      }
      mat-action-list {
        transition: filter 0.3s ease-in-out;
        filter: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginOptionsDialogComponent {
  askAccept = new BehaviorSubject(true);
  acceptPrivacy(): void {
    this.askAccept.next(false);
  }
}
