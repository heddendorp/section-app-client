import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  EventListQuery,
  MembershipStatus,
  RegistrationMode,
} from '@tumi/legacy-app/generated/generated';
import { ExtendDatePipe } from '../../../../modules/shared/pipes/extended-date.pipe';
import { DateTime } from 'luxon';

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

  constructor(private datePipe: ExtendDatePipe) {}

  public notYetOpen() {
    if (this.event?.couldBeOrganizer) {
      return new Date(this.event?.organizerRegistrationStart) > new Date();
    }
    return new Date(this.event?.registrationStart) > new Date();
  }

  public registrationDate() {
    if (!this.event) {
      return '';
    }
    const date = this.event.couldBeOrganizer
      ? DateTime.fromISO(this.event.organizerRegistrationStart)
      : DateTime.fromISO(this.event.registrationStart);
    if (date.startOf('day') <= DateTime.local().startOf('day')) {
      return date.toFormat('HH:mm');
    }
    return this.datePipe.transform(this.event.registrationStart, 'shortDate');
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

  public freeSpotsString(participantRegistrationCount: number, participantLimit: number) {
    const quota = participantRegistrationCount / participantLimit;
    if (quota < 0.5) {
      return 'Many free spots';
    } else if (quota < 0.8) {
      return 'Some spots left';
    } else if (participantLimit - participantRegistrationCount === 1) {
      return 'One spot left';
    } else if (quota < 1) {
      return 'Few spots left';
    } else {
      return 'Event is full';
    }
  }
}
