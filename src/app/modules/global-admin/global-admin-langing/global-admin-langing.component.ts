import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-global-admin-langing',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './global-admin-langing.component.html',
  styleUrl: './global-admin-langing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalAdminLangingComponent {}
