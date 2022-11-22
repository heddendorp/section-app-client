import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventListQuery } from '@tumi/legacy-app/generated/generated';

@Component({
  selector: 'app-event-calendar-day-dialog',
  templateUrl: './event-calendar-day-dialog.html',
  styleUrls: ['./event-calendar-day-dialog.scss'],
})
export class EventCalendarDayDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { events: EventListQuery['events'] }
  ) {}
}
