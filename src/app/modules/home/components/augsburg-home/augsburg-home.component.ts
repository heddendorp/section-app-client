import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TechnicalSupportComponent } from '../technical-support/technical-support.component';

@Component({
  selector: 'app-augsburg-home',
  templateUrl: './augsburg-home.component.html',
  styleUrls: ['./augsburg-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TechnicalSupportComponent],
})
export class AugsburgHomeComponent {}
