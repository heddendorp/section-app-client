import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CreatePurchaseFromCartGQL,
  DecreaseItemQuantityGQL,
  DeleteLineItemGQL,
  IncreaseItemQuantityGQL,
  LoadUserBasketGQL,
  LoadUserBasketQuery,
} from '@tumi/data-access';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../../../../apps/tumi-app/src/environments/environment';

@Component({
  selector: 'tumi-basket-overview-page',
  templateUrl: './basket-overview-page.component.html',
  styleUrls: ['./basket-overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketOverviewPageComponent {
  public basket$: Observable<LoadUserBasketQuery['currentUser']>;
  public processing$ = new BehaviorSubject(false);
  public totalCost$: Observable<number>;
  private loadBasketRef;
  constructor(
    private snackBar: MatSnackBar,
    private loadUserBasketGQL: LoadUserBasketGQL,
    private increaseItemQuantityGQL: IncreaseItemQuantityGQL,
    private decreaseItemQuantityGQL: DecreaseItemQuantityGQL,
    private deleteLineItemGQL: DeleteLineItemGQL,
    private createPurchaseFromCartGQL: CreatePurchaseFromCartGQL
  ) {
    this.loadBasketRef = this.loadUserBasketGQL.watch();
    this.basket$ = this.loadBasketRef.valueChanges.pipe(
      map(({ data }) => data.currentUser)
    );
    this.totalCost$ = this.basket$.pipe(
      map(
        (basket) =>
          basket?.currentTenant?.cart?.items.reduce(
            (total, lineItem) => total + lineItem.quantity * lineItem.cost,
            0
          ) ?? 0
      )
    );
  }

  async createPurchase() {
    this.processing$.next(true);
    try {
      const res = await firstValueFrom(this.createPurchaseFromCartGQL.mutate());
      if (res.data) {
        const stripe = await loadStripe(environment.stripeKey);
        if (stripe) {
          await stripe.redirectToCheckout({
            sessionId: res.data.createPurchaseFromCart.payment.checkoutSession,
          });
        }
        this.loadBasketRef.refetch();
      }
    } catch (e: unknown) {
      console.log(e);
      if (e instanceof Error) {
        this.snackBar.open(e.message, 'OK', { duration: 5000 });
      }
    }
    this.processing$.next(false);
  }

  async increaseQuantity(itemId: string) {
    await firstValueFrom(this.increaseItemQuantityGQL.mutate({ id: itemId }));
  }

  async decreaseQuantity(itemId: string) {
    await firstValueFrom(this.decreaseItemQuantityGQL.mutate({ id: itemId }));
  }

  async removeItem(itemId: string) {
    await firstValueFrom(this.deleteLineItemGQL.mutate({ id: itemId }));
    this.loadBasketRef.refetch();
  }
}
