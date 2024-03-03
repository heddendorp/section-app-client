import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-event-receipts-page',
  templateUrl: './event-receipts-page.component.html',
  styleUrls: ['./event-receipts-page.component.scss'],
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    BackButtonComponent,
    NgIf,
    ResetScrollDirective,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    GridComponent,
    NgFor,
    AsyncPipe,
    CurrencyPipe,
    NgOptimizedImage,
  ],
})
export class EventReceiptsPageComponent implements OnDestroy {
  public costItem$: Observable<GetCostItemQuery['costItem']>;
  private loadCostItemQueryRef: QueryRef<
    GetCostItemQuery,
    GetCostItemQueryVariables
  >;

  constructor(
    private loadCostItem: GetCostItemGQL,
    private removeReceiptMutation: DeleteReceiptGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) {
    this.loadCostItemQueryRef = this.loadCostItem.watch();
    this.loadCostItemQueryRef.startPolling(60000);
    this.route.paramMap.subscribe((params) =>
      this.loadCostItemQueryRef.refetch({ id: params.get('costItemId') ?? '' }),
    );
    this.costItem$ = this.loadCostItemQueryRef.valueChanges.pipe(
      map(({ data }) => data.costItem),
      map((costItem) => {
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
      }),
    );
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
        .open(AddReceiptDialogComponent, {
          data: { costItem },
        })
        .afterClosed();
    }
  }

  async deleteReceipt(receipt: GetCostItemQuery['costItem']['receipts'][0]) {
    const costItem = await this.costItem$.pipe(first()).toPromise();
    if (costItem) {
      await firstValueFrom(
        this.removeReceiptMutation.mutate({ receiptId: receipt.id }),
      );
    }
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
