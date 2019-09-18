import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth, User } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { filter, first, map, startWith, switchMap } from 'rxjs/operators';
import { gtagFunction, sendEvent } from '../utility-functions';
import { Student } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {
    this.afAuth.authState
      .pipe(
        filter(state => !!state),
        map(state => state.uid)
      )
      .subscribe(uid => {
        if (!localStorage.getItem('preventUserID')) {
          gtagFunction('config', 'G-04YZMLFE3Z', {
            user_id: uid
          });
        }
      });
  }

  public get authenticated(): Observable<boolean> {
    return this.afAuth.user.pipe(map(user => !!user));
  }

  public get isAdmin(): Observable<boolean> {
    return this.user.pipe(
      map(student => !!(student && student.isAdmin)),
      startWith(false)
    );
  }

  public get isTutor(): Observable<boolean> {
    return this.user.pipe(
      map(student => !!(student && (student.isTutor || student.isAdmin))),
      startWith(false)
    );
  }

  public get isEditor(): Observable<boolean> {
    return this.user.pipe(
      map(student => !!(student && (student.isEditor || student.isAdmin))),
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
          .pipe(map(student => Object.assign({}, student, { id: user.uid, verified: user.emailVerified })));
      })
    );
  }

  public async login(provider) {
    switch (provider) {
      case 'google': {
        await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
        break;
      }
      case 'facebook': {
        await this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
        break;
      }
      case 'microsoft': {
        await this.afAuth.auth.signInWithPopup(new auth.OAuthProvider('microsoft.com'));
        break;
      }
    }
    sendEvent('login', { method: provider });
    this.router.navigate(['events', 'list']);
  }

  public createUser(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(creds => {
      sendEvent('sign_up');
      this.sendVerification();
      this.router.navigate(['events', 'list']);
      return creds;
    });
  }

  public emailLogin(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(creds => {
      sendEvent('login', { method: 'password' });
      this.router.navigate(['events', 'list']);
      return creds;
    });
  }

  public getLoginOptions(email) {
    return this.afAuth.auth.fetchSignInMethodsForEmail(email);
  }

  public async sendVerification() {
    const user = await this.afAuth.user.pipe(first()).toPromise();
    return user.sendEmailVerification();
  }

  public async logout() {
    await this.router.navigate(['events', 'list']);
    await this.afAuth.auth.signOut();
  }
}
