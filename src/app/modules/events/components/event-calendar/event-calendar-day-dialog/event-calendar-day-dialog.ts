import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EventListQuery } from '@tumi/legacy-app/generated/generated';
import { EventsListComponent } from '../../events-list/events-list.component';

@Component({
  selector: 'app-event-calendar-day-dialog',
  templateUrl: './event-calendar-day-dialog.html',
  styleUrls: ['./event-calendar-day-dialog.scss'],
  standalone: true,
  imports: [MatDialogModule, EventsListComponent],
})
export class EventCalendarDayDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { events: EventListQuery['events'] },
  ) {}
}
