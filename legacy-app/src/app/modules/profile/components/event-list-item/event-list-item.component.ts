import { Component, Input } from '@angular/core';
import { Scalars } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss'],
})
export class EventListItemComponent {
  @Input() event: any = {};

  constructor() {}

  formatDate(start: Scalars['DateTime'], end: Scalars['DateTime']) {
    const startDate = DateTime.fromISO(start);
    // Subtract 1min from end date to prevent midnight from counting as an extra day
    const endDate = DateTime.fromISO(this.event.end)
      .minus({ minutes: 1 })
      .startOf('day');

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
