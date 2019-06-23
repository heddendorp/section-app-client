import { Component, OnInit } from '@angular/core';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventSignupDialogComponent } from '../event-signup-dialog/event-signup-dialog.component';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;

  constructor(private eventService: EventService, private dialog: MatDialog) {}

  ngOnInit() {
    this.events$ = this.eventService.events;
  }

  openEventDialog(event: TumiEvent) {
    this.dialog.open(EventSignupDialogComponent, { data: { event } });
  }
}
