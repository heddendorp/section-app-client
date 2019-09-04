import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { firestore as importStore } from 'firebase/app';
import { AuthService } from './auth.service';
import { Student } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseEvent: TumiEvent = {
    description: `This is a new event that's almost entirely empty. You should try to fill in as much info as possible`,
    end: moment().add(3, 'weeks'),
    external: false,
    fullCost: 0,
    hasFee: false,
    hasOnlineSignup: true,
    internal: false,
    meetingPoint: '',
    moneyWith: '',
    moneyCollected: false,
    name: 'New TumiEvent',
    notes: '',
    onlineSignups: [],
    participantSpots: 0,
    payedSignups: [],
    preview: false,
    price: 0,
    public: false,
    runningNotes: 'Notes for the tutors who run this event',
    signupLink: '',
    soldTickets: 0,
    start: moment().add(3, 'weeks'),
    trackTickets: false,
    tutorNotes: '',
    tutorSpots: 0,
    tutors: []
  };

  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar, private authService: AuthService) {}

  public get events(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get visibleEvents(): Observable<TumiEvent[]> {
    return this.authService.isTutor.pipe(
      switchMap(isTutor => {
        if (isTutor) {
          return this.previewEvents;
        } else {
          return this.publicEvents;
        }
      })
    );
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

  public get futureEvents(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref =>
        ref
          .orderBy('start')
          .where('external', '==', false)
          .where('start', '>', new Date())
      )
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get tutoredEvents(): Observable<TumiEvent[]> {
    return this.authService.user.pipe(switchMap(user => this.getTutorEventsForUser(user.id)));
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

  private get publicEvents(): Observable<TumiEvent[]> {
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

  private get previewEvents(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref =>
        ref
          .orderBy('start')
          .where('preview', '==', true)
          .where('start', '>', new Date())
      )
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
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
  description: string;
  external: boolean;
  freeSpots?: string;
  fullCost: number;
  hasFee: boolean;
  hasOnlineSignup: boolean;
  icon?: string;
  id?: string;
  internal: boolean;
  isOnline?: boolean;
  isTutor?: boolean;
  meetingPoint: string;
  moneyWith: '';
  moneyCollected: boolean;
  name: string;
  notes: string;
  onlineSignups: string[];
  onlineUsers?: Student[];
  participantSpots: number;
  payedSignups: string[];
  payedUsers?: Student[];
  preview: boolean;
  price: number;
  public: boolean;
  runningNotes: string;
  signupLink: string;
  soldTickets: number;
  trackTickets: boolean;
  tutorNotes: string;
  tutorSpots: number;
  tutorUsers?: Student[];
  tutors: string[];
}

export interface TumiEvent extends BaseEvent {
  start: moment.Moment;
  end: moment.Moment;
}

export interface SavedEvent extends BaseEvent {
  start: importStore.Timestamp;
  end: importStore.Timestamp;
}
