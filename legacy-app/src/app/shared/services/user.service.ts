import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
      .valueChanges({ idField: 'id' });
  }

  get students(): Observable<Student[]> {
    return this.firestore
      .collection<Student>('users', ref =>
        ref
          .orderBy('lastName')
          .where('isStudent', '==', true)
          .where('disabled', '==', false)
      )
      .valueChanges({ idField: 'id' });
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
