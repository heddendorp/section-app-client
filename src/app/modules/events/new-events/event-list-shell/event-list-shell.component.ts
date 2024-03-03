import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  GetEventListForShellGQL,
  PublicationState,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { IfRoleDirective } from '@tumi/legacy-app/modules/shared/directives/if-role.directive';
import { MatAnchor, MatFabAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { DatePipe } from '@angular/common';
import { groupBy, sortBy } from 'lodash-es';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-event-list-shell',
  standalone: true,
  imports: [
    RouterLink,
    IfRoleDirective,
    MatFabAnchor,
    MatIcon,
    MatAnchor,
    RouterOutlet,
    IconURLPipe,
    RouterLinkActive,
    DatePipe,
  ],
  templateUrl: './event-list-shell.component.html',
  styleUrl: './event-list-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListShellComponent {
  protected readonly Role = Role;
  protected readonly PublicationState = PublicationState;
  private getEventListForShellGQL = inject(GetEventListForShellGQL);
  protected days = toSignal(
    this.getEventListForShellGQL.watch().valueChanges.pipe(
      map(({ data }) => data.events),
      map((events) => {
        const eventsByStartDate = groupBy(events, (event) =>
          DateTime.fromISO(event.start).toISODate(),
        );
        console.log(eventsByStartDate);

        return sortBy(Object.keys(eventsByStartDate)).map((date) => ({
          date,
          events: eventsByStartDate[date],
        }));
      }),
    ),
  );
}
