import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GetLandingPageStatisticsGQL } from '@tumi/legacy-app/generated/generated';
import { toSignal } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { map } from 'rxjs';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tenant-landing-page',
  templateUrl: './tenant-landing-page.component.html',
  styleUrls: ['./tenant-landing-page.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    CurrencyPipe,
    DecimalPipe,
  ],
})
export class TenantLandingPageComponent {
  private getLandingPageStatisticsGQL = inject(GetLandingPageStatisticsGQL);
  protected statistics = toSignal(
    this.getLandingPageStatisticsGQL
      .fetch({
        startDate: DateTime.local().minus({ months: 2 }).toISO(),
        middleDate: DateTime.local().minus({ months: 1 }).toISO(),
        endDate: DateTime.local().toISO(),
      })
      .pipe(
        map(({ data }) => data.rangeStatistics),
        map(
          ({
            registeredUsers,
            registeredUsersBefore,
            eventsStarted,
            eventsStartedBefore,
            registeredParticipants,
            registeredParticipantsBefore,
          }) => {
            return {
              registeredUsers: {
                current: registeredUsers,
                before: registeredUsersBefore,
                changePercentage:
                  (registeredUsers - registeredUsersBefore) /
                  registeredUsersBefore,
              },
              eventsStarted: {
                current: eventsStarted,
                before: eventsStartedBefore,
                changePercentage:
                  (eventsStarted - eventsStartedBefore) / eventsStartedBefore,
              },
              registeredParticipants: {
                current: registeredParticipants,
                before: registeredParticipantsBefore,
                changePercentage:
                  (registeredParticipants - registeredParticipantsBefore) /
                  registeredParticipantsBefore,
              },
            };
          },
        ),
      ),
  );
}
