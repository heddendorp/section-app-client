import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Observable, Subject, timer } from 'rxjs';
import { first, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaObserver } from '@angular/flex-layout';
import { AuthService } from './shared/services/auth.service';
import { IconToastComponent } from './shared/components/icon-toast/icon-toast.component';
import { MatDialog } from '@angular/material/dialog';
import { ScanRequestComponent } from './components/scan-request/scan-request.component';
import { RouterOutlet } from '@angular/router';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ThemePalette } from '@angular/material/core';
import { MatSidenav } from '@angular/material/sidenav';
import { PaPageComponent } from './pages/pa-page/pa-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  isMobile$: Observable<boolean>;
  authenticated$: Observable<boolean>;
  signedUp$: Observable<boolean>;
  admin$: Observable<boolean>;
  tutor$: Observable<boolean>;
  editor$: Observable<boolean>;
  color$: Observable<ThemePalette>;
  class$: Observable<string>;
  @ViewChild(RouterOutlet, { static: true }) outlet: RouterOutlet;
  @ViewChild(MatSidenav, { static: true }) sidenav: MatSidenav;

  constructor(
    san: DomSanitizer,
    registry: MatIconRegistry,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private update: SwUpdate,
    private authService: AuthService,
    media: MediaObserver
  ) {
    registry.addSvgIconSet(san.bypassSecurityTrustResourceUrl('/assets/icons/set.svg'));
    this.isMobile$ = media.asObservable().pipe(
      map(checks => !!checks.filter(check => check.matches).find(match => match.mqAlias === 'xs')),
      startWith(false)
    );
  }

  ngOnInit(): void {
    this.color$ = this.outlet.activateEvents.pipe(
      map<any, ThemePalette>(component => {
        if (component instanceof AboutPageComponent || component instanceof PaPageComponent) {
          return;
        } else {
          return 'primary';
        }
      }),
      startWith('primary')
    );
    this.class$ = this.color$.pipe(map(theme => (theme ? '' : 'dark-theme')));
    this.authenticated$ = this.authService.authenticated;
    this.signedUp$ = this.authService.signedUp;
    this.admin$ = this.authService.isAdmin;
    this.tutor$ = this.authService.isTutor;
    this.editor$ = this.authService.isEditor;
    timer(1000, 60000)
      .pipe(
        tap(() => console.log('timer')),
        takeUntil(this.destroyed$),
        switchMap(() => this.update.available.pipe(first()))
      )
      .subscribe(() => {
        console.log('Found an update');
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
