import { Component, Input } from '@angular/core';
import { Scalars } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NgIf, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-event-list-item',
    templateUrl: './event-list-item.component.html',
    styleUrls: ['./event-list-item.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatListModule,
        RouterLink,
        UserChipComponent,
        DecimalPipe,
        IconURLPipe,
    ],
})
export class EventListItemComponent {
  @Input() event: any = null;

  constructor() {}

  formatDate(start: Scalars['DateTime'], end: Scalars['DateTime']) {
    const startDate = DateTime.fromISO(start);
    // Subtract 1min from end date to prevent midnight from counting as an extra day
    const endDate = DateTime.fromISO(end).minus({ minutes: 1 }).startOf('day');

    if (startDate.year === endDate.year) {
      if (startDate.month === endDate.month) {
        if (startDate.day === endDate.day) {
          return startDate.toFormat('LLL d, yyyy');
        }
        return `${startDate.toFormat('LLL d')}-${endDate.toFormat('d, yyyy')}`;
      } else {
        return `${startDate.toFormat('LLL d ')} - ${endDate.toFormat(
          'LLL d, yyyy'
        )}`;
      }
    } else {
      return `${startDate.toFormat('LLL d, yyyy')} - ${endDate.toFormat(
        'LLL d, yyyy'
      )}`;
    }
  }
}
