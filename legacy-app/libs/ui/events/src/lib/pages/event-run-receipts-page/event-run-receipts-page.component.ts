import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  GetCostItemGQL,
  GetCostItemQuery,
  GetCostItemQueryVariables,
} from '@tumi/data-access';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddReceiptDialogComponent } from '../../components/running/add-receipt-dialog/add-receipt-dialog.component';

@Component({
  selector: 'tumi-event-run-receipts-page',
  templateUrl: './event-run-receipts-page.component.html',
  styleUrls: ['./event-run-receipts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventRunReceiptsPageComponent implements OnDestroy {
  public costItem$: Observable<GetCostItemQuery['costItem']>;
  private loadCostItemQueryRef: QueryRef<
    GetCostItemQuery,
    GetCostItemQueryVariables
  >;

  constructor(
    private title: Title,
    private loadCostItem: GetCostItemGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.title.setTitle('TUMi - event receipts');
    this.loadCostItemQueryRef = this.loadCostItem.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadCostItemQueryRef.refetch({ id: params.get('costItemId') ?? '' })
    );
    this.costItem$ = this.loadCostItemQueryRef.valueChanges.pipe(
      map(({ data }) => data.costItem)
    );
    this.loadCostItemQueryRef.startPolling(5000);
  }

  ngOnDestroy() {
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
    this.loadCostItemQueryRef.stopPolling();
  }

  async addReceipt() {
    const costItem = await this.costItem$.pipe(first()).toPromise();
    if (costItem) {
      await this.dialog
        .open(AddReceiptDialogComponent, { data: { costItem } })
        .afterClosed();
    }
  }
}
