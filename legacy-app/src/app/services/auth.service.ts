import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@tumi/models';
import { isNotNullOrUndefined } from '@tumi/modules/shared';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import {
  EmailLoginDialogComponent,
  LoginOptionsDialogComponent,
} from '@tumi/components';
import firebase from 'firebase/app';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly user: Observable<User>;
  private readonly authenticated: Observable<boolean>;

  constructor(
    private fireAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    store: AngularFirestore
  ) {
    this.authenticated = fireAuth.authState.pipe(
      map((state) => !!state),
      shareReplay()
    );
    this.user = fireAuth.user.pipe(
      isNotNullOrUndefined(),
      switchMap((user: firebase.User) =>
        store
          .collection<User>(User.collection(store))
          .doc(user.uid)
          .valueChanges()
      ),
      isNotNullOrUndefined(),
      shareReplay(1)
    );
  }

  public get authenticated$(): Observable<boolean> {
    return this.authenticated;
  }

  public get user$(): Observable<User> {
    return this.user;
  }

  public get isTutor$(): Observable<boolean> {
    return this.user.pipe(
      map((user) =>
        user ? user.isTutor || user.isEditor || user.isAdmin : false
      )
    );
  }

  public get isEditor$(): Observable<boolean> {
    return this.user.pipe(
      map((user) => (user ? user.isEditor || user.isAdmin : false))
    );
  }

  public get isAdmin$(): Observable<boolean> {
    return this.user.pipe(map((user) => (user ? user.isAdmin : false)));
  }

  public async logout(): Promise<void> {
    await this.fireAuth.signOut();
    await this.router.navigate(['/events']);
  }

  public async login(): Promise<void> {
    await this.fireAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const method = await this.dialog
      .open(LoginOptionsDialogComponent)
      .afterClosed()
      .toPromise();
    if (method) {
      switch (method) {
        case 'google': {
          await this.fireAuth.signInWithRedirect(
            new firebase.auth.GoogleAuthProvider()
          );
          break;
        }
        case 'facebook': {
          await this.fireAuth.signInWithRedirect(
            new firebase.auth.FacebookAuthProvider()
          );
          break;
        }
        case 'microsoft': {
          await this.fireAuth.signInWithRedirect(
            new firebase.auth.OAuthProvider('microsoft.com')
          );
          break;
        }
        case 'mail': {
          const result = await this.dialog
            .open(EmailLoginDialogComponent)
            .afterClosed()
            .toPromise();
          if (result === 'retry') {
            await this.login();
          }
        }
      }
    }
  }

  fetchSignInMethodsForEmail(mail: string): Promise<string[]> {
    return this.fireAuth.fetchSignInMethodsForEmail(mail);
  }

  sendPasswordResetEmail(mail: string): Promise<void> {
    return this.fireAuth.sendPasswordResetEmail(mail);
  }

  signInWithEmailAndPassword(
    mail: string,
    password: string
  ): Promise<UserCredential> {
    return this.fireAuth.signInWithEmailAndPassword(mail, password);
  }

  createUserWithEmailAndPassword(
    mail: string,
    password: string
  ): Promise<UserCredential> {
    return this.fireAuth.createUserWithEmailAndPassword(mail, password);
  }

  canSeeParticipants$(event: any): Observable<boolean> {
    return combineLatest([this.isEditor$, this.user$]).pipe(
      map(([isEditor, user]) => {
        if (isEditor) {
          return true;
        }
        if (!user) {
          return false;
        }
        return event.tutorSignups.includes(user.id);
      })
    );
  }
}
