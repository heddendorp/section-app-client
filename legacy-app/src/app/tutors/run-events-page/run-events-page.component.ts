import { Component, OnInit } from '@angular/core';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { first, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-run-events-page',
  templateUrl: './run-events-page.component.html',
  styleUrls: ['./run-events-page.component.scss']
})
export class RunEventsPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;

  constructor(private eventService: EventService) {}

  async ngOnInit() {
    this.events$ = this.eventService.runningEvents;
  }
}
