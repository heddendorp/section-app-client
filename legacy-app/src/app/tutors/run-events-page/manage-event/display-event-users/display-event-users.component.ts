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

import { formatCurrency } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { EventService, EventSignup, TumiEvent } from '../../../../shared/services/event.service';
import { MoneyService } from '../../../../shared/services/money.service';
import { Student } from '../../../../shared/services/user.service';
import { AuthState } from '../../../../shared/state/auth.state';

@Component({
  selector: 'app-display-event-users',
  templateUrl: './display-event-users.component.html',
  styleUrls: ['./display-event-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayEventUsersComponent implements OnInit {
  @Input() event: TumiEvent;
  @Input() participantEmail: string;
  @Input() tutorEmail: string;
  @Select(AuthState.isAdmin) isAdmin$: Observable<boolean>;
  columns$;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private eventService: EventService,
    private moneyService: MoneyService,
    media: MediaObserver
  ) {
    this.columns$ = media.asObservable().pipe(
      map(checks => !checks.filter(check => check.matches).find(match => match.mqAlias === 'gt-sm')),
      map(simple => (simple ? ['info', 'actions'] : ['info', 'phone', 'actions']))
    );
  }

  ngOnInit() {
    /*console.log(
      this.event.userSignups
        .filter(reg => reg.hasPayed)
        .reduce((acc, curr) => {
          let res = acc + '|' + curr.user.email;
          if (curr.user.academicMail) {
            res += '|' + curr.user.academicMail;
          }
          return res;
        }, '')
    );*/
  }

  get encodedEventName() {
    return encodeURIComponent(`[TUMi] ${this.event.name}`);
  }

  async kickTutor(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to remove ${user.firstName} ${user.lastName} (${user.email}) as a tutor from this event`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      this.eventService.removeTutorFromEvent(user, this.event);
    }
  }

  async makeTransaction(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to confirm payment of ${formatCurrency(this.event.price, 'en-DE', 'EUR')} for ${
            user.firstName
          } ${user.lastName} (${user.email})?`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      if (this.event.hasFee) {
        this.moneyService.addEventTransaction(
          `On location event payment (${this.event.name}) payed by ${user.firstName} ${user.lastName} (${user.email})`,
          this.event,
          user,
          'onLocationPayment'
        );
      }
    }
  }

  async collectPayment(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to confirm payment of ${formatCurrency(this.event.price, 'en-DE', 'EUR')} for ${
            user.firstName
          } ${user.lastName} (${user.email})?`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      if (this.event.hasFee) {
        this.moneyService.addEventTransaction(
          `On location event payment (${this.event.name}) payed by ${user.firstName} ${user.lastName} (${user.email})`,
          this.event,
          user,
          'onLocationPayment'
        );
        await this.eventService.payForEvent(user, this.event);
      }
    }
  }

  async removeUser(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to remove ${user.firstName} ${user.lastName} (${user.email}) from this event? No mail will be sent but people from the wait list might move up`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      await this.eventService.deregister(user, this.event);
    }
  }

  async bumpUser(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to bump ${user.firstName} ${user.lastName} (${user.email}) from the wait list? No mail informing them will be sent!`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      await this.eventService.removeFromWaitlist(user, this.event);
    }
  }

  registerUser(user: Student) {
    this.eventService.attendEvent(user, this.event);
  }

  deregisterUser(user: Student) {
    this.eventService.attendEvent(user, this.event, false);
  }

  trackById(index, item: Student | EventSignup) {
    return item.id;
  }
}
