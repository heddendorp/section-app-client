import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MoveEventDialogComponent } from '../../move-event-dialog/move-event-dialog.component';
import { BehaviorSubject, firstValueFrom, ReplaySubject } from 'rxjs';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { DateTime } from 'luxon';
import {
  CancelPaymentGQL,
  DeregisterFromEventGQL,
  LoadEventQuery,
  LoadUserForEventQuery,
  RegisterForEventGQL,
  SubmissionItemType,
  TransactionDirection,
} from '@tumi/legacy-app/generated/generated';
import { MatDialog } from '@angular/material/dialog';
import { Price } from '../../../../../../../../shared/data-types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';

@Component({
  selector: 'app-stripe-event-registration',
  templateUrl: './stripe-event-registration.component.html',
  styleUrls: ['./stripe-event-registration.component.scss'],
})
export class StripeEventRegistrationComponent implements OnChanges {
  @Input() public event: LoadEventQuery['event'] | null = null;
  @Input() public user: LoadUserForEventQuery['currentUser'] | null = null;
  @Input() public bestPrice: Price | null = null;
  public availablePrices$ = new ReplaySubject<Price[]>(1);
  public priceControl = new UntypedFormControl(null, Validators.required);
  public processing = new BehaviorSubject(false);
  public infoCollected$ = new BehaviorSubject<unknown | null>(null);
  public SubmissionItemType = SubmissionItemType;

  constructor(
    private registerForEventGQL: RegisterForEventGQL,
    private deregisterFromEventGQL: DeregisterFromEventGQL,
    private cancelPaymentGQL: CancelPaymentGQL,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private permissions: PermissionsService
  ) {}

  get lastDeregistration() {
    if (!this.event?.start) {
      return new Date();
    }
    return DateTime.fromISO(this.event?.start).minus({ days: 5 }).toJSDate();
  }

  get lastPayment() {
    if (!this.activeStripePayment) {
      return new Date();
    }
    return DateTime.fromISO(this.activeStripePayment?.createdAt)
      .plus({ minutes: 30 })
      .toJSDate();
  }

  get canDeregisterInTime() {
    return this.lastDeregistration > new Date();
  }

  get canDeregister() {
    return (
      this.lastDeregistration > new Date() ||
      (new Date() < this.event?.start &&
        (this.event?.participantLimit ?? 0) <
          (this.event?.participantRegistrationCount ?? 0))
    );
  }

  get canMove() {
    if (!this.event?.start) {
      return false;
    }
    return (
      DateTime.fromISO(this.event?.start).minus({ days: 1 }).toJSDate() >
      new Date()
    );
  }

  get activeStripePayment() {
    const payment = this.event?.activeRegistration?.transactions?.find(
      (transaction) => transaction.direction === TransactionDirection.UserToTumi
    )?.stripePayment;
    return payment;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['event']) {
      const prices = await firstValueFrom(
        this.permissions.getPricesForUser(
          changes['event'].currentValue.prices.options
        )
      );
      if (this.bestPrice) {
        this.priceControl.setValue(this.bestPrice);
      }
      this.availablePrices$.next(prices);
    }
    if (changes['bestPrice']) {
      this.priceControl.setValue(this.bestPrice);
    }
  }

  async cancelPayment() {
    this.processing.next(true);
    if (this.event && this.event.activeRegistration) {
      try {
        await firstValueFrom(
          this.cancelPaymentGQL.mutate({
            registrationId: this.event.activeRegistration.id,
          })
        );
        this.processing.next(false);
      } catch (e: unknown) {
        this.processing.next(false);
        if (e instanceof Error) {
          this.snackBar.open(`❗ There was an error: ${e.message}`, undefined, {
            duration: 10000,
          });
          this.processing.next(false);
        }
      }
    }
  }

  async register() {
    this.processing.next(true);

    if (this.event) {
      let data;
      try {
        const res = await firstValueFrom(
          this.registerForEventGQL.mutate({
            eventId: this.event.id,
            price: this.priceControl.value,
            submissions: this.infoCollected$.value,
          })
        );
        data = res.data;

        const payment =
          data?.registerForEvent.activeRegistration?.transactions?.find(
            (transaction) =>
              transaction.direction === TransactionDirection.UserToTumi
          )?.stripePayment;

        if (!payment) {
          throw new Error('No payment found');
        }
        await this.openPaymentSession(payment.checkoutUrl);
      } catch (e: unknown) {
        this.processing.next(false);
        if (e instanceof Error) {
          this.snackBar.open(`❗ There was an error: ${e.message}`, undefined, {
            duration: 10000,
          });
        }
        return;
      }
    }
    this.processing.next(false);
  }

  async deregister() {
    this.processing.next(true);
    try {
      await firstValueFrom(
        this.deregisterFromEventGQL.mutate({
          registrationId: this.event?.activeRegistration?.id ?? '',
        })
      );
    } catch (e: unknown) {
      this.processing.next(false);
      if (e instanceof Error) {
        this.snackBar.open(`❗ There was an error: ${e.message}`);
      }
      return;
    }
    this.snackBar.open('✔️ Success: Refunds can take 5-10 business days');
    this.processing.next(false);
  }

  moveEvent(): void {
    this.dialog.open(MoveEventDialogComponent, {
      data: { event: this.event },
      panelClass: 'modern',
    });
  }

  registerAdditionalData($event: unknown): void {
    this.infoCollected$.next($event);
  }

  async openPaymentSession(checkoutSession:string|null = '') {
    if(!checkoutSession){
      return;
    }
    location.href = checkoutSession;
  }
}
