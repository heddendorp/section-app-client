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

import { Action, Actions, createSelector, ofAction, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import { first, skip, takeUntil, tap } from 'rxjs/operators';
import { EventService, TumiEvent } from '../services/event.service';
import { addOrReplace } from '../state-operators';
import { filterEvents, getFreeSpots } from '../utility-functions';
import { AuthState, AuthStateModel } from './auth.state';
import { LoadEvent, LoadRegistrations, LoadTutoredEvents, LoadUpcomingEvents, SelectEvent } from './events.actions';
import { LoadUser } from './users.actions';
import { UsersState, UsersStateModel } from './users.state';
import { orderBy } from 'lodash';

export interface EventsStateModel {
  entities: { [id: string]: TumiEvent };
  ids: Array<string>;
  selectedId: string | null;
  loaded: boolean;
  version: number;
  filterForm: {
    model: any;
    dirty: boolean;
    status: string;
    errors: any;
  };
}

const addEvents = addOrReplace<TumiEvent>('start');

@State<EventsStateModel>({
  name: 'events',
  defaults: {
    entities: {},
    ids: [],
    selectedId: null,
    version: 1,
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
  constructor(private store: Store, private eventService: EventService, private actions$: Actions) {
  }

  static getEvent(id: string) {
    return createSelector([EventsState], (state: EventsStateModel) => state.entities[id]);
  }

  @Selector()
  static events(state: EventsStateModel) {
    return state.ids.map(id => state.entities[id]).sort((a, b) => a.start.diff(b.start));
  }

  @Selector()
  static loaded(state: EventsStateModel) {
    return state.loaded;
  }

  @Selector()
  static selectedEvent(state: EventsStateModel) {
    return state.entities[state.selectedId];
  }

  @Selector([UsersState])
  static selectedWithUsers(state: EventsStateModel, usersState: UsersStateModel) {
    const selectedEvent = state.entities[state.selectedId];
    return {
      ...selectedEvent,
      tutorUsers: selectedEvent.tutorSignups.map(id => usersState.entities[id]),
      coming: [
        ...selectedEvent.registrations.filter(item => !item.hasAttended && !item.isWaitList),
        ...selectedEvent.registrations.filter(item => item.hasAttended && !item.isWaitList)
      ].map(registration => Object.assign({}, registration, { user: usersState.entities[registration.id] })),
      waitlist: selectedEvent.registrations
        .filter(item => item.isWaitList)
        .map(registration => Object.assign({}, registration, { user: usersState.entities[registration.id] }))
    };
  }

  @Selector([AuthState])
  static filteredEvents(state: EventsStateModel, authState: AuthStateModel) {
    const isTutor = !!authState.user && (authState.user.isAdmin || authState.user.isTutor);
    return state.ids
      .map(id => state.entities[id])
      .filter(filterEvents(state.filterForm.model, isTutor))
      .filter(event => event.start > moment())
      .map(event => Object.assign({}, event, { freeSpots: getFreeSpots(event) }));
  }

  @Selector([AuthState])
  static tutoredEvents(state: EventsStateModel, authState: AuthStateModel) {
    const isEditor = !!authState.user && authState.user.isEditor;
    const tumiEvents =
      orderBy(state.ids
        .map(id => state.entities[id])
        .filter(event => event.tutorSignups.includes(authState.user.id) || isEditor), ['start'], ['desc']);
    return tumiEvents;
  }

  @Action(LoadUpcomingEvents)
  async loadEvents(ctx: StateContext<EventsStateModel>) {
    const isTutor = this.store.selectSnapshot(AuthState.isTutor);
    this.eventService
      .getUpcomingEvents(isTutor)
      .pipe(takeUntil(this.actions$.pipe(ofAction(LoadUpcomingEvents), skip(1))))
      .subscribe(events =>
        ctx.patchState({
          ...addEvents(ctx.getState(), events),
          loaded: true
        })
      );
  }

  @Action(LoadTutoredEvents)
  async loadTutoredEvents(ctx: StateContext<EventsStateModel>) {
    const isEditor = this.store.selectSnapshot(AuthState.isEditor);
    this.eventService
      .getTutoredEvents(isEditor)
      .pipe(takeUntil(this.actions$.pipe(ofAction(LoadTutoredEvents), skip(1))))
      .subscribe(events =>
        ctx.patchState({
          ...addEvents(ctx.getState(), events),
          loaded: true
        })
      );
  }

  @Action(LoadEvent)
  loadEvent(ctx: StateContext<EventsStateModel>, action: LoadEvent) {
    return this.eventService.getEvent(action.eventId).pipe(
      first(),
      tap(event => {
        if (action.withTutors) {
          ctx.dispatch(event.tutorSignups.map(id => new LoadUser(id)));
        }
      }),
      tap(event => ctx.patchState({ ...addEvents(ctx.getState(), [event]), loaded: true }))
    );
  }

  @Action(LoadRegistrations)
  async loadRegistrations(ctx: StateContext<EventsStateModel>, action: LoadRegistrations) {
    this.eventService
      .getRegistrationsForEvent(action.eventId)
      .pipe(
        takeUntil(this.actions$.pipe(ofAction(LoadRegistrations), skip(1))),
        tap(registrations => {
          if (action.withUsers) {
            ctx.dispatch(registrations.map(registration => new LoadUser(registration.id)));
          }
        })
      )
      .subscribe(registrations =>
        ctx.patchState({
          entities: {
            ...ctx.getState().entities,
            [action.eventId]: { ...ctx.getState().entities[action.eventId], registrations }
          }
        })
      );
  }

  @Action(SelectEvent)
  selectEvent(ctx: StateContext<EventsStateModel>, action: SelectEvent) {
    return ctx.patchState({ selectedId: action.eventId });
  }
}
