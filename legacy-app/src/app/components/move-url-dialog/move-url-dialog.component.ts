import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-move-url-dialog',
  templateUrl: './move-url-dialog.component.html',
  styleUrls: ['./move-url-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveUrlDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { isPwa: boolean }) {}

  isRunningStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  redirectUser() {
    window.location.replace('https://tumi.esn.world/?source=move');
  }
}
