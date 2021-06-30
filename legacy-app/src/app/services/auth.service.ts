import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  EmailLoginDialogComponent,
  LoginOptionsDialogComponent,
} from '@tumi/components';
import { MemberStatus, User } from '@tumi/models';
import { isNotNullOrUndefined } from '@tumi/modules/shared';
import firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import * as Sentry from '@sentry/angular';
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
      shareReplay(1)
    );
    this.user = fireAuth.user.pipe(
      isNotNullOrUndefined(),
      switchMap((user: firebase.User) => {
        const impersonatedUser = localStorage.getItem('impersonation');
        return store
          .collection<User>(User.collection(store))
          .doc(impersonatedUser ?? user.uid)
          .valueChanges();
      }),
      isNotNullOrUndefined(),
      tap((user) => {
        Sentry.setContext('rights', user.rights);
        Sentry.setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          dataUrl: `https://console.firebase.google.com/u/0/project/esn-tumi/firestore/data~2Fusers~2F${user.id}`,
        });
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Authenticated user ' + user.email,
          level: Sentry.Severity.Info,
        });
      }),
      shareReplay(1)
    );
  }

  public get authenticated$(): Observable<boolean> {
    return this.authenticated;
  }

  public get user$(): Observable<User> {
    return this.user;
  }

  /**
   * @deprecated use alternative to get status
   */
  public get isTutor$(): Observable<boolean> {
    return this.authenticated$.pipe(
      switchMap((authenticated) =>
        authenticated ? this.user$.pipe(map((user) => user.isTutor)) : of(false)
      )
    );
  }

  public get isMember$(): Observable<boolean> {
    return this.authenticated$.pipe(
      switchMap((authenticated) =>
        authenticated
          ? this.user$.pipe(map((user) => user.isMember))
          : of(false)
      )
    );
  }

  public hasMemberStatus$(status: MemberStatus): Observable<boolean> {
    return this.authenticated$.pipe(
      switchMap((authenticated) =>
        authenticated
          ? this.user$.pipe(map((user) => user.status == status))
          : of(false)
      )
    );
  }

  /**
   * @deprecated use alternative to get permissions
   */
  public get isEditor$(): Observable<boolean> {
    return this.authenticated$.pipe(
      switchMap((authenticated) =>
        authenticated
          ? this.user$.pipe(map((user) => user.isEditor || user.isAdmin))
          : of(false)
      )
    );
  }

  /**
   * @deprecated use alternative to get permissions
   */
  public get isAdmin$(): Observable<boolean> {
    return this.authenticated$.pipe(
      switchMap((authenticated) =>
        authenticated ? this.user$.pipe(map((user) => user.isAdmin)) : of(false)
      )
    );
  }

  public async logout(): Promise<void> {
    await this.fireAuth.signOut();
    await this.router.navigate(['/events']);
  }

  public async login(): Promise<boolean> {
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
    return await this.authenticated$.pipe(first()).toPromise();
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
    return this.user$.pipe(
      map((user) => {
        if (user.canManageEvents) {
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
