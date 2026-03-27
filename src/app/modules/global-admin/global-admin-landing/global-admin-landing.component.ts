import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-global-admin-landing',
  imports: [RouterLink, MatIcon],
  templateUrl: './global-admin-landing.component.html',
  styleUrl: './global-admin-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalAdminLandingComponent {}
