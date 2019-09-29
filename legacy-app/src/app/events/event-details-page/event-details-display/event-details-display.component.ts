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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { AuthService } from '../../../shared/services/auth.service';
import { TumiEvent } from '../../../shared/services/event.service';
import { QrService } from '../../../shared/services/qr.service';

@Component({
  selector: 'app-event-details-display',
  templateUrl: './event-details-display.component.html',
  styleUrls: ['./event-details-display.component.scss']
})
export class EventDetailsDisplayComponent implements OnInit {
  @Input() event: TumiEvent;
  @Input() signed: boolean;
  @Output() tutorSignup = new EventEmitter();
  @Output() studentSignup = new EventEmitter();
  qrCode = new BehaviorSubject(null);
  eventFull: boolean;
  isTutor$;
  isAuthenticated$;
  email$;

  constructor(private qrService: QrService, private authService: AuthService) {}

  get tutorList() {
    return this.event.tutorUsers.map(user => `${user.firstName} ${user.lastName}`).join(', ');
  }

  ngOnInit() {
    this.eventFull = this.event.usersSignedUp >= this.event.participantSpots && !this.event.isInternal;
    this.isTutor$ = this.authService.isTutor;
    this.isAuthenticated$ = this.authService.authenticated;
    this.email$ = this.authService.user.pipe(map(user => user.email));
    this.authService.user
      .pipe(
        filter(user => !!user),
        tap(user =>
          console.log(
            JSON.stringify({
              user: user.id,
              events: [{ id: this.event.id, action: 'register' }]
            })
          )
        ),
        first()
      )
      .subscribe(user =>
        this.qrService
          .getURL({
            user: user.id,
            events: [{ id: this.event.id, action: 'register' }]
          })
          .then(url => this.qrCode.next(url))
      );
  }
}
