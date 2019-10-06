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

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { firestore as importStore } from 'firebase/app';
import * as moment from 'moment';
import { combineLatest, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, share, switchMap } from 'rxjs/operators';
import { Student } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseEvent: TumiEvent = {
    description: `This is a new event that's almost entirely empty. You should try to fill in as much info as possible`,
    end: moment().add(3, 'weeks'),
    isExternal: false,
    fullCost: 0,
    hasFee: false,
    hasOnlineSignup: false,
    isInternal: false,
    icon: '',
    meetingPoint: '',
    moneyWith: '',
    moneyCollected: false,
    name: 'New TumiEvent',
    participantSpots: 0,
    isVisibleInternally: false,
    price: 0,
    isVisiblePublicly: false,
    runningNotes: 'Notes for the tutors who run this event',
    signupLink: '',
    soldTickets: 0,
    start: moment().add(1, 'weeks'),
    isTicketTracker: false,
    tutorNotes: '',
    tutorSpots: 0,
    tutorSignups: [],
    usersSignedUp: 0
  };
  isAdmin$: Observable<boolean>;
  isTutor$: Observable<boolean>;
  user$: Observable<Student>;

  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar, private store: Store) {
    this.isAdmin$ = store.select(state => state.auth.user.isAdmin);
    this.isTutor$ = store.select(state => state.auth.user.isTutor || state.auth.user.isAdmin);
    this.user$ = store.select(state => state.auth.user);
  }

  public get events(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get visibleEvents(): Observable<TumiEvent[]> {
    return this.isTutor$.pipe(switchMap(isTutor => (isTutor ? this.previewEvents : this.publicEvents)));
  }

  public get runningEvents(): Observable<TumiEvent[]> {
    return this.isAdmin$.pipe(
      switchMap(isAdmin =>
        isAdmin
          ? this.futureEvents
          : this.tutoredEvents.pipe(map(events => events.filter(event => event.end.isSameOrAfter())))
      )
    );
  }

  public get registeredEvents(): Observable<TumiEvent[]> {
    return this.user$.pipe(
      switchMap(user => combineLatest([this.getSignedEventsForUser(user.id), this.getTutorEventsForUser(user.id)])),
      map(([user, tutor]) => [...user, ...tutor].sort((a, b) => (a.start.isBefore(b.start) ? -1 : 1)))
    );
  }

  public get futureEvents(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>(
        'events',
        ref => ref.orderBy('end').where('isExternal', '==', false)
        // .where('end', '>', new Date())
      )
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get tutoredEvents(): Observable<TumiEvent[]> {
    return this.user$.pipe(switchMap(user => this.getTutorEventsForUser(user.id)));
  }

  private get publicEvents(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref =>
        ref
          .orderBy('start')
          .where('isVisiblePublicly', '==', true)
          .where('start', '>', new Date())
      )
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  private get previewEvents(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref =>
        ref
          .orderBy('start')
          .where('isVisibleInternally', '==', true)
          .where('start', '>', new Date())
      )
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public getSignedEventsForUser(userId) {
    return this.firestore
      .collectionGroup<SavedEventSignup>('signups', ref => ref.where('id', '==', userId))
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(change => change.payload.doc)),
        switchMap(signups =>
          signups.length
            ? combineLatest(
                signups.map(signup =>
                  fromPromise(signup.ref.parent.parent.get()).pipe(
                    map(eventRef => eventRef.data()),
                    map(event =>
                      Object.assign({}, event, {
                        hasPayed: signup.data().hasPayed,
                        isWaitList: signup.data().isWaitList || false
                      })
                    )
                  )
                )
              )
            : of([])
        ),
        map(events => events.map(this.parseEvent))
      );
  }

  public getTutorEventsForUser(userId) {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.where('tutorSignups', 'array-contains', userId).orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(events => events.map(this.parseEvent)),
        map(events => events.map(event => Object.assign({}, event, { isTutor: true })))
      );
  }

  public createEvent(): Promise<string> {
    return this.firestore
      .collection<SavedEvent>('events')
      .add(this.serializeEvent(this.baseEvent))
      .then(doc => {
        this.snackbar.open('Event created!');
        return doc.id;
      });
  }

  public getEvent(id: string): Observable<TumiEvent> {
    return this.firestore
      .collection<SavedEvent>('events')
      .doc(id)
      .valueChanges()
      .pipe(
        map(this.parseEvent),
        map(event => Object.assign({}, event, { id })),
        catchError(err => of(undefined))
      );
  }

  public getEventWithRegistrations(id: string): Observable<TumiEvent> {
    const eventObservable = this.firestore
      .collection<TumiEvent>('events')
      .doc(id)
      .valueChanges()
      .pipe(map(this.parseEvent));
    const signupsObservable = this.getRegistrationsForEvent(id);
    return combineLatest([eventObservable, signupsObservable]).pipe(
      map(([event, userSignups]) => Object.assign({}, event, { userSignups })),
      share()
    );
  }

  public getRegistrationsForEvent(id: string): Observable<EventSignup[]> {
    return this.firestore
      .collection('events')
      .doc(id)
      .collection<SavedEventSignup>('signups')
      .valueChanges({ idField: 'id' })
      .pipe(
        map(registrations =>
          registrations.map(registration =>
            Object.assign({}, registration, {
              timestamp: registration.timestamp ? moment(registration.timestamp.toDate()) : moment()
            })
          )
        )
      );
  }

  public register(user, event, isWaitList = false): Promise<void> {
    return this.firestore
      .collection<TumiEvent>('events')
      .doc(event.id)
      .collection<SavedEventSignup>('signups')
      .doc(user.id)
      .set({ id: user.id, partySize: 1, hasPayed: true, hasAttended: false, timestamp: new Date(), isWaitList });
  }

  public deregister(user, event): Promise<void> {
    return this.firestore
      .collection<TumiEvent>('events')
      .doc(event.id)
      .collection<SavedEventSignup>('signups')
      .doc(user.id)
      .delete();
  }

  public giveOutMoney(user, event, fullCost): Promise<void> {
    return this.updateEvent({
      ...event,
      moneyCollected: true,
      fullCost,
      moneyWith: `${user.firstName} ${user.lastName} (${user.email})`
    });
  }

  public sellTickets(event, ticketNum): Promise<void> {
    return this.updateEvent({
      ...event,
      soldTickets: event.soldTickets + ticketNum
    });
  }

  public updateEvent(event: TumiEvent): Promise<void> {
    return this.firestore
      .collection<SavedEvent>('events')
      .doc<SavedEvent>(event.id)
      .set(this.serializeEvent(event))
      .then(() => {
        this.snackbar.open('Event saved!');
      });
  }

  public payForEvent(user: Student, event: TumiEvent) {
    return this.firestore
      .collection<TumiEvent>('events')
      .doc(event.id)
      .collection<SavedEventSignup>('signups')
      .doc(user.id)
      .update({ hasPayed: true });
  }

  public attendEvent(user: Student, event: TumiEvent, hasAttended = true) {
    this.firestore
      .collection<TumiEvent>('events')
      .doc(event.id)
      .collection<SavedEventSignup>('signups')
      .doc(user.id)
      .update({ hasAttended });
  }

  public removeTutorFromEvent(user: Student, event: TumiEvent) {
    this.updateEvent({ ...event, tutorSignups: event.tutorSignups.filter(id => id !== user.id) });
  }

  private serializeEvent(event: TumiEvent): SavedEvent {
    return {
      description: event.description,
      isExternal: event.isExternal,
      fullCost: event.fullCost,
      hasFee: event.hasFee,
      hasOnlineSignup: event.hasOnlineSignup,
      icon: event.icon || '',
      id: event.id || '',
      isInternal: event.isInternal,
      meetingPoint: event.meetingPoint,
      moneyWith: event.moneyWith,
      moneyCollected: event.moneyCollected,
      name: event.name,
      participantSpots: event.participantSpots,
      isVisibleInternally: event.isVisibleInternally,
      price: event.price,
      isVisiblePublicly: event.isVisiblePublicly,
      runningNotes: event.runningNotes,
      signupLink: event.signupLink,
      soldTickets: event.soldTickets,
      isTicketTracker: event.isTicketTracker,
      tutorNotes: event.tutorNotes,
      tutorSpots: event.tutorSpots,
      tutorSignups: event.tutorSignups,
      usersSignedUp: event.usersSignedUp,
      start: importStore.Timestamp.fromDate(event.start.toDate()),
      end: importStore.Timestamp.fromDate(event.end.toDate())
    };
  }

  private parseEvent(event: SavedEvent): TumiEvent {
    return {
      ...event,
      start: moment(event.start.toDate()),
      end: moment(event.end.toDate()),
      usersSignedUp: event.usersSignedUp || 0
    };
  }
}

interface BaseEvent {
  description: string;
  isExternal: boolean;
  fullCost: number;
  hasFee: boolean;
  hasOnlineSignup: boolean;
  icon: string;
  id?: string;
  isInternal: boolean;
  meetingPoint: string;
  moneyWith: '';
  moneyCollected: boolean;
  name: string;
  participantSpots: number;
  isVisibleInternally: boolean;
  price: number;
  isVisiblePublicly: boolean;
  runningNotes: string;
  signupLink: string;
  soldTickets: number;
  isTicketTracker: boolean;
  usersSignedUp?: number;
  tutorNotes: string;
  tutorSpots: number;
  tutorSignups: string[];
}

interface BaseEventSignup {
  id: string;
  user?: Student;
  partySize: number;
  hasPayed: boolean;
  hasAttended: boolean;
  isWaitList: boolean;
}

export interface EventSignup extends BaseEventSignup {
  timestamp: moment.Moment;
}

export interface SavedEventSignup extends BaseEventSignup {
  timestamp: importStore.Timestamp;
}

export interface TumiEvent extends BaseEvent {
  start: moment.Moment;
  end: moment.Moment;
  tutorUsers?: Student[];
  userSignups?: EventSignup[];
  coming?: EventSignup[];
  waitlist?: EventSignup[];
  freeSpots?: string;
  hasPayed?: boolean;
  isWaitList?: boolean;
  isTutor?: boolean;
}

export interface SavedEvent extends BaseEvent {
  start: importStore.Timestamp;
  end: importStore.Timestamp;
}
