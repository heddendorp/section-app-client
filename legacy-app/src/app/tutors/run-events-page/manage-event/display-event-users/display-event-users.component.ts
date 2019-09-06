import { Component, Input, OnInit } from '@angular/core';
import { EventService, TumiEvent } from '../../../../shared/services/event.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { Student } from '../../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MoneyService } from '../../../../shared/services/money.service';

@Component({
  selector: 'app-display-event-users',
  templateUrl: './display-event-users.component.html',
  styleUrls: ['./display-event-users.component.scss']
})
export class DisplayEventUsersComponent implements OnInit {
  @Input() event: TumiEvent;
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
  async registerOnlineUser(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to confirm attendance for ${user.firstName} ${user.lastName} (${user.email}) ${
            this.event.hasFee ? ' and that they payed ' + this.event.price + ' Euro' : ''
          }?`
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
      }
      this.eventService.attendEvent(user, this.event, true);
    }
  }
  async registerOfficeUser(user: Student) {
    const proceed = await this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          text: `Do you really want to confirm attendance for ${user.firstName} ${user.lastName} (${user.email})`
        }
      })
      .afterClosed()
      .toPromise();
    if (proceed) {
      this.eventService.attendEvent(user, this.event);
    }
  }
}
