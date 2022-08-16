import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  GetTenantPurchasesGQL,
  GetTenantPurchasesQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-purchases-page',
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
  constructor(
    private loadPurchasesGQL: GetTenantPurchasesGQL,
    private title: Title
  ) {
    this.title.setTitle('Purchases - TUMi');
    this.loadPurchasesRef = this.loadPurchasesGQL.watch();
    this.purchases$ = this.loadPurchasesRef.valueChanges.pipe(
      map((result) => result.data.purchases)
    );
    this.loadPurchasesRef.startPolling(10000);
  }

  ngOnDestroy(): void {
    this.loadPurchasesRef.stopPolling();
  }
}
