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
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { AuthState } from '../../shared/state/auth.state';
import { EventsState } from '../../shared/state/events.state';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent implements OnInit {
  @Select(EventsState.filteredEvents) events$: Observable<TumiEvent[]>;
  @Select(AuthState.isTutor) isTutor$: Observable<boolean>;
  filterForm: FormGroup;

  constructor(private eventService: EventService, fb: FormBuilder, private route: ActivatedRoute) {
    this.filterForm = fb.group({
      showExternal: true,
      showFull: false,
      showFullTutors: true
    });
  }

  ngOnInit() {
    /*this.events$ = combineLatest([
      this.eventService.visibleEvents.pipe(startWith(this.route.snapshot.data.events)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
      this.isTutor$.pipe(startWith(false))
    ]).pipe(
      map(([events, filter, isTutor]) =>
        events
          .map((event: TumiEvent) => Object.assign(event, { freeSpots: getFreeSpots(event) }))
          .filter(this.filterEvents(filter, isTutor))
      )
    );*/
  }
}
