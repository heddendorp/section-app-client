import { Component, OnInit } from '@angular/core';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventSignupDialogComponent } from '../event-signup-dialog/event-signup-dialog.component';
import { map } from 'rxjs/operators';
import { getFreeSpots } from '../../shared/utility-functions';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;

  constructor(private eventService: EventService, private dialog: MatDialog) {}

  ngOnInit() {
    this.events$ = this.eventService.publicEvents.pipe(
      map(events => events.map(event => Object.assign(event, { freeSpots: getFreeSpots(event) })))
    );
  }

  openEventDialog(event: TumiEvent) {
    this.dialog.open(EventSignupDialogComponent, { data: { event } });
  }
}
