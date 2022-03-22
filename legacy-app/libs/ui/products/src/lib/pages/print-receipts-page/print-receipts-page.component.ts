import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { LoadOrderInfoGQL, LoadOrderInfoQuery } from '@tumi/data-access';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-print-receipts-page',
  templateUrl: './print-receipts-page.component.html',
  styleUrls: ['./print-receipts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintReceiptsPageComponent implements OnInit {
  // public products$: Observable<LoadOrderInfoQuery['products']>;
  public users$: Observable<LoadOrderInfoQuery['users']>;
  private loadOrdersRef;
  constructor(private loadOrderInfoGQL: LoadOrderInfoGQL) {
    this.loadOrdersRef = this.loadOrderInfoGQL.watch();
    // this.products$ = this.loadOrdersRef.valueChanges.pipe(
    //   map(({ data }) => data.products)
    // );
    this.users$ = this.loadOrdersRef.valueChanges.pipe(
      map(({ data }) => data.users)
    );
  }
  async ngOnInit() {
    await firstValueFrom(this.users$);
    setTimeout(() => {
      window.print();
    }, 1000);
  }

  getTotal(purchases: LoadOrderInfoQuery['users'][0]['purchases']) {
    return purchases.reduce((acc, curr) => acc + curr.payment.amount / 100, 0);
  }
}
