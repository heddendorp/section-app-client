import { Injectable } from '@angular/core';
import { auth, User } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { filter, first, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Student } from './user.service';

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
      map(student => student.isAdmin),
      startWith(false)
    );
  }

  public get isTutor(): Observable<boolean> {
    return this.user.pipe(
      map(student => student.isTutor),
      startWith(false)
    );
  }

  public get user(): Observable<Student> {
    return this.afAuth.authState.pipe(
      switchMap((user: User) => {
        if (!user) {
          return of(null);
        }
        return this.firestore
          .collection<Student>('users')
          .doc(user.uid)
          .valueChanges()
          .pipe(map(student => Object.assign({}, student, { id: user.uid })));
      })
    );
  }

  public login(provider = 'email'): void {
    switch (provider) {
      case 'google': {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
        break;
      }
      case 'facebook': {
        this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
        break;
      }
      case 'email': {
        this.afAuth.auth.signInWithPopup(new auth.EmailAuthProvider());
        break;
      }
    }
  }

  public logout(): void {
    this.afAuth.auth.signOut();
  }
}
