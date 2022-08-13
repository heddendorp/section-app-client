import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  EventListQuery,
  MembershipStatus,
  RegistrationMode,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-events-list-item',
  templateUrl: './events-list-item.component.html',
  styleUrls: ['./events-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListItemComponent {
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

  public tutorSpotsClass() {
    if (!this.event) {
      return '';
    }
    if (this.event.organizersRegistered / this.event.organizerLimit < 0.1) {
      return 'text-red-500 font-semibold';
    }
    if (this.event.organizersRegistered >= this.event.organizerLimit) {
      return 'text-slate-500 font-normal';
    }
    return 'text-yellow-500 font-semibold';
  }

  public freeSpotsStyling(freeParticipantSpots: string) {
    if (freeParticipantSpots.includes('full')) {
      return 'bg-red-200 text-red-800';
    }
    if (freeParticipantSpots.includes('Many')) {
      return 'bg-green-200 text-green-800';
    }
    return 'bg-orange-200 text-orange-800';
  }
}
