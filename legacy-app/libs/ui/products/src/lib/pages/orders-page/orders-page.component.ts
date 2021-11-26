import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadOrderInfoGQL, LoadOrderInfoQuery } from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {
  public products$: Observable<LoadOrderInfoQuery['products']>;
  public lmu$: Observable<LoadOrderInfoQuery['lmuPurchases']>;
  public users$: Observable<LoadOrderInfoQuery['users']>;
  private loadOrdersRef;
  constructor(private loadOrderInfoGQL: LoadOrderInfoGQL) {
    this.loadOrdersRef = this.loadOrderInfoGQL.watch();
    this.products$ = this.loadOrdersRef.valueChanges.pipe(
      map(({ data }) => data.products)
    );
    this.users$ = this.loadOrdersRef.valueChanges.pipe(
      map(({ data }) => data.users)
    );
    this.lmu$ = this.loadOrdersRef.valueChanges.pipe(
      map(({ data }) => data.lmuPurchases)
    );
  }
}
