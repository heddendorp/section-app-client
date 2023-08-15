import { Component } from '@angular/core';
import {
  LoadEventsWithRatingGQL,
  LoadEventsWithRatingQuery,
} from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { RatingItemComponent } from '../../../../shared/components/rating-item/rating-item.component';
import { EventChipComponent } from '../../../../shared/components/event-chip/event-chip.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-event-ratings',
  templateUrl: './tenant-event-ratings.component.html',
  styleUrls: ['./tenant-event-ratings.component.scss'],
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    ResetScrollDirective,
    NgIf,
    MatProgressBarModule,
    MatTableModule,
    EventChipComponent,
    NgFor,
    RatingItemComponent,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class TenantEventRatingsComponent {
  public events$: Observable<LoadEventsWithRatingQuery['events']>;
  public displayedColumns = ['event', 'organizer', 'participant'];

  constructor(private loadEventsWithRatingGQL: LoadEventsWithRatingGQL) {
    this.events$ = this.loadEventsWithRatingGQL
      .watch({ after: DateTime.local().minus({ months: 1 }).toISO() })
      .valueChanges.pipe(
        map((result) => result.data.events),
        map((events) =>
          events.filter(
            (event) => event.participantRating || event.organizerRating,
          ),
        ),
      );
  }
}
