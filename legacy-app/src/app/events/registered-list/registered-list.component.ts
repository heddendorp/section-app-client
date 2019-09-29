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

import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { IconToastComponent } from '../../shared/components/icon-toast/icon-toast.component';
import { UserDataChangeComponent } from '../../shared/components/user-data-change/user-data-change.component';
import { AuthService } from '../../shared/services/auth.service';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Student, UserService } from '../../shared/services/user.service';
import { RefundDialogComponent } from '../components/refund-dialog/refund-dialog.component';

@Component({
  selector: 'app-registered-list',
  templateUrl: './registered-list.component.html',
  styleUrls: ['./registered-list.component.scss']
})
export class RegisteredListComponent implements OnInit {
  upcomingEvents$: Observable<TumiEvent[]>;
  passedEvents$: Observable<TumiEvent[]>;
  user$: Observable<Student>;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private dialog: MatDialog,
    public userService: UserService,
    private snackBar: MatSnackBar,
    private functions: AngularFireFunctions
  ) {}

  ngOnInit() {
    this.upcomingEvents$ = this.eventService.registeredEvents.pipe(
      map(events => events.filter(event => event.start.isAfter()))
    );
    this.passedEvents$ = this.eventService.registeredEvents.pipe(
      map(events => events.filter(event => event.start.isBefore()))
    );
    this.user$ = this.authService.user;
  }

  async sendVerification() {
    await this.authService.sendVerification();
    this.snackBar.openFromComponent(IconToastComponent, {
      data: {
        message: 'Email sent, please check your mail!',
        icon: 'check-mail'
      }
    });
  }

  async changeData() {
    const user = await this.user$.pipe(first()).toPromise();
    const result = await this.dialog
      .open(UserDataChangeComponent, { data: { user }, disableClose: true })
      .afterClosed()
      .toPromise();
    if (result) {
      await this.userService.save(result);
    }
  }

  async refund(event) {
    const user = await this.user$.pipe(first()).toPromise();
    this.dialog.open(RefundDialogComponent, { data: { event, user } });
  }

  async deregister(event) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: { text: `Do you really want to remove your registration from ${event.name}?` }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      const snack = this.snackBar.openFromComponent(IconToastComponent, {
        data: { message: `Please wait while we're removing your registration`, icon: 'wait' },
        duration: 0
      });
      await this.functions
        .httpsCallable('removeRegistration')({ eventId: event.id })
        .toPromise();
      snack.dismiss();
    }
  }
}
