import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@tumi/models';
import { subMonths } from 'date-fns';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private store: AngularFirestore) {}

  get tutors$(): Observable<User[]> {
    return this.store
      .collection<User>(User.collection(this.store), (ref) =>
        ref.where('isTutor', '==', true)
      )
      .valueChanges()
      .pipe(shareReplay(1));
  }

  get users$(): Observable<User[]> {
    return this.store
      .collection<User>(User.collection(this.store), (ref) =>
        ref.where('lastSignInTime', '>', subMonths(new Date(), 6))
      )
      .valueChanges()
      .pipe(shareReplay(1));
  }

  getUser$(id: string): Observable<any> {
    return this.store
      .collection<User>(User.collection(this.store))
      .doc(id)
      .valueChanges()
      .pipe(shareReplay(1));
  }

  getUserList$(ids: string[]): Observable<any[]> {
    if (ids.length === 0) {
      return of([]);
    }
    return combineLatest(ids.map((id) => this.getUser$(id)));
  }

  populateRegistrationList$(registrations: any[]): Observable<any[]> {
    if (registrations.length === 0) {
      return of([]);
    }
    return combineLatest(
      registrations.map((registration) =>
        this.getUser$(registration.id).pipe(
          map((user) => ({ ...registration, user }))
        )
      )
    );
  }

  update(id: string, update: Partial<User>): Promise<void> {
    return this.store
      .collection<User>(User.collection(this.store))
      .doc(id)
      .set(update as User, { merge: true });
  }
}
