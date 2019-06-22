import { Injectable } from '@angular/core';
import { auth, User } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { BaseUser } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  public login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public logout(): void {
    this.afAuth.auth.signOut();
  }

  public get authenticated(): Observable<boolean> {
    return this.afAuth.user.pipe(map(user => !!user));
  }

  public get signedUp(): Observable<boolean> {
    return this.user.pipe(map(user => !!user));
  }

  public get isAdmin(): Observable<boolean> {
    return this.user.pipe(
      switchMap(user =>
        this.firestore
          .collection('admins')
          .doc(user.userId)
          .valueChanges()
          .pipe(map(value => !!value))
      )
    );
  }

  public get user(): Observable<BaseUser> {
    return this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap((user: User) =>
        this.firestore
          .collection<BaseUser>('users', ref => ref.where('userId', '==', user.uid))
          .valueChanges()
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

  public async submitRequest(request) {
    const user = await this.afAuth.user.pipe(first()).toPromise();
    if (user) {
      this.firestore.collection('authRequests').add({ ...request, userId: user.uid });
    }
  }
}
