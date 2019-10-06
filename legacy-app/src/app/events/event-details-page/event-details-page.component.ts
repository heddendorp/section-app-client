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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { IconToastComponent } from '../../shared/components/icon-toast/icon-toast.component';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Student, UserService } from '../../shared/services/user.service';
import { AuthState } from '../../shared/state/auth.state';
import { sendEvent } from '../../shared/utility-functions';

@Component({
  selector: 'app-event-details-page',
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss']
})
export class EventDetailsPageComponent implements OnInit, OnDestroy {
  event$: Observable<TumiEvent>;
  signed$: Observable<boolean>;
  destroyed$ = new Subject();
  @Select(AuthState.isTutor) isTutor$: Observable<boolean>;
  @Select(AuthState.user) user$: Observable<Student>;

  constructor(
    private route: ActivatedRoute,
    private fireFunctions: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userService: UserService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.event$ = this.route.data.pipe(map(data => data.event));
    const eventWithTutors = this.route.paramMap.pipe(
      switchMap(params => this.userService.getEventWithUsers(params.get('eventId')))
    );
    const eventWithSignups = this.route.paramMap.pipe(
      switchMap(params => this.eventService.getEventWithRegistrations(params.get('eventId')))
    );
    this.event$ = this.isTutor$.pipe(
      switchMap(isTutor => (isTutor ? eventWithTutors : eventWithSignups)),
      startWith(this.route.snapshot.data.event),
      tap(event => sendEvent('view_event', { id: event.id, name: event.name }))
    );
    this.signed$ = this.event$.pipe(
      switchMap(event =>
        this.user$.pipe(
          map(
            user =>
              !!user &&
              (event.tutorSignups.includes(user.id) || event.userSignups.map(signup => signup.id).includes(user.id))
          )
        )
      )
    );
  }

  async registerTutor(eventId) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to sign up as a tutor for this event?`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      const snack = this.snackBar.openFromComponent(IconToastComponent, {
        data: { message: `Please wait while we're signing you up`, icon: 'wait' },
        duration: 0
      });
      await this.fireFunctions
        .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
          eventId,
          type: 'tutor'
        })
        .toPromise();
      sendEvent('event_tutor_signup', { eventId });
      snack.dismiss();
      await this.router.navigate(['events', 'my']);
    }
  }

  async registerStudent(eventId) {
    const snack = this.snackBar.openFromComponent(IconToastComponent, {
      data: { message: `Please wait while we're signing you up`, icon: 'wait' },
      duration: 0
    });
    await this.fireFunctions
      .httpsCallable<{ eventId: string; type: 'tutor' | 'student' }, any>('registerForEvent')({
        eventId,
        type: 'student'
      })
      .toPromise();
    sendEvent('event_user_signup', { eventId });
    snack.dismiss();
    await this.router.navigate(['events', 'my']);
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
