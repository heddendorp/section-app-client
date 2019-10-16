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
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, share, startWith, switchMap } from 'rxjs/operators';
import { EventService, TumiEvent } from '../../../shared/services/event.service';
import { MoneyService } from '../../../shared/services/money.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent implements OnInit {
  event$: Observable<TumiEvent>;
  tutorEmail$: Observable<string>;
  studentEmail$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private evenService: EventService,
    private moneyService: MoneyService
  ) {}

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      switchMap(params => this.userService.getEventWithUsers(params.get('eventId'))),
      share(),
      startWith(this.route.snapshot.data[0]),
      map(event => {
        return {
          ...event,
          coming: [
            ...event.userSignups.filter(item => !item.hasAttended && !item.isWaitList),
            ...event.userSignups.filter(item => item.hasAttended && !item.isWaitList)
          ],
          waitlist: event.userSignups.filter(item => item.isWaitList)
        };
      })
    );
    this.tutorEmail$ = this.event$.pipe(map(event => event.tutorUsers.map(tutor => tutor.email).join('; ')));
    this.studentEmail$ = this.event$.pipe(map(event => event.coming.map(signup => signup.user.email).join('; ')));
    // this.tutorEmail$ = this.event$.pipe(
    //   map(event => 'mailto:' + event.tutorUsers.map(tutor => tutor.email).join('; '))
    // );
    // this.studentEmail$ = this.event$.pipe(
    //   map(
    //     event =>
    //       `mailto:tumi-koordination@zv.tum.de?subject=${encodeURIComponent(
    //         `[TUMi] ${event.name}`
    //       )}&cc=${event.tutorUsers.map(user => user.email).join('; ')}&bcc=${event.coming
    //         .map(signup => signup.user.email)
    //         .join('; ')}`
    //   )
    // );
  }

  async addTickets(ammount) {
    const event = await this.event$.pipe(first()).toPromise();
    if (ammount) {
      const fullCost = event.price * ammount;
      this.moneyService.addTransaction({
        value: fullCost,
        comment: `${ammount} external ticket sales added for ${event.name}`
      });
      this.evenService.sellTickets(event, ammount);
    }
  }
}
