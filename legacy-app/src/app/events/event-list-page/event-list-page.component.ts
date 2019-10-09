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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TumiEvent } from '../../shared/services/event.service';
import { AuthState } from '../../shared/state/auth.state';
import { EventsState } from '../../shared/state/events.state';

@Component({
  selector: 'app-event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent {
  @Select(EventsState.filteredEvents) events$: Observable<TumiEvent[]>;
  @Select(AuthState.isTutor) isTutor$: Observable<boolean>;
  @Select(EventsState.loaded) loaded$: Observable<boolean>;
  filterForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.filterForm = fb.group({
      showExternal: true,
      showFull: false,
      showFullTutors: true
    });
  }
}
