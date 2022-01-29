import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadPurchasesGQL, LoadPurchasesQuery } from '@tumi/data-access';
import { map, Observable } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../../../../apps/tumi-app/src/environments/environment';

@Component({
  selector: 'tumi-purchases-page',
  templateUrl: './purchases-page.component.html',
  styleUrls: ['./purchases-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasesPageComponent {
  public purchases$: Observable<LoadPurchasesQuery['purchases']>;
  private loadPurchasesRef;
  constructor(private loadPurchasesGQL: LoadPurchasesGQL) {
    this.loadPurchasesRef = this.loadPurchasesGQL.watch();
    this.purchases$ = this.loadPurchasesRef.valueChanges.pipe(
      map(({ data }) => data.purchases)
    );
  }

  async openPaymentSession(checkoutSession = '') {
    const stripe = await loadStripe(environment.stripeKey);
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: checkoutSession });
    }
  }
}
