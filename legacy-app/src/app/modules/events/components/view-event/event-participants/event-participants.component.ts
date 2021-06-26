import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { User } from '@tumi/models';
import { EventService, MoneyService } from '@tumi/services';
import { first, map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '@tumi/modules/shared';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-participants',
  templateUrl: './event-participants.component.html',
  styleUrls: ['./event-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventParticipantsComponent {
  @Input() event: any;
  @Input() user: User;

  constructor(
    private eventService: EventService,
    private moneyService: MoneyService,
    private dialog: MatDialog,
    private clipboard: Clipboard
  ) {}

  async toggleRegistration(registration: any): Promise<void> {
    await this.eventService.updateRegistration(this.event.id, registration.id, {
      hasAttended: !registration.hasAttended,
    });
  }

  public calculateTotal(registrations: any[], field: string) {
    return registrations
      .filter((item) => item?.paypal?.completed)
      .reduce((acc, item) => acc + item.paypal[field], 0);
  }

  public calculateStripeInfo(registrations: any[]) {
    const paidNum = registrations.filter(
      (item) => item?.stripe?.payment_status === 'paid'
    ).length;
    const fullVol = paidNum * this.event.price;
    const fullFees =
      registrations
        .filter((item) => item?.stripe?.payment_status === 'paid')
        .reduce((acc, curr) => acc + curr.stripe.fee, 0) / 100;
    return {
      fullVol,
      fullFees,
      netVol: fullVol - fullFees,
    };
  }

  public async removeRegistration(
    registration: any,
    refund = false
  ): Promise<void> {
    if (
      this.event.hasFee &&
      refund &&
      this.event.registrationMode === 'office'
    ) {
      await this.moneyService.addEventTransaction(
        // eslint-disable-next-line max-len
        `Event Refund (${this.event.name}) payed to ${registration.user.firstName} ${registration.user.lastName} (${registration.user.email})`,
        this.event,
        registration.user,
        'refund'
      );
    }
    if (
      this.event.hasFee &&
      refund &&
      this.event.registrationMode === 'stripe'
    ) {
      const proceed = await this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            title: `Do you really want to issue a stripe refund to this user?`,
            result: true,
          },
        })
        .afterClosed()
        .toPromise();
      if (!proceed) return;
    }
    await this.eventService.removeRegistration(this.event.id, registration.id);
  }

  stopPropagation($event: MouseEvent): void {
    $event.stopImmediatePropagation();
  }

  async copyStudentMails(): Promise<void> {
    const mailString = await this.event.registrations
      .pipe(
        map((registrations: any) =>
          registrations.map((r: any) => r.user.email).join('; ')
        ),
        first()
      )
      .toPromise();
    const pending = this.clipboard.beginCopy(mailString);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

  async removeTutor(id: string): Promise<void> {
    await this.eventService.updateEvent(this.event.id, {
      tutorSignups: this.event.tutorSignups.filter((s: string) => s !== id),
    });
  }

  async updateWaitListStatus(
    registration: any,
    isWaitList: boolean
  ): Promise<void> {
    await this.eventService.updateRegistration(this.event.id, registration.id, {
      isWaitList,
    });
  }

  async copyTutorMails() {
    const mailString = await this.event.registeredTutors
      .pipe(
        map((tutors: any) =>
          tutors.map((tutor: any) => tutor.email).join('; ')
        ),
        first()
      )
      .toPromise();
    const pending = this.clipboard.beginCopy(mailString);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }
}
