import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-icon-toast',
    templateUrl: './icon-toast.component.html',
    styleUrls: ['./icon-toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatIconModule,
        MatButtonModule,
    ],
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
