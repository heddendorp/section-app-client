import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventService } from '../../../../services/event.service';
import { AuthService } from '../../../../services/auth.service';
import { Observable } from 'rxjs';
import { MoneyService } from '../../../../services/money.service';

@Component({
  selector: 'app-event-participants',
  templateUrl: './event-participants.component.html',
  styleUrls: ['./event-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventParticipantsComponent {
  @Input() event: any;
  $isAdmin: Observable<boolean>;

  constructor(
    private eventService: EventService,
    private moneyService: MoneyService,
    auth: AuthService
  ) {
    this.$isAdmin = auth.isAdmin$;
  }

  async toggleRegistration(registration: any): Promise<void> {
    await this.eventService.updateRegistration(this.event.id, registration.id, {
      hasAttended: !registration.hasAttended,
    });
  }

  public async removeRegistration(
    registration: any,
    refund = false
  ): Promise<void> {
    if (this.event.hasFee && refund) {
      await this.moneyService.addEventTransaction(
        `Event Refund (${this.event.name}) payed to ${registration.user.firstName} ${registration.user.lastName} (${registration.user.email})`,
        this.event,
        registration.user,
        'refund'
      );
    }
    await this.eventService.removeRegistration(this.event.id, registration.id);
  }

  stopPropagation($event: MouseEvent): void {
    $event.stopImmediatePropagation();
  }

  async removeTutor(id: string): Promise<void> {
    await this.eventService.updateEvent(this.event.id, {
      tutorSignups: this.event.tutorSignups.filter((s: string) => s !== id),
    });
  }
}
