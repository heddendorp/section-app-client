import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadEventQuery, Role } from '@tumi/data-access';
import { PermissionsService } from '../../../../../auth/src/lib/services/permissions.service';
import { Price } from '@tumi/shared/data-types';

@Component({
  selector: 'tumi-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventHeaderComponent {
  public Role = Role;
  @Input() public event: LoadEventQuery['event'] | null = null;
  @Input() public bestPrice: Price | null = null;
  isSingleDayEvent() {
    return (
      this.event &&
      new Date(this.event.start).getDay() === new Date(this.event.end).getDay()
    );
  }
}
