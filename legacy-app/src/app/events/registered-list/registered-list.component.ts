import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-registered-list',
  templateUrl: './registered-list.component.html',
  styleUrls: ['./registered-list.component.scss']
})
export class RegisteredListComponent implements OnInit {
  upcomingEvents$: Observable<TumiEvent[]>;
  passedEvents$: Observable<TumiEvent[]>;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.upcomingEvents$ = this.eventService.registeredEvents.pipe(
      map(events => events.filter(event => event.start.isAfter()))
    );
    this.passedEvents$ = this.eventService.registeredEvents.pipe(
      map(events => events.filter(event => event.start.isBefore()))
    );
  }
}
