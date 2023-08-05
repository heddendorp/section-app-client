import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TechnicalSupportComponent } from '../technical-support/technical-support.component';

@Component({
  selector: 'app-vub-ehb-home',
  templateUrl: './vub-ehb-home.component.html',
  styleUrls: ['./vub-ehb-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TechnicalSupportComponent],
})
export class VubEhbHomeComponent {}
