import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { EventService, TumiEvent } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore, private eventService: EventService) {}

  get students(): Observable<Student[]> {
    return this.firestore
      .collection<Student>('users')
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(err => {
          console.groupCollapsed('Firebase Error: get students()');
          console.error(err);
          console.groupEnd();
          return of([]);
        })
      );
  }

  get tutors(): Observable<Student[]> {
    return this.firestore
      .collection<Student>('users', ref => ref.orderBy('lastName').where('isTutor', '==', true))
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(err => {
          console.groupCollapsed('Firebase Error: get students()');
          console.error(err);
          console.groupEnd();
          return of([]);
        })
      );
  }

  public getOne(id): Observable<Student> {
    return this.firestore
      .collection<Student>('users')
      .doc(id)
      .valueChanges()
      .pipe(
        map((user: Student) => Object.assign(user, { id })),
        catchError(err => of(undefined))
      );
  }

  public getFullDetails(id): Observable<any> {
    return this.getOne(id).pipe(
      switchMap(user =>
        combineLatest([
          this.eventService.getOnlineEventsForUser(id),
          this.eventService.getPayedEventsForUser(id),
          this.eventService.getTutorEventsForUser(id)
        ]).pipe(
          map(([onlineEvents, payedEvents, tutorEvents]) =>
            Object.assign({}, user, { onlineEvents, payedEvents, tutorEvents })
          )
        )
      ),
      catchError(err => of(undefined))
    );
  }

  public getEventWithUsers(eventId): Observable<TumiEvent> {
    return this.eventService.getEvent(eventId).pipe(
      tap(console.log),
      switchMap(event =>
        this.getUsers(event.onlineSignups).pipe(map(onlineUsers => Object.assign(event, { onlineUsers })))
      ),
      switchMap(event =>
        this.getUsers(event.payedSignups).pipe(map(payedUsers => Object.assign(event, { payedUsers })))
      ),
      switchMap(event => this.getUsers(event.tutors).pipe(map(tutorUsers => Object.assign(event, { tutorUsers })))),
      tap(console.log)
    );
  }

  public save(user: Student) {
    return this.firestore
      .collection<Student>('users')
      .doc(user.id)
      .update(user);
  }

  private getUsers(ids: string[]): Observable<Student[]> {
    return combineLatest(ids.map(userId => this.getOne(userId))).pipe(startWith([]));
  }
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  academicMail: string;
  faculty: string;
  country: string;
  type: string;
  degree: string;
  phone?: string;
  isTutor: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  verified: boolean;
  onlineEvents?: TumiEvent[];
  payedEvents?: TumiEvent[];
  tutorEvents?: TumiEvent[];
}
