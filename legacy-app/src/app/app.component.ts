import { ApplicationRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, Observable, Subject, timer } from 'rxjs';
import { filter, first, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ScanRequestComponent } from './components/scan-request/scan-request.component';
import { IconToastComponent } from './shared/components/icon-toast/icon-toast.component';
import { AuthService } from './shared/services/auth.service';
import { sendEvent } from './shared/utility-functions';

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
    appRef: ApplicationRef,
    updates: SwUpdate,
    media: MediaObserver,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    registry.addSvgIconSet(san.bypassSecurityTrustResourceUrl('/assets/icons/set.svg'));
    this.isMobile$ = media.asObservable().pipe(
      map(checks => !!checks.filter(check => check.matches).find(match => match.mqAlias === 'xs')),
      startWith(false)
    );
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const updateCheckTimer$ = interval(0.5 * 2 * 60 * 1000);
    const updateChecksOnceAppStable$ = concat(appIsStable$, updateCheckTimer$);

    updateChecksOnceAppStable$.subscribe(() => updates.checkForUpdate());
    updates.available.subscribe(event => {
      sendEvent('found_update', { event_category: 'technical' });
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
        .pipe(tap(() => sendEvent('activate_update', { event_category: 'technical' })))
        .subscribe(() => updates.activateUpdate().then(() => document.location.reload()));
    });
  }

  ngOnInit(): void {
    if (!JSON.parse(localStorage.getItem('privacy_dismissed'))) {
      this.snackBar
        .openFromComponent(IconToastComponent, {
          duration: 20 * 1000,
          data: {
            message: 'This app uses analytics cookies to improve your experience',
            action: 'More Info',
            icon: 'about',
            allowClose: true
          }
        })
        .afterDismissed()
        .subscribe(({ dismissedByAction }) => {
          if (dismissedByAction) {
            this.router.navigate(['data-privacy']);
          } else {
            localStorage.setItem('privacy_dismissed', JSON.stringify(true));
          }
        });
    }

    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map((event: ActivationEnd) => event.snapshot.data.title || ''),
        takeUntil(this.destroyed$)
      )
      .subscribe(title => this.titleService.setTitle(`TUMi - ${title}`));
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
  }

  scanRequest() {
    this.dialog.open(ScanRequestComponent, { minWidth: '80vw' });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
