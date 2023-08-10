import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-qr-display-dialog',
  templateUrl: './qr-display-dialog.component.html',
  styleUrls: ['./qr-display-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgOptimizedImage],
})
export class QrDisplayDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; event: string; user: string },
  ) {}
}
