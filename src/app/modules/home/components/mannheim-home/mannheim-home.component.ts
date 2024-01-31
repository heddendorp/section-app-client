import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TechnicalSupportComponent } from '../technical-support/technical-support.component';

@Component({
  selector: 'app-mannheim-home',
  templateUrl: './mannheim-home.component.html',
  styleUrls: ['./mannheim-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TechnicalSupportComponent],
})
export class MannheimHomeComponent {}
