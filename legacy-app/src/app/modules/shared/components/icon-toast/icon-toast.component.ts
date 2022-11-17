import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatLegacySnackBarRef as MatSnackBarRef,
} from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-icon-toast',
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
