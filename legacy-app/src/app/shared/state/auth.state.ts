/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { auth } from 'firebase/app';
import { map, switchMap, tap } from 'rxjs/operators';
import { Student, UserService } from '../services/user.service';
import { gtagFunction, sendEvent } from '../utility-functions';
import {
  AuthError,
  CreateUserWithPassword,
  LoginWithFacebook,
  LoginWithGoogle,
  LoginWithOauth,
  LoginWithPassword,
  Logout,
  SetUser
} from './auth.actions';

export interface AuthStateModel {
  user: Student | null;
  loaded: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    loaded: false
  }
})
export class AuthState implements NgxsOnInit {
  constructor(private angularFireAuth: AngularFireAuth, private userService: UserService, private router: Router) {
    this.angularFireAuth.auth.getRedirectResult().then(result => {
      if (result.user) {
        sendEvent('login', { method: result.additionalUserInfo.providerId });
        this.router.navigate(['events', 'list']);
      }
    });
  }

  @Selector()
  static user(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.user;
  }

  @Selector()
  static isAdmin(state: AuthStateModel) {
    return state.user.isAdmin;
  }

  @Selector()
  static isTutor(state: AuthStateModel) {
    return state.user.isAdmin || state.user.isTutor;
  }

  @Selector()
  static isEditor(state: AuthStateModel) {
    return state.user.isAdmin || state.user.isAdmin;
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    this.angularFireAuth.user
      .pipe(
        tap(user => {
          if (localStorage.getItem('preventUserID') !== 'false') {
            gtagFunction('config', 'G-04YZMLFE3Z', {
              user_id: user.uid
            });
          }
        }),
        switchMap(user =>
          this.userService
            .getUser(user.uid)
            .pipe(map(student => Object.assign({}, student, { id: user.uid, verified: user.emailVerified })))
        )
      )
      .subscribe(user => ctx.dispatch(new SetUser(user)));
  }

  @Action(LoginWithGoogle)
  async loginWithGoogle() {
    await this.angularFireAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  @Action(LoginWithFacebook)
  async loginWithFacebook() {
    await this.angularFireAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  @Action(LoginWithOauth)
  async LoginWithOauth(ctx: StateContext<AuthStateModel>, action: LoginWithOauth) {
    await this.angularFireAuth.auth.signInWithRedirect(new auth.OAuthProvider(action.provider));
  }

  @Action(LoginWithPassword)
  async LoginWithPassword(ctx: StateContext<AuthStateModel>, action: LoginWithPassword) {
    try {
      await this.angularFireAuth.auth.signInWithEmailAndPassword(action.email, action.password);
    } catch (e) {
      ctx.dispatch(new AuthError(e.code));
      throw e;
    }
  }

  @Action(CreateUserWithPassword)
  async CreateUserWithPassword(ctx: StateContext<AuthStateModel>, action: CreateUserWithPassword) {
    try {
      await this.angularFireAuth.auth.createUserWithEmailAndPassword(action.email, action.password);
    } catch (e) {
      ctx.dispatch(new AuthError(e.code));
      throw e;
    }
  }

  @Action(Logout)
  async logout(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();
    await this.router.navigate(['events', 'list']);
    await this.angularFireAuth.auth.signOut();

    ctx.setState({
      ...state,
      user: null
    });
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AuthStateModel>, action: SetUser) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      user: action.user,
      loaded: true
    });
  }
}
