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
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, share, switchMap } from 'rxjs/operators';
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
    return this.eventService.getEvent(eventId).pipe(
      switchMap(event =>
        this.getUsers(event.tutorSignups).pipe(
          map(tutorUsers => tutorUsers.sort((a, b) => a.lastName.localeCompare(b.lastName))),
          map(tutorUsers => Object.assign({}, event, { tutorUsers }))
        )
      ),
      share()
    );
  }

  public getEventWithUsers(eventId): Observable<TumiEvent> {
    const eventWithTutorsObservable = this.getEventWithTutors(eventId);
    const registrationsWithUsersObservable = this.eventService.getRegistrationsForEvent(eventId).pipe(
      switchMap(registrations => {
        if (registrations.length) {
          return combineLatest(
            registrations.map(signup => this.getUser(signup.id).pipe(map(user => Object.assign(signup, { user }))))
          );
        }
        return of([]);
      }),
      map(registrations => registrations.sort((a, b) => a.user.lastName.localeCompare(b.user.lastName)))
    );
    return combineLatest([eventWithTutorsObservable, registrationsWithUsersObservable]).pipe(
      map(([event, userSignups]) => Object.assign({}, event, { userSignups })),
      share()
    );
  }

  public save(user: Student) {
    console.log(user);
    return this.firestore
      .collection<Student>('users')
      .doc(user.id)
      .update(this.cleanUser(user));
  }

  private getUsers(ids: string[]): Observable<Student[]> {
    if (ids.length === 0) {
      return of([]);
    }
    return combineLatest(ids.map(userId => this.getUser(userId)));
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
