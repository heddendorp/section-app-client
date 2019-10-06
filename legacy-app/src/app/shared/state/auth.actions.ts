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

import { Student } from '../services/user.service';

export class LoginWithGoogle {
  static readonly type = '[Auth] Login with google';
}

export class LoginWithFacebook {
  static readonly type = '[Auth] Login with facebook';
}

export class LoginWithOauth {
  static readonly type = '[Auth] Login with Oauth';

  constructor(public provider: string) {}
}

export class LoginWithPassword {
  static readonly type = '[Auth] Login with password';

  constructor(public email: string, public password: string) {}
}

export class CreateUserWithPassword {
  static readonly type = '[Auth] Create user with Oauth';

  constructor(public email: string, public password: string) {}
}

export class SetUser {
  static readonly type = '[Auth] Set user';

  constructor(public user: Student) {}
}

export class Logout {
  static readonly type = '[Auth] Log out';
}

export class AuthError {
  static readonly type = '[Auth] Error encountered';

  constructor(public code: string) {}
}
