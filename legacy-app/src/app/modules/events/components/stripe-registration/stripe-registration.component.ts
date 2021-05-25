import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '@tumi/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '@tumi/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { IconToastComponent } from '@tumi/modules/shared';

@Component({
  selector: 'app-stripe-registration',
  templateUrl: './stripe-registration.component.html',
  styleUrls: ['./stripe-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripeRegistrationComponent implements OnInit, OnChanges {
  @Input() event: any;
  public registration$ = new Subject<any>();
  public freeSpots$ = new Subject<boolean>();
  private stripe: Stripe;
  constructor(
    private auth: AuthService,
    private snack: MatSnackBar,
    private functions: AngularFireFunctions,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const stripe = await loadStripe('pk_live_cwWIdXXGPsJXy0UDC26mL4ai');
    if (!!stripe) {
      this.stripe = stripe;
    }
    this.route.queryParamMap.pipe(first()).subscribe((queryMap) => {
      const status = queryMap.get('payment');
      if (status === 'error') {
        this.snack.openFromComponent(IconToastComponent, {
          data: {
            icon: 'icon-delete-sign',
            message: 'The payment was aborted',
          },
        });
      }
      if (status === 'success') {
        this.snack.openFromComponent(IconToastComponent, {
          data: {
            icon: 'icon-checkmark',
            message: 'Payment successful, registration in progress!',
          },
        });
      }
    });
  }

  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.event) {
      const user = await this.auth.user$.pipe(first()).toPromise();
      const registrations = await this.event.registrations
        .pipe(first())
        .toPromise();
      const registration = registrations.find((r: any) => r.id === user.id);
      this.registration$.next(registration);
      this.freeSpots$.next(
        this.event.participantSpots > this.event.usersSignedUp
      );
    }
  }

  public async startPayment() {
    const user = await this.auth.user$.pipe(first()).toPromise();
    const [icon, style] = this.event.icon.split(':');
    const session = await this.functions
      .httpsCallable('createCheckoutSession')({
        success_url:
          (environment.production
            ? 'https://tumi.esn.world'
            : 'http://localhost:4200') +
          `/events/${this.event.id}?payment=success`,
        cancel_url:
          (environment.production
            ? 'https://tumi.esn.world'
            : 'http://localhost:4200') +
          `/events/${this.event.id}?payment=error`,
        customer_email: user.email,
        payment_method_types: ['card'],
        metadata: {
          event: this.event.id,
          user: user.id,
        },
        line_items: [
          {
            price_data: {
              currency: 'eur',
              unit_amount: this.event.price * 100,
              product_data: {
                name: this.event.name,
                images: [
                  `https://img.icons8.com/${style ?? 'color'}/192/${
                    icon ?? ''
                  }.png?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`,
                ],
              },
            },
            quantity: 1,
          },
        ],
      })
      .toPromise();
    const result = await this.stripe.redirectToCheckout({
      sessionId: session.id,
    });
    console.log(result);
    if (result.error) {
      alert(result.error.message);
    }
  }
}
