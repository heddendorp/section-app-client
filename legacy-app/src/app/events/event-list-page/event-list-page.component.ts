import { Component, OnInit } from '@angular/core';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;
  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.events$ = this.eventService.events;
  }
}
