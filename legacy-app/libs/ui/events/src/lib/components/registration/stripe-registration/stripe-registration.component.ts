import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  DeregisterWithRefundGQL,
  GetUserPaymentStatusGQL,
  LoadEventQuery,
  RegisterWithStripePaymentGQL,
  SubmissionItemType,
  SubmissionTime,
} from '@tumi/data-access';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../../../../../apps/tumi-app/src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';
import { MatDialog } from '@angular/material/dialog';
import { MoveEventDialogComponent } from '../../move-event-dialog/move-event-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tumi-stripe-registration',
  templateUrl: './stripe-registration.component.html',
  styleUrls: ['./stripe-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripeRegistrationComponent implements OnChanges {
  @Input() public event: LoadEventQuery['event'] | null = null;
  @Input() public user: LoadEventQuery['currentUser'] | null = null;
  public infoForm: FormGroup | undefined;
  public userSetupForPayment$: Observable<boolean>;
  public processing = new BehaviorSubject(false);
  public infoCollected$ = new BehaviorSubject(false);
  public SubmissionItemType = SubmissionItemType;
  constructor(
    private getUserPaymentStatus: GetUserPaymentStatusGQL,
    private registerWithStripe: RegisterWithStripePaymentGQL,
    private deregisterWithRefund: DeregisterWithRefundGQL,
    private dialog: MatDialog,
    private fb: FormBuilder,
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.event) {
      const event = changes.event.currentValue as LoadEventQuery['event'];
      if (event?.submissionItems?.length) {
        this.infoCollected$.next(false);
        this.infoForm = this.fb.group(
          event.submissionItems
            .filter(
              (item) => item.submissionTime === SubmissionTime.Registration
            )
            .reduce(
              (previousValue, currentValue) => ({
                ...previousValue,
                [currentValue.name]: ['', Validators.required],
              }),
              {}
            )
        );
      } else {
        this.infoCollected$.next(true);
      }
    }
  }

  get lastDeregistration() {
    if (!this.event?.start) {
      return new Date();
    }
    return DateTime.fromISO(this.event?.start).minus({ days: 5 }).toJSDate();
  }

  get canDeregister() {
    return this.lastDeregistration > new Date();
  }

  get canMove() {
    if (!this.event?.start) {
      return new Date();
    }
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
        const res = await firstValueFrom(
          this.registerWithStripe.mutate({
            eventId: this.event.id,
            submissions: this.infoForm?.value,
          })
        );
        data = res.data;
      } catch (e) {
        this.processing.next(false);
        this.snackBar.open(`❗ There was an error: ${e.message}`, undefined, {
          duration: 10000,
        });
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
