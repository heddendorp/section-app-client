import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  get students(): Observable<Student[]> {
    return this.firestore
      .collection<Student>('users', ref => ref.orderBy('lastName').where('disabled', '==', false))
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

  public async fetchUsers(ids: string[]) {
    return await Promise.all(
      ids.map(id =>
        this.getOne(id)
          .pipe(first())
          .toPromise()
      )
    );
  }

  public save(user: Student) {
    return this.firestore
      .collection<Student>('users')
      .doc(user.id)
      .update(user);
  }
}

export interface Student {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  academicMail: string;
  faculty: string;
  country: string;
  type: string;
  degree: string;
  disabled: false;
  isTutor: boolean;
  isAdmin: boolean;
  verified: boolean;
}
