import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Subject, timer } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  constructor(
    private san: DomSanitizer,
    private registry: MatIconRegistry,
    private snackBar: MatSnackBar,
    private update: SwUpdate
  ) {
    registry.addSvgIconSet(san.bypassSecurityTrustResourceUrl('/assets/icons/set.svg'));
  }
  ngOnInit(): void {
    timer(60000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.update.available.pipe(first()).subscribe(() => {
          this.snackBar
            .open('A new version of this app is available!', 'Activate now')
            .afterDismissed()
            .subscribe(dismiss => {
              if (dismiss.dismissedByAction) {
                this.update.activateUpdate().then(() => document.location.reload());
              }
            });
        });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
