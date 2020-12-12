import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoveUrlDialogComponent } from '@tumi/components/move-url-dialog/move-url-dialog.component';
import { IconToastComponent } from '@tumi/modules/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    dialog: MatDialog,
    snack: MatSnackBar,
    @Inject(DOCUMENT) document: Document,
    @Inject(PLATFORM_ID) platform: any
  ) {
    if (
      isPlatformBrowser(platform) &&
      !document.location.host.includes('esn.world')
    ) {
      if (document.location.host.includes('localhost')) {
        snack
          .openFromComponent(IconToastComponent, {
            data: {
              message: 'Domain move notification blocked',
              action: 'show',
            },
          })
          .afterDismissed()
          .toPromise()
          .then(({ dismissedByAction }) => {
            if (dismissedByAction) {
              dialog.open(MoveUrlDialogComponent, {
                data: { isPwa: document.location.search.includes('pwa') },
              });
            }
          });
      } else {
        dialog.open(MoveUrlDialogComponent, {
          data: { isPwa: document.location.search.includes('pwa') },
        });
      }
    }
  }
}
