import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TechnicalSupportComponent } from '../technical-support/technical-support.component';

@Component({
  selector: 'app-cu-prague-home',
  templateUrl: './cu-prague-home.component.html',
  styleUrls: ['./cu-prague-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TechnicalSupportComponent],
})
export class CuPragueHomeComponent {}
