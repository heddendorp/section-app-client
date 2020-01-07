/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { AuthError, CreateUserWithPassword, LoginWithPassword } from '../../shared/state/auth.actions';

@Component({
  selector: 'app-mail-signin',
  templateUrl: './mail-signin.component.html',
  styleUrls: ['./mail-signin.component.scss']
})
export class MailSigninComponent implements OnInit {
  loginForm: FormGroup;
  error = new BehaviorSubject('');

  constructor(
    fb: FormBuilder,
    private dialog: MatDialogRef<MailSigninComponent>,
    private authService: AuthService,
    private snack: MatSnackBar,
    private store: Store,
    private actions: Actions
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() {
    this.actions.pipe(ofActionDispatched(AuthError)).subscribe(async action => {
      switch (action.code) {
        case 'auth/email-already-in-use': {
          let options: string[];
          try {
            options = await this.authService.getLoginOptions(this.loginForm.get('email').value);
          } catch (e) {
            console.log(e);
          }
          if (options) {
            this.error.next(`This email is already in use, associated logins are: ${options.join(', ')}.`);
          } else {
            this.error.next('This email is already in use!');
          }
          break;
        }
        case 'auth/invalid-email': {
          this.error.next('Please enter a valid mail address!');
          break;
        }
        case 'auth/operation-not-allowed': {
          this.error.next('This operation is not allowed, please contact TUMi if this problem persists.');
          break;
        }
        case 'auth/weak-password': {
          this.error.next('The password you entered is not strong enough');
          break;
        }
        case 'auth/user-disabled': {
          this.error.next(
            'The user associated with this email is disabled, if you think this is a mistake, please contact TUMi.'
          );
          break;
        }
        case 'auth/user-not-found': {
          this.error.next('There was no user found for this email.');
          break;
        }
        case 'auth/wrong-password': {
          this.error.next('The password you entered does not match with our records!');
          this.loginForm.get('password').reset('');
          break;
        }
      }
      this.loginForm.enable();
    });
  }

  createUser() {
    this.loginForm.disable();
    const { email, password } = this.loginForm.value;
    this.store.dispatch(new CreateUserWithPassword(email, password)).subscribe(() => this.dialog.close());
  }

  logIn() {
    this.loginForm.disable();
    const { email, password } = this.loginForm.value;
    this.store.dispatch(new LoginWithPassword(email, password)).subscribe(() => this.dialog.close());
  }
}
