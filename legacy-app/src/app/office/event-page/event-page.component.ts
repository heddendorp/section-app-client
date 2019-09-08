import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../shared/services/event.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.events$ = this.eventService.events;
  }

  createNewEvent() {
    this.eventService.createEvent().then(id => this.router.navigate(['/', 'office', 'events', 'edit', id]));
  }

  editEvent(event: TumiEvent) {
    this.router.navigate(['/', 'office', 'events', 'edit', event.id]);
  }
}
