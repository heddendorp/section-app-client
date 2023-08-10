import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  LoadEventsWithBookingGQL,
  LoadEventsWithBookingQuery,
  RegistrationMode,
} from '@tumi/legacy-app/generated/generated';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { EventChipComponent } from '../../../../shared/components/event-chip/event-chip.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-event-bookings-page',
  templateUrl: './tenant-event-bookings-page.component.html',
  styleUrls: ['./tenant-event-bookings-page.component.scss'],
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
    AsyncPipe,
    DatePipe,
    ExtendDatePipe,
  ],
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
              (event) => event.registrationMode === RegistrationMode.Stripe,
            )
            .filter(
              (event) =>
                !(
                  event.countedParticipantRegistrations ===
                    event.participantRegistrationCount &&
                  event.participantRegistrationCount === event.participantLimit
                ),
            ),
        ),
        /*map((events) =>
          events.filter(
            (event) => event.participantRating || event.organizerRating
          )
        )*/
      );
  }
}
