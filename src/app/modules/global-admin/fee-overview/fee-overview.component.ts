import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  GlobalAdminFeeOverviewDocument,
  GlobalAdminFeeOverviewGQL,
  GlobalAdminFeeOverviewQuery,
  AddTenantCreditGQL,
} from '@tumi/legacy-app/generated/generated';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { groupBy, map as lodashMap, uniq } from 'lodash-es';
import { DateTime } from 'luxon';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AgCharts } from 'ag-charts-angular';
import {
  AgCartesianChartOptions,
  AgCartesianSeriesOptions,
} from 'ag-charts-community';
import { MatButtonModule } from '@angular/material/button';
import { onlyCompleteData } from 'apollo-angular';

@Component({
  selector: 'app-fee-overview',
  imports: [
    CurrencyPipe,
    ExtendDatePipe,
    DecimalPipe,
    RouterLink,
    AgCharts,
    MatButtonModule,
  ],
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
  private addTenantCreditGQL = inject(AddTenantCreditGQL);
  protected monthToMonthChange = computed(() => {
    // Calculate percentage change from last month to current month
    const currentMonth = this.currentMonthFees() ?? 0;
    const lastMonth = this.lastMonthFees() ?? 0;
    if (currentMonth === lastMonth) return 0;
    return ((currentMonth - lastMonth) / lastMonth) * 100;
  });
  private queryRef = this.globalAdminFeeOverviewGQL.watch({
    variables: {
      currentMonth: this.currentMonth,
      lastMonth: this.lastMonth,
      monthBeforeLast: this.monthBeforeLast,
    },
  });
  protected totalFees = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.totalCollectedFees / 100),
    ),
  );
  protected totalFeesCount = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.totalCollectedFeeNumber),
    ),
  );
  protected lastMonthToMonthChange = computed(() => {
    // Calculate percentage change from last month to current month
    const currentMonth = this.lastMonthFees() ?? 0;
    const lastMonth = this.monthBeforeLastFees() ?? 0;
    if (currentMonth === lastMonth) return 0;
    return ((currentMonth - lastMonth) / lastMonth) * 100;
  });
  protected currentMonthFees = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.currentMonth / 100),
    ),
  );
  protected lastMonthFees = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.lastMonth / 100),
    ),
  );
  protected monthBeforeLastFees = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.monthBeforeLast / 100),
    ),
  );
  private tenantFeeMonthList = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.tenantFeeMonths),
    ),
  );
  protected tenantFeeMonthsData = computed(() => {
    const feeMonths = this.tenantFeeMonthList();
    if (!feeMonths) return undefined;
    return groupBy(feeMonths, 'month');
  });
  protected tenantFeeMonths = computed(() => {
    const feeMonths = this.tenantFeeMonthList();
    if (!feeMonths) return undefined;
    return uniq(lodashMap(feeMonths, 'month'));
  });
  protected tenantNames = computed(() => {
    const tenantFeeMonthsData = this.tenantFeeMonthsData();
    if (!tenantFeeMonthsData) return [];
    return uniq(
      Object.values(tenantFeeMonthsData).reduce((acc, month) => {
        month.forEach(({ tenantName }) => {
          acc.push(tenantName);
        });
        return acc;
      }, [] as string[]),
    );
  });
  protected feeSumPerMonth = computed(() => {
    const tenantFeeMonths = this.tenantFeeMonths();
    const tenantFeeMonthsData = this.tenantFeeMonthsData();
    if (!tenantFeeMonths || !tenantFeeMonthsData) return {};
    return tenantFeeMonths.reduce(
      (acc, month) => {
        const monthEntries = tenantFeeMonthsData[month] ?? [];
        acc[month] = monthEntries.reduce((sum, { netAmountConverted }) => {
          return sum + (netAmountConverted ?? 0);
        }, 0);
        return acc;
      },
      {} as { [key: string]: number },
    );
  });
  protected quarterGroups = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.feeQuarterGroups),
    ),
  );

  protected areaChartOptions = computed<AgCartesianChartOptions>(() => {
    const tenantNames = this.tenantNames();
    const tenantFeeMonths = this.tenantFeeMonths();
    const tenantFeeMonthsData = this.tenantFeeMonthsData();

    if (!tenantFeeMonthsData || !tenantFeeMonths || !tenantNames?.length)
      return {
        data: [],
        series: [],
        axes: [
          { type: 'category', position: 'bottom' },
          { type: 'number', position: 'left' },
        ],
      };

    return {
      data: tenantFeeMonths.map((month) => {
        const monthData = tenantFeeMonthsData[month] ?? [];
        const monthDataMap = tenantNames.reduce(
          (acc, tenantName) => {
            const tenantData = monthData.find(
              ({ tenantName: name }) => name === tenantName,
            );
            const netAmountConverted = tenantData?.netAmountConverted ?? 0;
            acc[tenantName] = netAmountConverted / 100;
            return acc;
          },
          {} as { [key: string]: number },
        );
        return {
          month,
          ...monthDataMap,
        };
      }),
      axes: [
        { type: 'category', position: 'bottom', label: { rotation: 45 } },
        { type: 'number', position: 'left' },
      ],
      series: tenantNames.map((tenantName) => ({
        type: 'area',
        xKey: 'month',
        yKey: tenantName,
        yName: tenantName,
        stacked: true,
      })),
      legend: { enabled: true },
    };
  });

  protected quarterlyChartOptions = computed<AgCartesianChartOptions>(() => {
    const quarters = this.quarterGroups() ?? [];
    const baseOptions: AgCartesianChartOptions = {
      data: [],
      series: [],
      axes: [
        { type: 'category', position: 'bottom' },
        { type: 'number', position: 'left' },
      ],
    };
    if (!quarters.length) return baseOptions;

    const data = quarters.map((quarter) => ({
      quarter: quarter.quarterLabel,
      collected: quarter.totals.collected / 100,
      expected: quarter.totals.expected / 100,
      remaining: quarter.totals.remaining / 100,
    }));
    const series = [
      {
        type: 'column',
        xKey: 'quarter',
        yKey: 'collected',
        yName: 'Collected',
      },
      {
        type: 'column',
        xKey: 'quarter',
        yKey: 'expected',
        yName: 'Expected',
      },
      {
        type: 'line',
        xKey: 'quarter',
        yKey: 'remaining',
        yName: 'Remaining adjustment',
        marker: { enabled: true },
      },
    ] as unknown as AgCartesianSeriesOptions[];

    return {
      ...baseOptions,
      data,
      series,
    };
  });

  ngOnInit() {
    this.queryRef.startPolling(10000);
    this.title.setTitle('[GA] Fee Overview');
  }

  ngOnDestroy() {
    this.queryRef.stopPolling();
  }

  async applyQuarterCredit(
    quarter: QuarterDisplay,
    summary: QuarterTenantSummary,
  ) {
    if (summary.remainingAdjustment <= 0) return;
    this.addTenantCreditGQL.mutate({
      variables: {
        id: summary.tenantId,
        credit: summary.remainingAdjustment,
        description: `Quarterly rounding adjustment ${quarter.quarterLabel}`,
      },
      refetchQueries: [
        {
          query: GlobalAdminFeeOverviewDocument,
          variables: {
            currentMonth: this.currentMonth,
            lastMonth: this.lastMonth,
            monthBeforeLast: this.monthBeforeLast,
          },
        },
      ],
    });
    await this.queryRef.refetch({
      currentMonth: this.currentMonth,
      lastMonth: this.lastMonth,
      monthBeforeLast: this.monthBeforeLast,
    });
  }

  protected isQuarterClosed(quarter: QuarterDisplay) {
    const quarterStart = DateTime.fromMillis(quarter.quarterStartMillis);
    if (!quarterStart.isValid) return false;
    const quarterEnd = quarterStart.plus({ months: 3 });
    return DateTime.local() >= quarterEnd;
  }
}
type QuarterDisplay = GlobalAdminFeeOverviewQuery['feeQuarterGroups'][number];
type QuarterTenantSummary = QuarterDisplay['tenantSummaries'][number];
