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

import { Action, Actions, ofAction, Selector, State, StateContext, Store } from '@ngxs/store';
import { skip, takeUntil } from 'rxjs/operators';
import { EventService, TumiEvent } from '../services/event.service';
import { filterEvents } from '../utility-functions';
import { AuthState, AuthStateModel } from './auth.state';
import { LoadUpcomingEvents, SelectEvent } from './events.actions';

export interface EventsStateModel {
  events: { [id: string]: TumiEvent };
  ids: string[];
  selectedId: string | null;
  loaded: boolean;
  filterForm: {
    model: any;
    dirty: boolean;
    status: string;
    errors: any;
  };
}

@State<EventsStateModel>({
  name: 'events',
  defaults: {
    events: {},
    ids: [],
    selectedId: null,
    filterForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {}
    },
    loaded: false
  }
})
export class EventsState {
  constructor(private store: Store, private eventService: EventService, private actions$: Actions) {}

  @Selector()
  static events(state: EventsStateModel) {
    return state.ids.map(id => state.events[id]);
  }

  @Selector()
  static selectedEvent(state: EventsStateModel) {
    return state.events[state.selectedId];
  }

  @Selector([AuthState])
  static filteredEvents(state: EventsStateModel, authState: AuthStateModel) {
    const isTutor = authState.user.isAdmin || authState.user.isTutor;
    return state.ids.map(id => state.events[id]).filter(filterEvents(state.filterForm.model, isTutor));
  }

  @Action(LoadUpcomingEvents)
  async loadEvents(ctx: StateContext<EventsStateModel>) {
    const isTutor = this.store.selectSnapshot(AuthState.isTutor);
    this.eventService
      .getUpcomingEvents(isTutor)
      .pipe(
        takeUntil(
          this.actions$.pipe(
            ofAction(LoadUpcomingEvents),
            skip(1)
          )
        )
      )
      .subscribe(events =>
        ctx.patchState({
          ids: events.map(event => event.id),
          events: events.reduce((acc, curr) => Object.assign({}, acc, { [curr.id]: curr }), {}),
          loaded: true
        })
      );
  }

  @Action(SelectEvent)
  async selectEvent(ctx: StateContext<EventsStateModel>, action: SelectEvent) {
    return ctx.patchState({ selectedId: action.eventId });
  }
}
