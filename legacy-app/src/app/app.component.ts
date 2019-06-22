import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  isMobile$: BehaviorSubject<boolean>;

  constructor(
    san: DomSanitizer,
    registry: MatIconRegistry,
    private snackBar: MatSnackBar,
    private update: SwUpdate,
    media: MediaObserver
  ) {
    this.isMobile$ = new BehaviorSubject<boolean>(media.isActive('xs'));
    registry.addSvgIconSet(san.bypassSecurityTrustResourceUrl('/assets/icons/set.svg'));
    // TODO: Get rid of the behaviour subject and subscription
    media
      .asObservable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(checks => {
        if (checks.filter(check => check.matches).find(match => match.mqAlias === 'xs')) {
          this.isMobile$.next(true);
        } else {
          this.isMobile$.next(false);
        }
      });
  }

  ngOnInit(): void {
    timer(0, 60000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        console.info('Checking for update');
        this.update.available.pipe(first()).subscribe(() => {
          console.info('Update found');
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
