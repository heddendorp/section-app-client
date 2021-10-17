import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PhotoShare } from '@tumi/data-access';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tumi-photo-details-dialog',
  templateUrl: './photo-details-dialog.component.html',
  styleUrls: ['./photo-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { photo: PhotoShare }) {}
}
