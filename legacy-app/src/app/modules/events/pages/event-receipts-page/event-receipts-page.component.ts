import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import {
  DeleteReceiptGQL,
  GetCostItemGQL,
  GetCostItemQuery,
  GetCostItemQueryVariables,
} from '@tumi/legacy-app/generated/generated';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddReceiptDialogComponent } from '@tumi/legacy-app/modules/events/components/running/add-receipt-dialog/add-receipt-dialog.component';
import { QueryRef } from 'apollo-angular';
import { first, firstValueFrom, map, Observable } from 'rxjs';

@Component({
  selector: 'app-event-receipts-page',
  templateUrl: './event-receipts-page.component.html',
  styleUrls: ['./event-receipts-page.component.scss'],
})
export class EventReceiptsPageComponent implements OnDestroy {
  public costItem$: Observable<GetCostItemQuery['costItem']>;
  private loadCostItemQueryRef: QueryRef<
    GetCostItemQuery,
    GetCostItemQueryVariables
  >;

  constructor(
    private title: Title,
    private loadCostItem: GetCostItemGQL,
    private removeReceiptMutation: DeleteReceiptGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.title.setTitle('TUMi - event receipts');
    this.loadCostItemQueryRef = this.loadCostItem.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadCostItemQueryRef.refetch({ id: params.get('costItemId') ?? '' })
    );
    this.costItem$ = this.loadCostItemQueryRef.valueChanges.pipe(
      map(({ data }) => data.costItem),
      map((costItem) => {
        console.log(costItem.receipts);
        return {
          ...costItem,
          receipts: costItem.receipts.map((receipt) => {
            if (receipt?.type?.includes('pdf')) {
              if (
                receipt?.createdAt &&
                new Date(receipt.createdAt) < new Date('2022-04-14')
              ) {
                return {
                  ...receipt,
                  url: receipt?.url?.replace('pdf', 'png'),
                  type: 'png',
                };
              }
            }
            return receipt;
          }),
        };
      })
    );
    this.loadCostItemQueryRef.startPolling(60000);
  }

  ngOnDestroy(): void {
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
    this.loadCostItemQueryRef.stopPolling();
  }

  async addReceipt() {
    const costItem = await firstValueFrom(this.costItem$);
    if (costItem) {
      await this.dialog
        .open(AddReceiptDialogComponent, { data: { costItem } })
        .afterClosed();
    }
  }

  async deleteReceipt(receipt: GetCostItemQuery['costItem']['receipts'][0]) {
    const costItem = await this.costItem$.pipe(first()).toPromise();
    if (costItem) {
      await firstValueFrom(
        this.removeReceiptMutation.mutate({ receiptId: receipt.id })
      );
    }
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
