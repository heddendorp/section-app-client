import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TechnicalSupportComponent } from '../technical-support/technical-support.component';

@Component({
  selector: 'app-kaiserslautern-home',
  templateUrl: './kaiserslautern-home.component.html',
  styleUrls: ['./kaiserslautern-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TechnicalSupportComponent],
})
export class KaiserslauternHomeComponent {}
