import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SETTINGS_ROUTES } from '@tumi/legacy-app/modules/settings/settings.routes';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings-tabs',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, MatIconModule],
  templateUrl: './settings-tabs.component.html',
  styleUrl: './settings-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsComponent {
  protected tabs = SETTINGS_ROUTES[0].children.map((tab) => ({
    title: tab.data?.['title'],
    icon: tab.data?.['icon'],
    path: tab.path,
  }));
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  redirectToTab(event: Event) {
    if (event.target instanceof HTMLSelectElement) {
      void this.router.navigate([event.target.value], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
