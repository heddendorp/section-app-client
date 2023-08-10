import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class GridComponent {
  @Input() minWidth = '400px';
  @Input() maxWidth = '1fr';
  @Input() gap = '1rem';
}
