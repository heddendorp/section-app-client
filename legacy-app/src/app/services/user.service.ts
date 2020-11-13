import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private store: AngularFirestore) {}

  get tutors$(): Observable<any[]> {
    return this.store
      .collection('users', (ref) => ref.where('isTutor', '==', true))
      .valueChanges({ idField: 'id' });
    // .pipe(shareReplay());
  }

  getUser$(id: string): Observable<any> {
    return this.store
      .collection('users')
      .doc(id)
      .valueChanges({ idField: 'id' })
      .pipe(shareReplay());
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

  update(id: string, update: any): Promise<void> {
    return this.store.collection('users').doc(id).update(update);
  }
}
