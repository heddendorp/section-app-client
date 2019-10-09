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
import { FormControl } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { TumiEvent } from '../../../../shared/services/event.service';
import { QrService } from '../../../../shared/services/qr.service';
import { Student } from '../../../../shared/services/user.service';
import { AuthState } from '../../../../shared/state/auth.state';

@Component({
  selector: 'app-display-event-info',
  templateUrl: './display-event-info.component.html',
  styleUrls: ['./display-event-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayEventInfoComponent implements OnInit {
  @Input() event: TumiEvent;
  @Output() addTickets = new EventEmitter();
  @Select(AuthState.isAdmin) isAdmin$: Observable<boolean>;
  @Select(AuthState.user) user$: Observable<Student>;
  isTutor: boolean;
  qrCode;
  ticketControl = new FormControl(0);

  constructor(private qrService: QrService) {}

  async ngOnInit() {
    const userId = await this.user$
      .pipe(
        first(),
        map(user => user.id)
      )
      .toPromise();
    this.isTutor = this.event.tutorSignups.includes(userId);
    console.log(
      JSON.stringify({
        user: userId,
        events: [{ action: 'collectMoney', id: this.event.id }]
      })
    );
    this.qrCode = await this.qrService.getURL({
      user: userId,
      events: [{ action: 'collectMoney', id: this.event.id }]
    });
  }
}
