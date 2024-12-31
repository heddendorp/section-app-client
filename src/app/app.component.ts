import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FooterComponent } from './modules/shared/components/footer/footer.component';
import { Router, RouterOutlet, Scroll } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { Settings } from 'luxon';
import { NavComponent } from '@tumi/legacy-app/components/nav/nav.component';
import { ConfigService } from '@tumi/legacy-app/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NavigationComponent, RouterOutlet, FooterComponent, NavComponent],
})
export class AppComponent {
  constructor(
    registry: MatIconRegistry,
    san: DomSanitizer,
    router: Router,
    viewportScroller: ViewportScroller,
    config: ConfigService,
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
    const timezone = config.timezone;
    if (timezone) {
      Settings.defaultZone = timezone;
    }
  }

  protected newUI = !!localStorage.getItem('evorto_new_ui');
}
