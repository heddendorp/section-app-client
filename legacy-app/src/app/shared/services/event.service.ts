import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { firestore as importStore } from 'firebase/app';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseEvent: TumiEvent = {
    name: 'New TumiEvent',
    start: moment().add(3, 'weeks'),
    end: moment().add(3, 'weeks'),
    payedSignups: [],
    onlineSignups: [],
    participantSpots: 0,
    tutors: [],
    tutorSpots: 0,
    price: 0,
    soldTickets: 0,
    notes: '',
    description: `This is a new event that's almost entirely empty. You should try to fill in as much info as possible`,
    public: false,
    hasFee: false,
    trackTickets: false,
    hasOnlineSignup: true
  };

  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar, private authService: AuthService) {}

  public get events(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get publicEvents(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref =>
        ref
          .orderBy('start')
          .where('public', '==', true)
          .where('start', '>', new Date())
      )
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get registeredEvents(): Observable<TumiEvent[]> {
    return this.authService.user.pipe(
      switchMap(user => {
        const onlineSinged = this.getOnlineEventsForUser(user.id);
        const officeSigned = this.getPayedEventsForUser(user.id);
        const tutorSigned = this.getTutorEventsForUser(user.id);
        return combineLatest(onlineSinged, officeSigned, tutorSigned);
      }),
      map(([online, office, tutor]) =>
        [...online, ...office, ...tutor].sort((a, b) => (a.start.isBefore(b.start) ? -1 : 1))
      )
    );
  }

  public getOnlineEventsForUser(userId) {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.where('onlineSignups', 'array-contains', userId).orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(events => events.map(this.parseEvent)),
        map(events => events.map(event => Object.assign({}, event, { isOnline: true })))
      );
  }

  public getPayedEventsForUser(userId) {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.where('payedSignups', 'array-contains', userId).orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public getTutorEventsForUser(userId) {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.where('tutors', 'array-contains', userId).orderBy('start'))
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

  public register(user, event): Promise<void> {
    return this.updateEvent({ ...event, participants: [...event.participants, user.id] });
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

  private serializeEvent(event: TumiEvent): SavedEvent {
    return {
      ...event,
      start: importStore.Timestamp.fromDate(event.start.toDate()),
      end: importStore.Timestamp.fromDate(event.end.toDate())
    };
  }

  private parseEvent(event: SavedEvent): TumiEvent {
    return {
      ...event,
      start: moment(event.start.toDate()),
      end: moment(event.end.toDate())
    };
  }
}

interface BaseEvent {
  id?: string;
  name: string;
  participantSpots: number;
  tutorSpots: number;
  payedSignups: string[];
  onlineSignups: string[];
  tutors: string[];
  notes: string;
  description: string;
  price: number;
  soldTickets: number;
  public: boolean;
  icon?: string;
  hasFee: boolean;
  trackTickets: boolean;
  hasOnlineSignup: boolean;
  freeSpots?: string;
  isTutor?: boolean;
  isOnline?: boolean;
}

export interface TumiEvent extends BaseEvent {
  start: moment.Moment;
  end: moment.Moment;
}

export interface SavedEvent extends BaseEvent {
  start: importStore.Timestamp;
  end: importStore.Timestamp;
}
