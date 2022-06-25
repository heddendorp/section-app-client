import { Component, Input, OnInit } from '@angular/core';
import { TumiEvent } from '@tumi/legacy-app/generated/generated';
import { DateTime, Duration } from 'luxon';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss'],
})
export class EventListItemComponent implements OnInit {
  @Input() event: any = {};
  @Input() showTime: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  isMultiDay() {
    // Subtract 1min from end date to prevent midnight from counting as an extra day
    return (
      DateTime.fromISO(this.event.start).startOf('day').toISODate() !==
      DateTime.fromISO(this.event.end)
        .minus(Duration.fromMillis(60e3))
        .startOf('day')
        .toISODate()
    );
  }
}
