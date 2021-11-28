import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LoadOrderInfoGQL,
  LoadOrderInfoQuery,
  UpdateAddressGQL,
} from '@tumi/data-access';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddressChangeDialogComponent } from '../../components/address-change-dialog/address-change-dialog.component';
import { mapValues } from 'lodash-es';

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
  constructor(
    private loadOrderInfoGQL: LoadOrderInfoGQL,
    private updateAddressGQL: UpdateAddressGQL,
    private dialog: MatDialog
  ) {
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

  async changeAddress(address: unknown, id: string) {
    const dialogRef = this.dialog.open(AddressChangeDialogComponent, {
      data: { address },
      panelClass: 'modern',
    });
    const data = await firstValueFrom(dialogRef.afterClosed());
    if (data) {
      const address = mapValues(data, (val) => (val?.length > 0 ? val : null));
      await firstValueFrom(this.updateAddressGQL.mutate({ address, id: id }));
      // this.loadOrdersRef.refetch();
    }
  }
}
