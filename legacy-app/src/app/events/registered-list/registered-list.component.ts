import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../shared/services/event.service';

@Component({
  selector: 'app-registered-list',
  templateUrl: './registered-list.component.html',
  styleUrls: ['./registered-list.component.scss']
})
export class RegisteredListComponent implements OnInit {
  events$: Observable<TumiEvent[]>;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.events$ = this.eventService.registeredEvents;
  }
}
