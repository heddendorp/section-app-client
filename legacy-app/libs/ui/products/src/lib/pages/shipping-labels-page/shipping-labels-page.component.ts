import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { LoadOrderInfoGQL, LoadOrderInfoQuery } from '@tumi/data-access';
import { map } from 'rxjs/operators';
import { chunk } from 'lodash-es';

@Component({
  selector: 'tumi-shipping-labels-page',
  templateUrl: './shipping-labels-page.component.html',
  styleUrls: ['./shipping-labels-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingLabelsPageComponent implements OnInit {
  public users$: Observable<Array<LoadOrderInfoQuery['users']>>;
  private loadOrdersRef;
  constructor(private loadOrderInfoGQL: LoadOrderInfoGQL) {
    this.loadOrdersRef = this.loadOrderInfoGQL.watch();
    this.users$ = this.loadOrdersRef.valueChanges.pipe(
      map(({ data }) => chunk(data.users, 2))
    );
  }
  async ngOnInit() {
    await firstValueFrom(this.users$);
    setTimeout(() => {
      window.print();
    }, 1000);
  }
}
