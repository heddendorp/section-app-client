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

import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-icon-toast',
  templateUrl: './icon-toast.component.html',
  styleUrls: ['./icon-toast.component.scss']
})
export class IconToastComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { icon?: string; action?: string; message: string; allowClose?: boolean },
    private snackbarRef: MatSnackBarRef<IconToastComponent>
  ) {}

  dismiss() {
    this.snackbarRef.dismissWithAction();
  }

  cancel() {
    this.snackbarRef.dismiss();
  }
}
