import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  GetTenantPurchasesGQL,
  GetTenantPurchasesQuery,
} from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-purchases-page',
  templateUrl: './tenant-purchases-page.component.html',
  styleUrls: ['./tenant-purchases-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantPurchasesPageComponent implements OnDestroy {
  public purchases$: Observable<GetTenantPurchasesQuery['purchases']>;
  public displayedColumns = [
    // 'event',
    'created',
    'user',
    'payment',
    'cost',
    'status',
  ];
  private loadPurchasesRef;
  constructor(private loadPurchasesGQL: GetTenantPurchasesGQL) {
    this.loadPurchasesRef = this.loadPurchasesGQL.watch();
    this.purchases$ = this.loadPurchasesRef.valueChanges.pipe(
      map((result) => result.data.purchases)
    );
    this.loadPurchasesRef.startPolling(10000);
  }

  ngOnDestroy(): void  {
    this.loadPurchasesRef.stopPolling();
  }
}
