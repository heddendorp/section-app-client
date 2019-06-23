import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';
import Base = moment.unitOfTime.Base;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  get tutors(): Observable<Tutor[]> {
    return this.firestore
      .collection<Tutor>('users', ref =>
        ref
          .orderBy('lastName')
          .where('isTutor', '==', true)
          .where('disabled', '==', false)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(err => {
          console.groupCollapsed('Firebase Error: get tutors()');
          console.error(err);
          console.groupEnd();
          return of([]);
        })
      );
  }

  get users(): Observable<BaseUser[]> {
    return this.firestore
      .collection<BaseUser>('users', ref => ref.orderBy('lastName').where('disabled', '==', false))
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(err => {
          console.groupCollapsed('Firebase Error: get tutors()');
          console.error(err);
          console.groupEnd();
          return of([]);
        })
      );
  }

  get students(): Observable<Student[]> {
    return this.firestore
      .collection<Student>('users', ref =>
        ref
          .orderBy('lastName')
          .where('isStudent', '==', true)
          .where('disabled', '==', false)
      )
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
}

export interface BaseUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  disabled: false;
  isStudent: boolean;
  isTutor: boolean;
}

export interface Tutor extends BaseUser {
  isTutor: true;
}

export interface Student extends BaseUser {
  country: string;
  status: string;
  isStudent: true;
}
