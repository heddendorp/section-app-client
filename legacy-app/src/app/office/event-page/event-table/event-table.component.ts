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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TumiEvent } from '../../../shared/services/event.service';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit {
  @Input() events$: Observable<TumiEvent[]>;
  @Output() edit = new EventEmitter<TumiEvent>();
  displayedColumns: Observable<string[]>;

  constructor(media: MediaObserver) {
    this.displayedColumns = media.asObservable().pipe(
      map(checks => checks.filter(check => check.matches)),
      map(matches => {
        if (matches.find(match => match.mqAlias === 'md')) {
          return ['date', 'name', 'time', 'tutors', 'students'];
        } else if (matches.find(match => match.mqAlias === 'gt-md')) {
          return ['date', 'name', 'time', 'tutors', 'students', 'status'];
        } else {
          return ['date', 'name', 'students'];
        }
      })
    );
  }

  ngOnInit() {}

  editEvent(event: TumiEvent) {
    this.edit.emit(event);
  }
}
