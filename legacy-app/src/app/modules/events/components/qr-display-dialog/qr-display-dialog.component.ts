import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-qr-display-dialog',
  templateUrl: './qr-display-dialog.component.html',
  styleUrls: ['./qr-display-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrDisplayDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; event: string; user: string }
  ) {}
}
