import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss']
})
export class EventDetailsPageComponent implements OnInit {
  event$: Observable<TumiEvent>;
  constructor(private route: ActivatedRoute, private eventService: EventService) { }

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      map(params => params.get('eventId')),
      switchMap(id => this.eventService.getEvent(id))
    );
  }

}
