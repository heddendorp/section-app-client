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
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { EventService } from '../../../shared/services/event.service';
import { MoneyService } from '../../../shared/services/money.service';
import { UserService } from '../../../shared/services/user.service';
import { EventsState } from '../../../shared/state/events.state';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent implements OnInit {
  @Select(EventsState.selectedWithUsers) event$: Observable<any>;
  tutorEmail$: Observable<string>;
  studentEmail$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private evenService: EventService,
    private moneyService: MoneyService
  ) {}

  ngOnInit() {
    this.tutorEmail$ = this.event$.pipe(
      filter(event => !!event),
      map(event => event.tutorUsers.map(tutor => tutor.email).join('; '))
    );
    this.studentEmail$ = this.event$.pipe(
      filter(event => !!event),
      map(event => event.coming.map(registration => registration.user.email).join('; '))
    );
  }

  async addTickets(amount) {
    const event = await this.event$.pipe(first()).toPromise();
    if (amount) {
      const fullCost = event.price * amount;
      this.moneyService.addTransaction({
        value: fullCost,
        comment: `${amount} external ticket sales added for ${event.name}`
      });
      await this.evenService.sellTickets(event, amount);
    }
  }
}
