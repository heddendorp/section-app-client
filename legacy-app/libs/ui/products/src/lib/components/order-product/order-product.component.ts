import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AddProductToCartGQL, LoadProductQuery } from '@tumi/data-access';
import { BehaviorSubject, firstValueFrom, ReplaySubject } from 'rxjs';
import { Price } from '@tumi/shared/data-types';
import { PermissionsService } from '../../../../../auth/src/lib/services/permissions.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'tumi-order-product',
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProductComponent implements OnChanges {
  @Input() public product: LoadProductQuery['product'] | null = null;
  @Input() public user: LoadProductQuery['currentUser'] | null = null;
  public additionalData$ = new ReplaySubject(1);
  public availablePrices$ = new ReplaySubject<Price[]>(1);
  public priceControl = new FormControl(null, Validators.required);
  public quantityControl = new FormControl(1, Validators.required);
  public processing$ = new BehaviorSubject(false);
  public ordered$ = new BehaviorSubject(false);
  constructor(
    private permissions: PermissionsService,
    private snackBar: MatSnackBar,
    private addProductToCartGQL: AddProductToCartGQL,
    private router: Router
  ) {
    this.additionalData$.next(null);
  }

  saveData($event: unknown) {
    this.additionalData$.next($event);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.product) {
      const prices = await firstValueFrom(
        this.permissions.getPricesForUser(
          changes.product.currentValue.prices.options
        )
      );
      const lowestPrice = Math.min(...prices.map((p) => p.amount));
      const selectedPrice = prices.find((p) => lowestPrice === p.amount);
      if (selectedPrice) {
        this.priceControl.setValue(selectedPrice);
      }
      this.availablePrices$.next(prices);
    }
  }

  async placeOrder() {
    this.processing$.next(true);
    const submissions = await firstValueFrom(this.additionalData$);
    if (this.product) {
      try {
        await firstValueFrom(
          this.addProductToCartGQL.mutate({
            data: {
              productId: this.product.id,
              price: this.priceControl.value,
              quantity: this.quantityControl.value,
              submissions,
            },
          })
        );
        this.ordered$.next(true);
        this.snackBar
          .open(`${this.product.title} added to basket`, 'Open basket', {
            duration: 5000,
          })
          .onAction()
          .subscribe(() => {
            this.router.navigate(['/basket']);
          });
      } catch (e: unknown) {
        console.log(e);
        if (e instanceof Error) {
          this.snackBar.open(e.message, 'OK', { duration: 5000 });
        }
      }
    }
    this.processing$.next(false);
  }
}
