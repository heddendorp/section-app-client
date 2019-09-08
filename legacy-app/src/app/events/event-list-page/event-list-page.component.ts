import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { getFreeSpots } from '../../shared/utility-functions';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;
  filterForm: FormGroup;

  constructor(private eventService: EventService, fb: FormBuilder) {
    this.filterForm = fb.group({
      showExternal: true,
      showFull: false
    });
  }

  ngOnInit() {
    this.events$ = combineLatest([
      this.eventService.visibleEvents,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([events, filter]) =>
        events
          .map((event: TumiEvent) => Object.assign(event, { freeSpots: getFreeSpots(event) }))
          .filter(this.filterEvents(filter))
      )
    );
  }

  filterEvents(filter) {
    return event => {
      if (!filter.showExternal && event.isExternal) {
        return false;
      }
      if (!filter.showFull && event.freeSpots === 'Event is full' && !event.isInternal && !event.isExternal) {
        return false;
      }
      return true;
    };
  }
}
