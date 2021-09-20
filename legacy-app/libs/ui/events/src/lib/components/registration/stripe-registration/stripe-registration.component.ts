import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  GetUserPaymentStatusGQL,
  LoadEventQuery,
  RegisterWithStripePaymentGQL,
} from '@tumi/data-access';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../../../../../apps/tumi-app/src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-stripe-registration',
  templateUrl: './stripe-registration.component.html',
  styleUrls: ['./stripe-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripeRegistrationComponent implements OnInit {
  @Input() public event: LoadEventQuery['event'] | null = null;
  public userSetupForPayment$: Observable<boolean>;
  public processing = new BehaviorSubject(false);
  constructor(
    private getUserPaymentStatus: GetUserPaymentStatusGQL,
    private registerWithStripe: RegisterWithStripePaymentGQL,
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

  ngOnInit(): void {}

  async register() {
    this.processing.next(true);
    if (this.event) {
      const { data } = await this.registerWithStripe
        .mutate({ eventId: this.event.id })
        .toPromise();
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
}
