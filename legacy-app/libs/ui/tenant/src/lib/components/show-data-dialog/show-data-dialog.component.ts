import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetLogsQuery } from '@tumi/data-access';

@Component({
  selector: 'tumi-show-data-dialog',
  templateUrl: './show-data-dialog.component.html',
  styleUrls: ['./show-data-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDataDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: GetLogsQuery['logs'][0]) {}
}
