import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  LoadEventsWithBookingGQL,
  LoadEventsWithBookingQuery,
  LoadEventsWithRatingGQL,
  LoadEventsWithRatingQuery,
  RegistrationMode,
} from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-tenant-event-bookings-page',
  templateUrl: './tenant-event-bookings-page.component.html',
  styleUrls: ['./tenant-event-bookings-page.component.scss'],
})
export class TenantEventBookingsPageComponent {
  public events$: Observable<LoadEventsWithBookingQuery['events']>;
  public displayedColumns = ['event', 'start', 'spots', 'registrations'];

  constructor(private loadEventsWithBookingGQL: LoadEventsWithBookingGQL) {
    this.events$ = this.loadEventsWithBookingGQL
      .watch({ after: new Date(/*2022, 2, 0*/) })
      .valueChanges.pipe(
        map((result) => result.data.events),
        map((events) =>
          events
            .filter(
              (event) => event.registrationMode === RegistrationMode.Stripe
            )
            .filter(
              (event) =>
                !(
                  event.countedParticipantRegistrations ===
                    event.participantRegistrationCount &&
                  event.participantRegistrationCount === event.participantLimit
                )
            )
        )
        /*map((events) =>
          events.filter(
            (event) => event.participantRating || event.organizerRating
          )
        )*/
      );
  }
}
