/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { getFreeSpots } from '../../shared/utility-functions';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;
  isTutor$: Observable<boolean>;
  filterForm: FormGroup;

  constructor(
    private eventService: EventService,
    fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.filterForm = fb.group({
      showExternal: true,
      showFull: false,
      showFullTutors: false
    });
  }

  ngOnInit() {
    this.isTutor$ = this.authService.isTutor;
    this.events$ = combineLatest([
      this.eventService.visibleEvents.pipe(startWith(this.route.snapshot.data.events)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
      this.isTutor$.pipe(startWith(false))
    ]).pipe(
      map(([events, filter, isTutor]) =>
        events
          .map((event: TumiEvent) => Object.assign(event, { freeSpots: getFreeSpots(event) }))
          .filter(this.filterEvents(filter, isTutor))
      )
    );
  }

  filterEvents(filter, isTutor) {
    return event => {
      if (!filter.showExternal && event.isExternal) {
        return false;
      }
      if (
        !filter.showFullTutors &&
        event.tutorSpots <= event.tutorSignups.length &&
        !event.isInternal &&
        !event.isExternal &&
        !event.isTicketTracker &&
        isTutor
      ) {
        return false;
      }
      if (
        !filter.showFull &&
        event.freeSpots === 'Event is full' &&
        !event.isInternal &&
        !event.isExternal &&
        !event.isTicketTracker
      ) {
        return false;
      }
      return true;
    };
  }
}
