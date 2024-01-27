import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GlobalAdminFeeOverviewGQL } from '@tumi/legacy-app/generated/generated';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CurrencyPipe, DecimalPipe, JsonPipe } from '@angular/common';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { groupBy, map as lodashMap, uniq } from 'lodash-es';
import { DateTime } from 'luxon';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-fee-overview',
  standalone: true,
  imports: [CurrencyPipe, ExtendDatePipe, JsonPipe, DecimalPipe],
  templateUrl: './fee-overview.component.html',
  styleUrl: './fee-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeeOverviewComponent implements OnInit, OnDestroy {
  private title = inject(Title);
  protected readonly currentMonth = DateTime.local().toFormat('yyyy-MM');
  protected readonly lastMonth = DateTime.local()
    .minus({ months: 1 })
    .toFormat('yyyy-MM');
  protected monthBeforeLast = DateTime.local()
    .minus({ months: 2 })
    .toFormat('yyyy-MM');
  private globalAdminFeeOverviewGQL = inject(GlobalAdminFeeOverviewGQL);
  protected monthToMonthChange = computed(() => {
    // Calculate percentage change from last month to current month
    const currentMonth = this.currentMonthFees();
    const lastMonth = this.lastMonthFees();
    if (currentMonth === lastMonth) return 0;
    if (lastMonth === 0) return 1000;
    if (!currentMonth || !lastMonth) return 0;
    return ((currentMonth - lastMonth) / lastMonth) * 100;
  });
  private queryRef = this.globalAdminFeeOverviewGQL.watch({
    currentMonth: this.currentMonth,
    lastMonth: this.lastMonth,
    monthBeforeLast: this.monthBeforeLast,
  });
  protected totalFees = toSignal(
    this.queryRef.valueChanges.pipe(
      map(({ data }) => data.totalCollectedFees / 100),
    ),
  );
  protected lastMonthToMonthChange = computed(() => {
    // Calculate percentage change from last month to current month
    const currentMonth = this.lastMonthFees();
    const lastMonth = this.monthBeforeLastFees();
    if (currentMonth === lastMonth) return 0;
    if (lastMonth === 0) return 1000;
    if (!currentMonth || !lastMonth) return 0;
    return ((currentMonth - lastMonth) / lastMonth) * 100;
  });
  protected currentMonthFees = toSignal(
    this.queryRef.valueChanges.pipe(map(({ data }) => data.currentMonth / 100)),
  );
  protected lastMonthFees = toSignal(
    this.queryRef.valueChanges.pipe(map(({ data }) => data.lastMonth / 100)),
  );
  protected monthBeforeLastFees = toSignal(
    this.queryRef.valueChanges.pipe(
      map(({ data }) => data.monthBeforeLast / 100),
    ),
  );
  protected tenantFeeMonthsData = toSignal(
    this.queryRef.valueChanges.pipe(
      map(({ data }) => groupBy(data.tenantFeeMonths, 'month')),
    ),
  );
  protected tenantFeeMonths = toSignal(
    this.queryRef.valueChanges.pipe(
      map(({ data }) => uniq(lodashMap(data.tenantFeeMonths, 'month'))),
    ),
  );

  ngOnInit() {
    this.queryRef.startPolling(1000);
    this.title.setTitle('[GA] Fee Overview');
  }

  ngOnDestroy() {
    this.queryRef.stopPolling();
  }
}
