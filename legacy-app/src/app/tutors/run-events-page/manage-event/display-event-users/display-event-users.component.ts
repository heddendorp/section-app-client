import { formatCurrency } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { EventService, TumiEvent } from '../../../../shared/services/event.service';
import { MoneyService } from '../../../../shared/services/money.service';
import { Student } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-display-event-users',
  templateUrl: './display-event-users.component.html',
  styleUrls: ['./display-event-users.component.scss']
})
export class DisplayEventUsersComponent implements OnInit {
  @Input() event: TumiEvent;
  @Input() participantEmail: string;
  @Input() tutorEmail: string;
  isAdmin$;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private eventService: EventService,
    private moneyService: MoneyService
  ) {}

  ngOnInit() {
    this.isAdmin$ = this.authService.isAdmin;
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
        this.moneyService.addTransaction({
          value: this.event.price,
          comment: `On location event payment (${this.event.name}) payed by ${user.firstName} ${user.lastName} (${user.email})`
        });
        await this.eventService.payForEvent(user, this.event);
      }
    }
  }

  async removeUser(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to remove ${user.firstName} ${user.lastName} (${user.email}) from this event`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      await this.eventService.deregister(user, this.event);
    }
  }

  registerUser(user: Student) {
    this.eventService.attendEvent(user, this.event);
  }

  deregisterUser(user: Student) {
    this.eventService.attendEvent(user, this.event, false);
  }

  trackById(index, user: Student) {
    return user.id;
  }
}
