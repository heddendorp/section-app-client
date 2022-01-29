import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  DeregisterFromEventGQL,
  LoadEventQuery,
  RegisterForEventGQL,
  SubmissionItemType,
} from '@tumi/data-access';
import { BehaviorSubject, firstValueFrom, ReplaySubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';
import { MatDialog } from '@angular/material/dialog';
import { MoveEventDialogComponent } from '../../move-event-dialog/move-event-dialog.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PermissionsService } from '../../../../../../auth/src/lib/services/permissions.service';
import { Price } from '@tumi/shared/data-types';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../../../../../apps/tumi-app/src/environments/environment';

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
  public availablePrices$ = new ReplaySubject<Price[]>(1);
  public priceControl = new FormControl(null, Validators.required);
  public processing = new BehaviorSubject(false);
  public infoCollected$ = new BehaviorSubject<unknown | null>(null);
  public SubmissionItemType = SubmissionItemType;

  constructor(
    private registerForEventGQL: RegisterForEventGQL,
    private deregisterFromEventGQL: DeregisterFromEventGQL,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private permissions: PermissionsService
  ) {}

  get lastDeregistration() {
    if (!this.event?.start) {
      return new Date();
    }
    return DateTime.fromISO(this.event?.start).minus({ days: 5 }).toJSDate();
  }

  get lasPayment() {
    if (!this.event?.activeRegistration?.payment?.createdAt) {
      return new Date();
    }
    return DateTime.fromISO(this.event?.activeRegistration?.payment?.createdAt)
      .plus({ hours: 1 })
      .toJSDate();
  }

  get canDeregister() {
    return this.lastDeregistration > new Date();
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

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.event) {
      const prices = await firstValueFrom(
        this.permissions.getPricesForUser(
          changes.event.currentValue.prices.options
        )
      );
      const defaultPrice = prices.find((p) => p.defaultPrice);
      if (defaultPrice) {
        this.priceControl.setValue(defaultPrice);
      }
      this.availablePrices$.next(prices);
    }
  }

  async register() {
    this.processing.next(true);
    console.log(this.infoCollected$.value);
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
        console.log(data);
        this.openPaymentSession(
          data?.registerForEvent.activeRegistration?.payment?.checkoutSession
        );
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

  moveEvent(): void  {
    this.dialog.open(MoveEventDialogComponent, { data: { event: this.event } });
  }

  registerAdditionalData($event: unknown): void  {
    this.infoCollected$.next($event);
  }

  async openPaymentSession(checkoutSession = '') {
    const stripe = await loadStripe(environment.stripeKey);
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: checkoutSession });
    }
  }
}
