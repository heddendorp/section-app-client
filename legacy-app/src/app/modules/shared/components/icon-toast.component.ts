import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-icon-toast',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="1rem">
      <mat-icon
        *ngIf="data.icon"
        [svgIcon]="data.icon"
        class="snack-icon"
      ></mat-icon>
      <span class="mat-body-1">{{ data.message }}</span>
      <button (click)="dismiss()" *ngIf="data.action" color="accent" mat-button>
        {{ data.action }}
      </button>
      <button (click)="cancel()" *ngIf="data.allowClose" mat-icon-button>
        <mat-icon svgIcon="cancel"></mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      mat-icon.snack-icon {
        width: 32px;
        height: 32px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconToastComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      icon?: string;
      action?: string;
      message: string;
      allowClose?: boolean;
    },
    private snackbarRef: MatSnackBarRef<IconToastComponent>
  ) {}

  dismiss(): void {
    this.snackbarRef.dismissWithAction();
  }

  cancel(): void {
    this.snackbarRef.dismiss();
  }
}
