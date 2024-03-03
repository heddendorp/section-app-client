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
import { NavComponent } from '@tumi/legacy-app/components/nav/nav.component';

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
    NavComponent,
  ],
})
@TraceClassDecorator()
export class AppComponent {
  constructor(
    registry: MatIconRegistry,
    san: DomSanitizer,
    router: Router,
    viewportScroller: ViewportScroller,
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
    Settings.defaultLocale = 'en';
    Settings.defaultZone = 'Europe/Berlin';
  }

  protected newUI = !!localStorage.getItem('evorto_new_ui');
}
