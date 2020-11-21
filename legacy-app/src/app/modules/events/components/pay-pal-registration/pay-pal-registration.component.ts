import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconToastComponent } from '../../../shared';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-pay-pal-registration',
  templateUrl: './pay-pal-registration.component.html',
  styleUrls: ['./pay-pal-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayPalRegistrationComponent implements OnChanges {
  @Input() event: any;
  /* eslint-enable @typescript-eslint/naming-convention */
  public registration$ = new Subject<any>();
  public freeSpots$ = new Subject<boolean>();
  private paymentStatus$ = new Subject<string>();
  /* eslint-disable @typescript-eslint/naming-convention */
  public paymentConfig: IPayPalConfig = {
    clientId: environment.paypal.clientId,
    currency: 'EUR',
    onApprove: (data) => this.approvePayment(),
    onClientAuthorization: (data) => this.paymentStatus$.next(data.id),
    onError: (data) => this.paymentStatus$.next('error'),
    onCancel: (data) => console.log(data),
    createOrderOnClient: (_): ICreateOrderRequest => ({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: this.event.price,
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.event.price.toString(),
              },
            },
          },
          items: [
            {
              name: this.event.name,
              quantity: '1',
              unit_amount: {
                currency_code: 'EUR',
                value: this.event.price,
              },
            },
          ],
        },
      ],
    }),
  };

  constructor(
    private auth: AuthService,
    private snack: MatSnackBar,
    private functions: AngularFireFunctions
  ) {}

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

  private async approvePayment(): Promise<void> {
    const snack = this.snack.openFromComponent(IconToastComponent, {
      data: { icon: 'icon-transaction', message: 'Authorizing payment' },
      duration: 0,
    });
    const id = await this.paymentStatus$.pipe(first()).toPromise();
    if (id === 'error') {
      this.snack.openFromComponent(IconToastComponent, {
        data: { icon: 'icon-delete-sign', message: 'An error occurred!' },
      });
    } else {
      await this.functions
        .httpsCallable<
          {
            eventId: string;
            orderId: string;
          },
          any
        >('confirmPayment')({
          eventId: this.event.id,
          orderId: id,
        })
        .toPromise();
      this.snack.openFromComponent(IconToastComponent, {
        data: {
          icon: 'icon-checkmark',
          message: 'Your registration was successfully processed!',
        },
      });
    }
  }
}
