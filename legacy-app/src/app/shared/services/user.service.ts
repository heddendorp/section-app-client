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
      .collection<Student>('users', ref => ref.orderBy('lastName'))
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

  public getUser(id): Observable<Student> {
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
    return this.getUser(id).pipe(
      switchMap(user =>
        combineLatest([this.eventService.getSignedEventsForUser(id), this.eventService.getTutorEventsForUser(id)]).pipe(
          map(([userEvents, tutorEvents]) => Object.assign({}, user, { userEvents, tutorEvents }))
        )
      ),
      catchError(err => of(undefined))
    );
  }

  public getEventWithTutors(eventId) {
    return this.eventService
      .getEventWithRegistrations(eventId)
      .pipe(
        switchMap(event =>
          this.getUsers(event.tutorSignups).pipe(map(tutorUsers => Object.assign(event, { tutorUsers })))
        )
      );
  }

  public getEventWithUsers(eventId): Observable<TumiEvent> {
    return this.getEventWithTutors(eventId).pipe(
      switchMap(event =>
        combineLatest(
          event.userSignups.map(signup => this.getUser(signup.id).pipe(map(user => Object.assign(signup, { user }))))
        ).pipe(
          startWith([]),
          map(signups => Object.assign(event, { userSignups: signups }))
        )
      )
    );
  }

  public save(user: Student) {
    return this.firestore
      .collection<Student>('users')
      .doc(user.id)
      .update(this.cleanUser(user));
  }

  private getUsers(ids: string[]): Observable<Student[]> {
    return combineLatest(ids.map(userId => this.getUser(userId))).pipe(startWith([]));
  }

  private cleanUser(user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      academicMail: user.academicMail,
      faculty: user.faculty,
      country: user.country,
      type: user.type,
      degree: user.degree,
      phone: user.phone,
      isTutor: user.isTutor,
      isEditor: user.isEditor,
      verified: user.verified
    };
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
  userEvents?: TumiEvent[];
  tutorEvents?: TumiEvent[];
}
