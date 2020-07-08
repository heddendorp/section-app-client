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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { CartService } from '../../../shared/services/cart.service';
import { TumiEvent } from '../../../shared/services/event.service';
import { QrService } from '../../../shared/services/qr.service';
import { Student } from '../../../shared/services/user.service';
import { AuthState } from '../../../shared/state/auth.state';

@Component({
  selector: 'app-event-details-display',
  templateUrl: './event-details-display.component.html',
  styleUrls: ['./event-details-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsDisplayComponent implements OnInit {
  @Input() event: TumiEvent;
  @Input() tutors: Student[];
  @Input() signed: boolean;
  @Output() tutorSignup = new EventEmitter();
  @Output() studentSignup = new EventEmitter();
  @Select(AuthState.profileIncomplete) incompleteProfile$: Observable<boolean>;
  qrCode = new BehaviorSubject(null);
  eventFull: boolean;
  @Select(AuthState.isTutor) isTutor$: Observable<boolean>;
  @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<boolean>;
  @Select(AuthState.user) user$: Observable<Student>;
  email$;

  constructor(private qrService: QrService, private cartService: CartService) {}

  get tutorList() {
    return this.tutors.map((user) => `${user.firstName} ${user.lastName}`).join(', ');
  }

  ngOnInit() {
    this.eventFull = this.event.usersSignedUp >= this.event.participantSpots && !this.event.isInternal;
    this.email$ = this.user$.pipe(map((user) => user.email));
    this.user$
      .pipe(
        filter((user) => !!user),
        tap((user) =>
          console.log(
            JSON.stringify({
              user: user.id,
              events: [{ id: this.event.id, action: 'register' }],
            }),
          ),
        ),
        first(),
      )
      .subscribe((user) =>
        this.qrService
          .getURL({
            user: user.id,
            events: [{ id: this.event.id, action: 'register' }],
          })
          .then((url) => this.qrCode.next(url)),
      );
  }

  saveEvent() {
    this.cartService.addEvent(this.event);
  }
}
