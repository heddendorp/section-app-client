import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LoadOrderInfoGQL,
  LoadOrderInfoQuery,
  PurchaseStatus,
  UpdateAddressGQL,
  UpdatePurchaseStatusGQL,
} from '@tumi/data-access';
import { combineLatest, firstValueFrom, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddressChangeDialogComponent } from '../../components/address-change-dialog/address-change-dialog.component';
import { mapValues } from 'lodash-es';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

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
  public filter = new FormControl('');
  public nameSearchControl = new FormControl('');
  public PurchaseStatus = PurchaseStatus;
  private loadOrdersRef;
  constructor(
    private loadOrderInfoGQL: LoadOrderInfoGQL,
    private updateAddressGQL: UpdateAddressGQL,
    private updatePurchaseStatusGQL: UpdatePurchaseStatusGQL,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.loadOrdersRef = this.loadOrderInfoGQL.watch();
    this.products$ = this.loadOrdersRef.valueChanges.pipe(
      map(({ data }) => data.products)
    );
    this.users$ = combineLatest([
      this.loadOrdersRef.valueChanges.pipe(map(({ data }) => data.users)),
      this.filter.valueChanges.pipe(startWith('')),
      this.nameSearchControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([users, filter, nameSearch]) => {
        let returnedUsers = users;
        if (filter == 'not-sent') {
          returnedUsers = returnedUsers.filter((user) =>
            user.purchases.some(
              (purchase) =>
                ![PurchaseStatus.Cancelled, PurchaseStatus.Sent].includes(
                  purchase.status
                )
            )
          );
        } else if (filter) {
          returnedUsers = returnedUsers.filter((user) =>
            user.purchases.some((purchase) => purchase.status === filter)
          );
        }
        if (nameSearch) {
          returnedUsers = returnedUsers.filter((user) =>
            user.fullName
              .toLocaleLowerCase()
              .includes(nameSearch.toLocaleLowerCase())
          );
        }
        return returnedUsers;
      })
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

  async markShipped(id: string) {
    try {
      await firstValueFrom(
        this.updatePurchaseStatusGQL.mutate({ id, status: PurchaseStatus.Sent })
      );
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        this.snackBar.open(e.message, 'OK', { duration: 5000 });
      }
    }
    this.snackBar.open('Order marked as shipped', 'OK', { duration: 5000 });
  }
}
