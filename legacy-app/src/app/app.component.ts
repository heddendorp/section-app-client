/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { ApplicationRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { concat, fromEvent, interval, Observable, Subject } from 'rxjs';
import { filter, first, map, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { slideInAnimation } from './animation';
import { CartDialogComponent } from './components/cart-dialog/cart-dialog.component';
import { ScanRequestComponent } from './components/scan-request/scan-request.component';
import { IconToastComponent } from './shared/components/icon-toast/icon-toast.component';
import { AuthService } from './shared/services/auth.service';
import { CartService } from './shared/services/cart.service';
import { gtagConfig, sendEvent } from './shared/utility-functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  isMobile$: Observable<boolean>;
  authenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isTutor$: Observable<boolean>;
  isEditor$: Observable<boolean>;
  savedEvents$: Observable<number>;
  color$: Observable<ThemePalette>;
  class$: Observable<string>;
  @ViewChild(MatSidenav, { static: true }) sidenav: MatSidenav;

  constructor(
    san: DomSanitizer,
    registry: MatIconRegistry,
    appRef: ApplicationRef,
    updates: SwUpdate,
    media: MediaObserver,
    mediaMatcher: MediaMatcher,
    @Inject(DOCUMENT) private document: Document,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private cartService: CartService
  ) {
    registry.addSvgIconSet(san.bypassSecurityTrustResourceUrl('/assets/icons/set.svg'));
    this.isMobile$ = media.asObservable().pipe(
      map(checks => !!checks.filter(check => check.matches).find(match => match.mqAlias === 'xs')),
      startWith(false)
    );
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const updateCheckTimer$ = interval(0.5 * 2 * 60 * 1000);
    const updateChecksOnceAppStable$ = concat(/*appIsStable$,*/ updateCheckTimer$);
    if (environment.production) {
      updateChecksOnceAppStable$.subscribe(() => updates.checkForUpdate());
    }
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
    fromEvent<MediaQueryListEvent>(mediaMatcher.matchMedia('(prefers-color-scheme: dark)'), 'change')
      /*.pipe(startWith(mediaMatcher.matchMedia('(prefers-color-scheme: dark)')))*/
      .subscribe(event => {
        if (event.matches) {
          this.loadStyle('dark.css');
        } else {
          this.loadStyle('light.css');
        }
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
        tap(() => gtagConfig({ page_path: location.pathname })),
        withLatestFrom(this.isMobile$),
        map(([event, mobile]) => {
          if (mobile) {
            this.sidenav.close();
          }
          return event;
        }),
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
    this.savedEvents$ = this.cartService.eventCount;
  }

  scanRequest() {
    this.dialog.open(ScanRequestComponent, { minWidth: '95vw', autoFocus: true });
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }

  openCart() {
    this.dialog.open(CartDialogComponent);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  private loadStyle(styleName: string) {
    const themeLink = this.document.getElementById('client-theme') as HTMLLinkElement;
    themeLink.href = styleName;
  }
}
