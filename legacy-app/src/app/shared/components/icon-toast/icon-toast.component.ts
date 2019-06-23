import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-icon-toast',
  templateUrl: './icon-toast.component.html',
  styleUrls: ['./icon-toast.component.scss']
})
export class IconToastComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { icon?: string; action?: string; message: string },
    private snackbarRef: MatSnackBarRef<IconToastComponent>
  ) {}

  dismiss() {
    this.snackbarRef.dismissWithAction();
  }
}
