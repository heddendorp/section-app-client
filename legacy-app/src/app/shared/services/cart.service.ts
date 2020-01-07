/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private events = new BehaviorSubject([]);

  constructor() {
    const stored = localStorage.getItem('event_cart');
    try {
      const events = JSON.parse(stored);
      if (events && events.length) {
        this.events.next(events);
      }
    } catch (e) {
      console.error(e);
    }
    this.events.pipe(skip(1)).subscribe(events => localStorage.setItem('event_cart', JSON.stringify(events)));
  }

  get eventCount() {
    return this.events.pipe(map(events => events.length));
  }

  get savedEvents() {
    return this.events.asObservable();
  }

  get fullPrice() {
    return this.events
      .asObservable()
      .pipe(map(events => events.reduce((acc, curr) => acc + curr.price, 0) || `Couldn't compute`));
  }

  addEvent(event) {
    const events = this.events.value;
    if (events.some(val => val.id === event.id)) {
      return;
    }
    this.events.next([
      ...events,
      {
        id: event.id,
        icon: event.icon,
        name: event.name,
        price: event.price,
        start: event.start.format('DD.MM. HH:mm'),
        end: event.end.format('DD.MM. HH:mm')
      }
    ]);
  }

  deleteEvent(id) {
    const events = this.events.value;
    this.events.next(events.filter(val => val.id !== id));
  }
}
