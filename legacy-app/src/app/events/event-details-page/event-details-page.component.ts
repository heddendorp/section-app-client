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
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { IconToastComponent } from '../../shared/components/icon-toast/icon-toast.component';
import { TumiEvent } from '../../shared/services/event.service';
import { Student } from '../../shared/services/user.service';
import { AuthState } from '../../shared/state/auth.state';
import { EventsState } from '../../shared/state/events.state';
import { LoadUser } from '../../shared/state/users.actions';
import { UsersState } from '../../shared/state/users.state';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
})
export class EventDetailsPageComponent implements OnInit {
  @Select(EventsState.selectedEvent) event$: Observable<TumiEvent>;
  registered$: Observable<boolean>;
  @Select(AuthState.isTutor) isTutor$: Observable<boolean>;
  @Select(EventsState.loaded) loaded$: Observable<boolean>;
  @Select(AuthState.user) user$: Observable<Student>;
  tutors$: Observable<Student[]>;

  constructor(
    private fireFunctions: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.registered$ = this.event$.pipe(
      filter((event) => !!event.registrations),
      switchMap((event) =>
        this.user$.pipe(
          map(
            (user) =>
              !!user &&
              (event.tutorSignups.includes(user.id) ||
                event.registrations.map((registration) => registration.id).includes(user.id)),
          ),
        ),
      ),
    );
    const isTutor = await this.isTutor$.pipe(first()).toPromise();
    if (isTutor) {
      const event = await this.event$.pipe(first()).toPromise();
      await this.store.dispatch(event.tutorSignups.map((id) => new LoadUser(id))).toPromise();
      this.tutors$ = this.store.select(UsersState.userList(event.tutorSignups));
    }
  }

  async registerTutor(eventId) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to sign up as a tutor for this event?`,
        },
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      const snack = this.snackBar.openFromComponent(IconToastComponent, {
        data: { message: `Please wait while we're signing you up`, icon: 'wait' },
        duration: 0,
      });
      await this.fireFunctions
        .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
          eventId,
          type: 'tutor',
        })
        .toPromise();
      snack.dismiss();
      await this.router.navigate(['events', 'my']);
    }
  }

  async registerStudent(eventId) {
    const snack = this.snackBar.openFromComponent(IconToastComponent, {
      data: { message: `Please wait while we're signing you up`, icon: 'wait' },
      duration: 0,
    });
    await this.fireFunctions
      .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
        eventId,
        type: 'student',
      })
      .toPromise();
    snack.dismiss();
    await this.router.navigate(['events', 'my']);
  }
}
