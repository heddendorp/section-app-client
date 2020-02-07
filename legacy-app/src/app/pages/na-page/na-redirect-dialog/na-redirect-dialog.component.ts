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

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-na-redirect-dialog',
  templateUrl: './na-redirect-dialog.component.html',
  styleUrls: ['./na-redirect-dialog.component.scss']
})
export class NaRedirectDialogComponent {
  constructor(private dialog: MatDialogRef<NaRedirectDialogComponent>) {}

  decideRedirect(redirect: boolean) {
    if (redirect) {
      localStorage.setItem('@@REDIRECT', JSON.stringify('/na'));
    } else {
      localStorage.setItem('@@REDIRECT', JSON.stringify(false));
    }
    this.dialog.close();
  }
}
