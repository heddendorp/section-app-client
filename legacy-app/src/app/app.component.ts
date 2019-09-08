import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Observable, Subject, timer } from 'rxjs';
import { filter, first, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ScanRequestComponent } from './components/scan-request/scan-request.component';
import { IconToastComponent } from './shared/components/icon-toast/icon-toast.component';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  isMobile$: Observable<boolean>;
  authenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isTutor$: Observable<boolean>;
  isEditor$: Observable<boolean>;
  color$: Observable<ThemePalette>;
  class$: Observable<string>;
  @ViewChild(MatSidenav, { static: true }) sidenav: MatSidenav;

  constructor(
    san: DomSanitizer,
    registry: MatIconRegistry,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private update: SwUpdate,
    private authService: AuthService,
    private router: Router,
    media: MediaObserver
  ) {
    registry.addSvgIconSet(san.bypassSecurityTrustResourceUrl('/assets/icons/set.svg'));
    this.isMobile$ = media.asObservable().pipe(
      map(checks => !!checks.filter(check => check.matches).find(match => match.mqAlias === 'xs')),
      startWith(false)
    );
  }

  ngOnInit(): void {
    this.color$ = this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      map<ActivationEnd, ThemePalette>(event => {
        if (event.snapshot.data.standalone) {
          return;
        } else {
          return 'primary';
        }
      }),
      startWith('primary')
    );
    this.class$ = this.color$.pipe(map(theme => (theme ? '' : 'dark-theme')));
    this.authenticated$ = this.authService.authenticated;
    this.isAdmin$ = this.authService.isAdmin;
    this.isTutor$ = this.authService.isTutor;
    this.isEditor$ = this.authService.isEditor;
    timer(1000, 60000)
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(() => this.update.available.pipe(first()))
      )
      .subscribe(() => {
        this.snackBar
          .openFromComponent(IconToastComponent, {
            duration: 0,
            data: {
              message: 'A new version of this app is available!',
              action: 'Activate now',
              icon: 'update'
            }
          })
          .onAction()
          .subscribe(() => this.update.activateUpdate().then(() => document.location.reload()));
      });
  }

  scanRequest() {
    this.dialog.open(ScanRequestComponent, { minWidth: '80vw' });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
