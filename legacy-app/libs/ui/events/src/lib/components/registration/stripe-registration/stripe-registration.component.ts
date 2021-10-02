import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  DeregisterWithRefundGQL,
  GetUserPaymentStatusGQL,
  LoadEventQuery,
  RegisterWithStripePaymentGQL,
} from '@tumi/data-access';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../../../../../apps/tumi-app/src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';
import { MatDialog } from '@angular/material/dialog';
import { MoveEventDialogComponent } from '../../move-event-dialog/move-event-dialog.component';

@Component({
  selector: 'tumi-stripe-registration',
  templateUrl: './stripe-registration.component.html',
  styleUrls: ['./stripe-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripeRegistrationComponent {
  @Input() public event: LoadEventQuery['event'] | null = null;
  public userSetupForPayment$: Observable<boolean>;
  public processing = new BehaviorSubject(false);
  constructor(
    private getUserPaymentStatus: GetUserPaymentStatusGQL,
    private registerWithStripe: RegisterWithStripePaymentGQL,
    private deregisterWithRefund: DeregisterWithRefundGQL,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.userSetupForPayment$ = this.getUserPaymentStatus
      .watch()
      .valueChanges.pipe(
        map(
          ({ data }) =>
            !!data.currentUser?.currentTenant?.stripeData?.paymentMethodId ??
            false
        )
      );
  }

  get lastDeregistration() {
    return DateTime.fromISO(this.event?.start).minus({ days: 5 }).toJSDate();
  }

  get canDeregister() {
    return this.lastDeregistration > new Date();
  }

  get canMove() {
    return (
      DateTime.fromISO(this.event?.start).minus({ days: 1 }).toJSDate() >
      new Date()
    );
  }

  async register() {
    this.processing.next(true);
    if (this.event) {
      let data;
      try {
        const res = await this.registerWithStripe
          .mutate({ eventId: this.event.id })
          .toPromise();
        data = res.data;
      } catch (e) {
        this.processing.next(false);
        this.snackBar.open(`❗ There was an error: ${e.message}`);
        return;
      }
      if (data?.registerWithStripe.status === 'succeeded') {
        this.snackBar.open('✔️ You registration was successful');
      } else if (
        data?.registerWithStripe.status === 'requires_action' &&
        data?.registerWithStripe.client_secret
      ) {
        this.snackBar.open('⚠️ Additional information needed, please wait');
        const stripe = await loadStripe(environment.stripeKey);
        if (stripe) {
          await stripe.confirmCardPayment(
            data?.registerWithStripe.client_secret
          );
        }
      } else if (data?.registerWithStripe.status === 'processing') {
        this.snackBar.open('✔️ You registration was successful');
      } else {
        this.snackBar.open(
          '⚠️ There has been an error, we could not process your payment'
        );
      }
    }
    this.processing.next(false);
  }

  async deregister() {
    this.processing.next(true);
    try {
      await this.deregisterWithRefund
        .mutate({ eventId: this.event?.id ?? '' })
        .toPromise();
    } catch (e) {
      this.processing.next(false);
      this.snackBar.open(`❗ There was an error: ${e.message}`);
      return;
    }
    this.snackBar.open('✔️ Success: Refunds can take 5-8 days');
    this.processing.next(false);
  }

  moveEvent() {
    this.dialog.open(MoveEventDialogComponent, { data: { event: this.event } });
  }
}
