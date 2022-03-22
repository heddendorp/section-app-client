import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-icon-toast',
  templateUrl: './icon-toast.component.html',
  styleUrls: ['./icon-toast.component.scss'],
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
