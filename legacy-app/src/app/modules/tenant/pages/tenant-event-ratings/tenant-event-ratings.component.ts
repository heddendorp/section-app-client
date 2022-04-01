import { Component, OnInit } from '@angular/core';
import {
  LoadEventsWithRatingGQL,
  LoadEventsWithRatingQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable, tap } from 'rxjs';

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
      .watch({ after: new Date(2022, 2, 0) })
      .valueChanges.pipe(
        map((result) => result.data.events),
        map((events) =>
          events.filter(
            (event) => event.participantRatings || event.organizerRatings
          )
        )
      );
  }
}
