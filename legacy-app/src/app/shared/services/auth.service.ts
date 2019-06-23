import { Injectable } from '@angular/core';
import { auth, User } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { filter, first, map, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { BaseUser } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  public get authenticated(): Observable<boolean> {
    return this.afAuth.user.pipe(map(user => !!user));
  }

  public get signedUp(): Observable<boolean> {
    return this.user.pipe(map(user => !!user));
  }

  public get isAdmin(): Observable<boolean> {
    return this.user.pipe(
      filter(user => !!user),
      switchMap(user =>
        this.firestore
          .collection('admins')
          .doc(user.userId)
          .valueChanges()
          .pipe(map(value => !!value))
      ),
      startWith(false)
    );
  }

  public get user(): Observable<BaseUser> {
    return this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap((user: User) =>
        this.firestore
          .collection<BaseUser>('users', ref => ref.where('userId', '==', user.uid))
          .valueChanges({ idField: 'id' })
          .pipe(map(results => results[0]))
      )
    );
  }

  public get authRequest(): Observable<any | null> {
    return this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap((user: User) =>
        this.firestore
          .collection('authRequests', ref => ref.where('userId', '==', user.uid))
          .valueChanges()
          .pipe(map(results => results[0]))
      )
    );
  }

  public get openRequests() {
    return this.firestore
      .collection('authRequests', ref => ref.where('approved', '==', false))
      .valueChanges({ idField: 'id' });
  }

  public getRequest(id) {
    return this.firestore
      .collection('authRequests')
      .doc(id)
      .valueChanges()
      .pipe(map(request => Object.assign(request, { id })));
  }

  public login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public logout(): void {
    this.afAuth.auth.signOut();
  }

  public async submitRequest(request) {
    const user = await this.afAuth.user.pipe(first()).toPromise();
    if (user) {
      this.firestore.collection('authRequests').add({ ...request, userId: user.uid, approved: false });
    }
  }

  public approveRequest(request, user) {
    return Promise.all([
      this.firestore
        .collection('authRequests')
        .doc(request.id)
        .update({ approved: true }),
      this.firestore
        .collection('users')
        .doc(user.id)
        .update({ userId: request.userId })
    ]);
  }
}
