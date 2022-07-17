import { Component } from '@angular/core';
import {
  LoadEventsWithRatingGQL,
  LoadEventsWithRatingQuery,
} from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-event-ratings',
  templateUrl: './tenant-event-ratings.component.html',
  styleUrls: ['./tenant-event-ratings.component.scss'],
})
export class TenantEventRatingsComponent {
  public events$: Observable<LoadEventsWithRatingQuery['events']>;
  public displayedColumns = ['event', 'organizer', 'participant'];

  constructor(private loadEventsWithRatingGQL: LoadEventsWithRatingGQL) {
    this.events$ = this.loadEventsWithRatingGQL
      .watch({ after: DateTime.local().minus({ months: 1 }).toJSDate() })
      .valueChanges.pipe(
        map((result) => result.data.events),
        map((events) =>
          events.filter(
            (event) => event.participantRatings || event.organizerRatings
          )
        ),
        map((events) =>
          events.map((event) => ({
            ...event,
            voteCount: event.participantRegistrations.filter(
              (registration) => registration.rating
            ).length,
            participantRegistrations: event.participantRegistrations.filter(
              (registration) => registration.userComment
            ),
            organizerVotes: event.organizerRegistrations.filter(
              (registration) => registration.rating
            ).length,
            organizerRegistrations: event.organizerRegistrations.filter(
              (registration) => registration.userComment
            ),
          }))
        )
      );
  }
}
