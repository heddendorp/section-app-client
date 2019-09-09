import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firestore as importStore } from 'firebase/app';
import * as moment from 'moment';
import { combineLatest, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
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
    start: moment().add(3, 'weeks'),
    isTicketTracker: false,
    tutorNotes: '',
    tutorSpots: 0,
    tutorSignups: [],
    usersSignedUp: 0
  };

  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar, private authService: AuthService) {}

  public get events(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get visibleEvents(): Observable<TumiEvent[]> {
    return this.authService.isTutor.pipe(switchMap(isTutor => (isTutor ? this.previewEvents : this.publicEvents)));
  }

  public get runningEvents(): Observable<TumiEvent[]> {
    return this.authService.isAdmin.pipe(
      switchMap(isAdmin =>
        isAdmin
          ? this.futureEvents
          : this.tutoredEvents.pipe(map(events => events.filter(event => event.end.isBefore())))
      )
    );
  }

  public get registeredEvents(): Observable<TumiEvent[]> {
    return this.authService.user.pipe(
      switchMap(user => combineLatest([this.getSignedEventsForUser(user.id), this.getTutorEventsForUser(user.id)])),
      map(([user, tutor]) => [...user, ...tutor].sort((a, b) => (a.start.isBefore(b.start) ? -1 : 1)))
    );
  }

  public get futureEvents(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref =>
        ref
          .orderBy('end')
          .where('isExternal', '==', false)
          .where('end', '>', new Date())
      )
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
  }

  public get tutoredEvents(): Observable<TumiEvent[]> {
    return this.authService.user.pipe(switchMap(user => this.getTutorEventsForUser(user.id)));
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
      .collectionGroup<EventSignup>('signups', ref => ref.where('id', '==', userId))
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(change => change.payload.doc)),
        switchMap(signups =>
          signups.length
            ? combineLatest(
                signups.map(signup =>
                  fromPromise(signup.ref.parent.parent.get()).pipe(
                    map(eventRef => eventRef.data()),
                    map(event => Object.assign(event, { hasPayed: signup.data().hasPayed }))
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
    return this.firestore
      .collection<TumiEvent>('events')
      .doc(id)
      .get()
      .pipe(
        map(event => event.data()),
        map(this.parseEvent),
        switchMap((event: TumiEvent) =>
          this.firestore
            .collection('events')
            .doc(id)
            .collection<EventSignup>('signups')
            .get()
            .pipe(
              map(signups => signups.docs.map(signup => signup.data())),
              map((signups: EventSignup[]) => Object.assign(event, { userSignups: signups }))
            )
        )
      );
  }

  public register(user, event): Promise<void> {
    return this.firestore
      .collection<TumiEvent>('events')
      .doc(event.id)
      .collection<EventSignup>('signups')
      .doc(user.id)
      .set({ id: user.id, partySize: 1, hasPayed: true, hasAttended: false });
  }

  public giveOutMoney(user, event, fullCost): Promise<void> {
    return this.updateEvent({
      ...event,
      moneyCollected: true,
      fullCost,
      moneyWith: `${user.firstName} ${user.lastName} (${user.email})`
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
      .collection<EventSignup>('signups')
      .doc(user.id)
      .update({ hasPayed: true });
  }

  public attendEvent(user: Student, event: TumiEvent) {
    this.firestore
      .collection<TumiEvent>('events')
      .doc(event.id)
      .collection<EventSignup>('signups')
      .doc(user.id)
      .update({ hasAttended: true });
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

export interface EventSignup {
  id: string;
  user?: Student;
  partySize: number;
  hasPayed: boolean;
  hasAttended: boolean;
}

export interface TumiEvent extends BaseEvent {
  start: moment.Moment;
  end: moment.Moment;
  tutorUsers?: Student[];
  userSignups?: EventSignup[];
  freeSpots?: string;
  hasPayed?: boolean;
  isTutor?: boolean;
}

export interface SavedEvent extends BaseEvent {
  start: importStore.Timestamp;
  end: importStore.Timestamp;
}
