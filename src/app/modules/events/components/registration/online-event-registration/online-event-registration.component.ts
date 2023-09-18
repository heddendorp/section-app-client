import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  DeregisterFromEventGQL,
  LoadEventQuery,
  RegisterForEventGQL,
} from '@tumi/legacy-app/generated/generated';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { CheckAdditionalDataComponent } from '../check-additional-data/check-additional-data.component';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-online-event-registration',
  templateUrl: './online-event-registration.component.html',
  styleUrls: ['./online-event-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    CheckAdditionalDataComponent,
    MatButtonModule,
    MatProgressBarModule,
    AsyncPipe,
    DatePipe,
    ExtendDatePipe,
  ],
})
export class OnlineEventRegistrationComponent {
  @Input() public event: LoadEventQuery['event'] | null = null;
  @Input() public deRegistrationOptions: {
    deRegistrationPossible: boolean;
    minimumDaysForDeRegistration: number;
    movePossible: boolean;
    minimumDaysForMove: number;
  } | null = null;
  public processing = new BehaviorSubject(false);
  public infoCollected$ = new BehaviorSubject<unknown | null>(null);
  constructor(
    private registerForEvent: RegisterForEventGQL,
    private deregistrationMutation: DeregisterFromEventGQL,
    private snackBar: MatSnackBar,
  ) {}

  get lastDeRegistration() {
    if (!this.event?.start || !this.deRegistrationOptions) {
      return new Date();
    }
    return DateTime.fromISO(this.event?.start)
      .minus({ days: this.deRegistrationOptions.minimumDaysForDeRegistration })
      .toJSDate();
  }
  get lastMove() {
    if (!this.event?.start || !this.deRegistrationOptions) {
      return new Date();
    }
    return DateTime.fromISO(this.event?.start)
      .minus({ days: this.deRegistrationOptions.minimumDaysForMove })
      .toJSDate();
  }

  get canDeregister() {
    if (!this.deRegistrationOptions?.deRegistrationPossible) {
      return {
        result: false,
        reason: 'De registrations are not allowed for this event',
      };
    }
    if (this.event?.activeRegistration?.didAttend) {
      return { result: false, reason: 'You already attended this event' };
    }
    if (this.event?.activeRegistration?.status !== 'SUCCESSFUL') {
      return {
        result: false,
        reason: 'Your registration is not successful yet',
      };
    }
    if (!this.event?.start || this.lastDeRegistration < new Date()) {
      return {
        result: false,
        reason: `You can only de register this event until ${this.deRegistrationOptions?.minimumDaysForDeRegistration} days before it starts`,
      };
    }
    return { result: true, reason: '' };
  }

  get canMove() {
    if (!this.deRegistrationOptions?.movePossible) {
      return { result: false, reason: 'Moves are not allowed for this event' };
    }
    if (this.event?.activeRegistration?.didAttend) {
      return { result: false, reason: 'You already attended this event' };
    }
    if (this.event?.activeRegistration?.status !== 'SUCCESSFUL') {
      return {
        result: false,
        reason: 'Your registration is not successful yet',
      };
    }
    if (!this.event?.start || this.lastMove < new Date()) {
      return {
        result: false,
        reason: `You can only move this event until ${this.deRegistrationOptions?.minimumDaysForMove} days before it starts`,
      };
    }
    return { result: true, reason: '' };
  }

  public async register() {
    this.processing.next(true);
    try {
      await firstValueFrom(
        this.registerForEvent.mutate({
          eventId: this.event?.id ?? '',
          submissions: this.infoCollected$.value,
        }),
      );
    } catch (e) {
      this.processing.next(false);
      if (e instanceof Error) {
        this.snackBar.open(`❗ There was an error: ${e.message}`);
      }
      return;
    }
    this.processing.next(false);
  }

  async deregister() {
    this.processing.next(true);
    try {
      await firstValueFrom(
        this.deregistrationMutation.mutate({
          registrationId: this.event?.activeRegistration?.id ?? '',
        }),
      );
    } catch (e: unknown) {
      this.processing.next(false);
      if (e instanceof Error) {
        this.snackBar.open(`❗ There was an error: ${e.message}`);
      }
      return;
    }
    this.snackBar.open('✔️ Success');
    this.processing.next(false);
  }

  registerAdditionalData($event: unknown): void {
    this.infoCollected$.next($event);
  }
}
