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
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent implements OnInit {
  events$: Observable<TumiEvent[]>;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.events$ = this.eventService.events/*.pipe(
      tap(events => {
        const selected = events.filter(event => event.isVisiblePublicly);
        console.log(selected);
        const names = selected.map(event => event.name);
        console.log(names.join('\n 1 '));
      })
    )*/;
  }

  createNewEvent() {
    this.eventService.createEvent().then(id => this.router.navigate(['/', 'office', 'events', 'edit', id]));
  }

  editEvent(event: TumiEvent) {
    this.router.navigate(['/', 'office', 'events', 'edit', event.id]);
  }
}
