import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf, ViewportScroller } from '@angular/common';
import { TraceClassDecorator } from '@sentry/angular-ivy';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FooterComponent } from './modules/shared/components/footer/footer.component';
import { Router, RouterOutlet, Scroll } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { Settings } from 'luxon';

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
    NgForOf,
  ],
})
@TraceClassDecorator()
export class AppComponent {
  constructor(
    registry: MatIconRegistry,
    san: DomSanitizer,
    router: Router,
    // appRef: ApplicationRef,
    // updates: SwUpdate,
    // snackBar: MatSnackBar,
    viewportScroller: ViewportScroller,
    // @Inject(PLATFORM_ID) platform: any,
  ) {
    registry.addSvgIconSet(
      san.bypassSecurityTrustResourceUrl('./assets/icons/tumi.min.svg'),
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
    // const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable));
    // const updateCheckTimer$ = interval(0.5 * 2 * 60 * 1000);
    // const updateChecksOnceAppStable$ = concat(updateCheckTimer$);
    // if (
    //   environment.production &&
    //   isPlatformBrowser(platform) &&
    //   environment.version !== 'test'
    // ) {
    //   updateChecksOnceAppStable$.subscribe(() => updates.checkForUpdate());
    // }
    // updates.versionUpdates
    //   .pipe(
    //     filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
    //   )
    //   .subscribe((event) => {
    //     snackBar
    //       .openFromComponent(IconToastComponent, {
    //         duration: 0,
    //         data: {
    //           message: 'A new version of this app is available!',
    //           action: 'Activate now',
    //           icon: 'icon-available-updates',
    //         },
    //       })
    //       .onAction()
    //       .subscribe(() =>
    //         updates.activateUpdate().then(() => document.location.reload()),
    //       );
    //   });
  }
}
