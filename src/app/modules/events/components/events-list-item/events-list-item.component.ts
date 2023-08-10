import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  EventListQuery,
  MembershipStatus,
  RegistrationMode,
} from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { ExtendDatePipe as ExtendDatePipe_1 } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatIconModule } from '@angular/material/icon';
import {
  CurrencyPipe,
  DatePipe,
  LowerCasePipe,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-events-list-item',
  templateUrl: './events-list-item.component.html',
  styleUrls: ['./events-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatRippleModule,
    RouterLink,
    NgIf,
    MatIconModule,
    LowerCasePipe,
    CurrencyPipe,
    DatePipe,
    ExtendDatePipe_1,
    IconURLPipe,
    NgOptimizedImage,
  ],
})
export class EventsListItemComponent {
  @Input() public event: EventListQuery['events'][0] | null = null;
  public RegistrationMode = RegistrationMode;
  public MembershipStatus = MembershipStatus;

  public notYetOpen() {
    /*if (this.event?.couldBeOrganizer) {
      return new Date(this.event?.organizerRegistrationStart) > new Date();
    }*/
    return new Date(this.event?.registrationStart) > new Date();
  }

  public registrationDate() {
    if (!this.event) {
      return '';
    }
    const date = DateTime.fromISO(this.event.registrationStart);
    if (date.startOf('day') <= DateTime.local().startOf('day')) {
      return `at ${date.toFormat('HH:mm')}`;
    }
    return date.toFormat('EEE, d MMM');
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
      return 'text-red-600 font-medium';
    }
    if (this.event.organizersRegistered >= this.event.organizerLimit) {
      return 'text-zinc-600 font-medium';
    }
    return 'text-amber-600 font-medium';
  }

  public freeSpotsStyling(
    participantRegistrationCount: number,
    participantLimit: number,
  ) {
    const quota = participantRegistrationCount / participantLimit;
    if (quota < 0.5) {
      return 'bg-green-300 text-green-800';
    } else if (quota < 0.8) {
      return 'bg-amber-300 text-amber-800';
    } else if (quota < 1) {
      return 'bg-orange-300 text-orange-800';
    } else if (participantLimit - participantRegistrationCount === 1) {
      return 'bg-red-300 text-red-800';
    } else {
      return 'bg-zinc-300 text-zinc-800';
    }
  }

  public freeSpotsIcon(
    participantRegistrationCount: number,
    participantLimit: number,
  ) {
    const quota = participantRegistrationCount / participantLimit;
    if (quota < 0.5) {
      return 'icon-0-percents';
    } else if (quota < 0.8) {
      return 'icon-50-percents';
    } else if (quota < 1) {
      return 'icon-50-percents';
    } else if (participantLimit - participantRegistrationCount === 1) {
      return 'icon-360-degrees';
    } else {
      return 'icon-360-degrees';
    }
  }

  public freeSpotsString(
    participantRegistrationCount: number,
    participantLimit: number,
    couldBeOrganizer: boolean,
  ) {
    const quota = participantRegistrationCount / participantLimit;
    if (couldBeOrganizer) {
      return `${participantRegistrationCount}/${participantLimit}`;
    }
    if (quota < 0.5) {
      return 'Many free spots';
    } else if (quota < 0.8) {
      return 'Some spots left';
    } else if (quota < 1) {
      return 'Few spots left';
    } else if (participantLimit - participantRegistrationCount === 1) {
      return 'One spot left';
    } else {
      return 'Event is full';
    }
  }

  public publicationStateString(publicationState: string) {
    if (publicationState === 'DRAFT') {
      return 'Draft';
    } else if (publicationState === 'APPROVAL') {
      return 'Ready for approval';
    } else if (publicationState === 'ORGANIZERS') {
      return 'Visible to tutors';
    } else {
      return;
    }
  }
}
