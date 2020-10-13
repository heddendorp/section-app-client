import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { LoginOptionsDialogComponent } from '../components/login-options-dialog/login-options-dialog.component';
import { auth } from 'firebase/app';
import { EmailLoginDialogComponent } from '../components/email-login-dialog/email-login-dialog.component';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly user: Observable<any>;
  private readonly authenticated: Observable<boolean>;
  constructor(
    private fireAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router,
    firestore: AngularFirestore
  ) {
    this.authenticated = fireAuth.authState.pipe(
      map((state) => !!state),
      shareReplay()
    );
    this.user = fireAuth.user.pipe(
      switchMap((user: any) => {
        if (user) {
          return firestore.collection('users').doc(user.uid).valueChanges();
        }
        return of(user);
      }),
      shareReplay()
    );
  }

  public get authenticated$(): Observable<boolean> {
    return this.authenticated;
  }

  public get user$(): Observable<any> {
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
    await this.fireAuth.setPersistence(auth.Auth.Persistence.LOCAL);
    const method = await this.dialog
      .open(LoginOptionsDialogComponent)
      .afterClosed()
      .toPromise();
    if (method) {
      switch (method) {
        case 'google': {
          await this.fireAuth.signInWithRedirect(new auth.GoogleAuthProvider());
          break;
        }
        case 'facebook': {
          await this.fireAuth.signInWithRedirect(
            new auth.FacebookAuthProvider()
          );
          break;
        }
        case 'microsoft': {
          await this.fireAuth.signInWithRedirect(
            new auth.OAuthProvider('microsoft.com')
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
