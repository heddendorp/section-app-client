import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadEventQuery, Role } from '@tumi/data-access';

@Component({
  selector: 'tumi-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventHeaderComponent {
  public Role = Role;
  @Input() public event: LoadEventQuery['event'] | null = null;
}
