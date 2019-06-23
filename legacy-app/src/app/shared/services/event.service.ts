import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { firestore as importStore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseEvent: TumiEvent = {
    name: 'New TumiEvent',
    start: moment(),
    end: moment(),
    participants: [],
    participantSpots: 0,
    tutors: [],
    tutorSpots: 0,
    price: 0,
    notes: '',
    description: `This is a new event that's almost entirely empty. You should try to fill in as much info as possible`,
    public: false,
    hasFee: false,
    hasOnlineSignup: true
  };

  constructor(private firestore: AngularFirestore, private snackbar: MatSnackBar) {}

  public get events(): Observable<TumiEvent[]> {
    return this.firestore
      .collection<SavedEvent>('events', ref => ref.orderBy('start'))
      .valueChanges({ idField: 'id' })
      .pipe(map(events => events.map(this.parseEvent)));
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
        map(event => Object.assign({}, event, { id }))
      );
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

export interface TumiEvent extends BaseEvent {
  start: moment.Moment;
  end: moment.Moment;
}

interface BaseEvent {
  id?: string;
  name: string;
  participantSpots: number;
  tutorSpots: number;
  participants: any[];
  tutors: any[];
  notes: string;
  description: string;
  price: number;
  public: boolean;
  icon?: string;
  hasFee: boolean;
  hasOnlineSignup: boolean;
}

interface SavedEvent extends BaseEvent {
  start: importStore.Timestamp;
  end: importStore.Timestamp;
}
