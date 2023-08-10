import { ApplicationRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concat,
  filter,
  first,
  interval,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Location,
  NgIf,
  AsyncPipe,
  ViewportScroller,
  isPlatformBrowser,
} from '@angular/common';
import { TraceClassDecorator } from '@sentry/angular-ivy';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FooterComponent } from './modules/shared/components/footer/footer.component';
import { Router, RouterOutlet, Scroll } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings } from 'luxon';
import { environment } from '../environments/environment';
import { IconToastComponent } from '@tumi/legacy-app/modules/shared/components/icon-toast/icon-toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NavigationComponent,
    RouterOutlet,
    FooterComponent,
    AsyncPipe,
  ],
})
@TraceClassDecorator()
export class AppComponent {
  public appState: Observable<'ok' | 'down' | 'maintenance' | string>;
  public showNavigation$ = new BehaviorSubject(true);
  constructor(
    private http: HttpClient,
    private location: Location,
    registry: MatIconRegistry,
    san: DomSanitizer,
    router: Router,
    appRef: ApplicationRef,
    updates: SwUpdate,
    snackBar: MatSnackBar,
    viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) platform: any,
  ) {
    registry.addSvgIconSet(
      san.bypassSecurityTrustResourceUrl('./assets/icons/tumi.min.svg'),
    );
    this.location.onUrlChange((url) => {
      if (url.includes('orders/labels')) {
        this.showNavigation$.next(false);
      } else if (url.includes('orders/receipts')) {
        this.showNavigation$.next(false);
      } else {
        this.showNavigation$.next(true);
      }
    });
    this.appState = interval(5000).pipe(
      switchMap(() => this.http.get<{ maintenance: boolean }>('/health')),
      catchError((e) => {
        console.log(e);
        return of({ maintenance: false });
      }),
      map((status) => {
        if (status.maintenance) {
          return 'maintenance';
        } else if (!status.maintenance) {
          return 'down';
        } else {
          return 'ok';
        }
      }),
      startWith('ok'),
    );
    router.events
      .pipe(filter((e): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        if (e.position) {
          setTimeout(() => {
            e.position && viewportScroller.scrollToPosition(e.position);
          }, 0);
        } else if (e.anchor) {
          viewportScroller.scrollToAnchor(e.anchor);
        } else {
          viewportScroller.scrollToPosition([0, 0]);
        }
      });
    // set default Luxon locale
    Settings.defaultLocale = 'en';
    Settings.defaultZone = 'Europe/Berlin';
    const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable));
    const updateCheckTimer$ = interval(0.5 * 2 * 60 * 1000);
    const updateChecksOnceAppStable$ = concat(appIsStable$, updateCheckTimer$);
    if (
      environment.production &&
      isPlatformBrowser(platform) &&
      environment.version !== 'test'
    ) {
      updateChecksOnceAppStable$.subscribe(() => updates.checkForUpdate());
    }
    updates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      )
      .subscribe((event) => {
        snackBar
          .openFromComponent(IconToastComponent, {
            duration: 0,
            data: {
              message: 'A new version of this app is available!',
              action: 'Activate now',
              icon: 'icon-available-updates',
            },
          })
          .onAction()
          .subscribe(() =>
            updates.activateUpdate().then(() => document.location.reload()),
          );
      });
  }
}
