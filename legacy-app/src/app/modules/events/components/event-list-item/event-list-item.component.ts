import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  EventListQuery,
  MembershipStatus,
  RegistrationMode,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListItemComponent {
  @Input() public event: EventListQuery['events'][0] | null = null;
  public RegistrationMode = RegistrationMode;
  public MembershipStatus = MembershipStatus;

  public notYetOpen() {
    return new Date(this.event?.registrationStart) > new Date();
  }

  public defaultPrice() {
    if (this.event?.prices) {
      return this.event?.prices.options.find((p: any) => p.defaultPrice);
    }
    return null;
  }
}
