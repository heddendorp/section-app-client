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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { MailSigninComponent } from '../../components/mail-signin/mail-signin.component';
import { AuthService } from '../../shared/services/auth.service';
import { LoginWithFacebook, LoginWithGoogle, LoginWithOauth } from '../../shared/state/auth.actions';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPageComponent {
  consentControl = new FormControl(false);

  constructor(private authService: AuthService, private dialog: MatDialog, private store: Store) {}

  googleLogin() {
    this.store.dispatch(new LoginWithGoogle());
  }

  facebookLogin() {
    this.store.dispatch(new LoginWithFacebook());
  }

  oauthLogin(provider: string) {
    this.store.dispatch(new LoginWithOauth(provider));
  }

  passwordLogin() {
    this.dialog.open(MailSigninComponent);
  }
}
