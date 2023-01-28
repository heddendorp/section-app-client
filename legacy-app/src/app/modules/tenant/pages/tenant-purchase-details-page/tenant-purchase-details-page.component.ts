import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GetPurchaseGQL,
  GetPurchaseQuery,
} from '@tumi/legacy-app/generated/generated';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-tenant-purchase-details-page',
  templateUrl: './tenant-purchase-details-page.component.html',
  styleUrls: ['./tenant-purchase-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantPurchaseDetailsPageComponent {
  public purchase$: Observable<GetPurchaseQuery['purchase']>;

  constructor(
    private getPurchaseGQL: GetPurchaseGQL,
    private route: ActivatedRoute
  ) {
    this.purchase$ = this.route.paramMap.pipe(
      switchMap(
        (params) =>
          this.getPurchaseGQL.watch({
            id: params.get('purchaseId') ?? '',
          }).valueChanges
      ),
      map(({ data }) => data.purchase)
    );
  }
}
