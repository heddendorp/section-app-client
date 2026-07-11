import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DateTime } from 'luxon';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Apollo, gql, onlyCompleteData } from 'apollo-angular';
import { debounceTime, EMPTY, finalize, map, Observable } from 'rxjs';
import {
  CreateInvoiceSyncInput,
  GlobalAdminFeeOverviewGQL,
  GlobalAdminFeeOverviewQuery,
  GlobalAdminFeeOverviewQueryVariables,
  InvoiceSync,
  InvoiceSyncStatus,
} from '@tumi/legacy-app/generated/generated';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const INVOICE_SYNCS_QUERY = gql`
  query GlobalAdminInvoiceSyncs($startDate: DateTime, $endDate: DateTime) {
    invoiceSyncs(startDate: $startDate, endDate: $endDate) {
      id
      tenantId
      periodKey
      status
      externalInvoiceId
      externalInvoiceNumber
      lastError
    }
  }
`;

const CREATE_INVOICE_SYNC_DRAFT_MUTATION = gql`
  mutation CreateInvoiceSyncDraft($input: CreateInvoiceSyncInput!) {
    createInvoiceSyncDraft(input: $input) {
      id
      tenantId
      periodKey
      status
      externalInvoiceNumber
      lastError
    }
  }
`;

const RETRY_INVOICE_SYNC_MUTATION = gql`
  mutation RetryInvoiceSync($id: ID!) {
    retryInvoiceSync(id: $id) {
      id
      tenantId
      periodKey
      status
      externalInvoiceNumber
      lastError
    }
  }
`;

const DELETE_INVOICE_SYNC_MUTATION = gql`
  mutation DeleteInvoiceSync($id: ID!) {
    deleteInvoiceSync(id: $id) {
      id
    }
  }
`;

const SYNC_INVOICE_SYNC_STATUSES_MUTATION = gql`
  mutation SyncInvoiceSyncStatuses {
    syncInvoiceSyncStatuses
  }
`;

const BOOK_INVOICE_SYNC_MUTATION = gql`
  mutation BookInvoiceSync($id: ID!) {
    bookInvoiceSync(id: $id) {
      id
      tenantId
      periodKey
      status
      externalInvoiceNumber
      lastError
    }
  }
`;

@Component({
  selector: 'app-invoices',
  imports: [
    CurrencyPipe,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroyRef = inject(DestroyRef);
  private title = inject(Title);
  private globalAdminFeeOverviewGQL = inject(GlobalAdminFeeOverviewGQL);

  private readonly currentMonth = DateTime.local().toFormat('yyyy-MM');
  private readonly lastMonth = DateTime.local()
    .minus({ months: 1 })
    .toFormat('yyyy-MM');
  private readonly monthBeforeLast = DateTime.local()
    .minus({ months: 2 })
    .toFormat('yyyy-MM');
  private readonly quarterlyStart = DateTime.fromISO('2026-01-01');
  private readonly defaultDateRange = this.lastFourQuartersRange();
  protected dateRangeForm = new FormGroup({
    range: new FormGroup({
      start: new FormControl(this.defaultDateRange.start),
      end: new FormControl(this.defaultDateRange.end),
    }),
  });

  private queryRef = this.globalAdminFeeOverviewGQL.watch({
    variables: this.globalAdminFeeOverviewVariables(),
  });

  private invoiceSyncQueryRef = this.apollo.watchQuery<
    InvoiceSyncsQuery,
    InvoiceSyncsQueryVariables
  >({
    query: INVOICE_SYNCS_QUERY,
    variables: this.selectedRangeVariables(),
    fetchPolicy: 'network-only',
  });
  private invoiceSyncs = toSignal(
    this.invoiceSyncQueryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.invoiceSyncs ?? []),
    ),
    { initialValue: [] as InvoiceSync[] },
  );
  private pendingActions = signal(new Set<string>());
  private syncAllPending = signal(false);

  private tenantFeeMonthList = toSignal(
    this.queryRef.valueChanges.pipe(
      onlyCompleteData(),
      map(({ data }) => data.tenantFeeMonths),
    ),
    { initialValue: [] as TenantFeeMonthEntry[] },
  );

  protected invoiceSyncLookup = computed(() => {
    const lookup = new Map<string, Map<string, InvoiceSync>>();
    for (const sync of this.invoiceSyncs()) {
      const periodKey = sync.periodKey;
      const existing = lookup.get(periodKey) ?? new Map<string, InvoiceSync>();
      existing.set(sync.tenantId, sync);
      lookup.set(periodKey, existing);
    }
    return lookup;
  });

  protected periodSummaries = computed(() => {
    const summaries = new Map<string, PeriodSummary>();
    const invoiceSyncLookup = this.invoiceSyncLookup();

    const entries = this.buildInvoiceEntries();

    for (const entry of entries) {
      const summary =
        summaries.get(entry.periodKey) ??
        ({
          periodKey: entry.periodKey,
          periodStart: entry.periodStart,
          periodEnd: entry.periodEnd,
          entries: [],
          totalsByCurrency: [],
        } satisfies PeriodSummary);

      summary.entries.push({
        ...entry,
        invoiceSync: invoiceSyncLookup
          .get(entry.periodKey)
          ?.get(entry.tenantId),
      });
      summary.totalsByCurrency = this.updateTotals(
        summary.totalsByCurrency,
        entry,
      );
      summaries.set(entry.periodKey, summary);
    }

    const result = Array.from(summaries.values());
    for (const summary of result) {
      summary.entries.sort((a, b) => a.tenantName.localeCompare(b.tenantName));
      summary.totalsByCurrency.sort((a, b) =>
        a.currency.localeCompare(b.currency),
      );
    }
    result.sort((a, b) => b.periodStart.toMillis() - a.periodStart.toMillis());
    return result;
  });

  protected totalPeriods = computed(() => this.periodSummaries().length);
  protected invoiceSyncStatus = InvoiceSyncStatus;

  ngOnInit() {
    this.queryRef.startPolling(60000);
    this.title.setTitle('[GA] Invoices');
    this.invoiceSyncQueryRef.startPolling(60000);
    this.dateRangeForm
      .get('range')
      ?.valueChanges.pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        void this.refetchRangeData();
      });
  }

  ngOnDestroy() {
    this.queryRef.stopPolling();
    this.invoiceSyncQueryRef.stopPolling();
  }

  protected isActionPending(periodKey: string, tenantId: string) {
    return this.pendingActions().has(this.actionKey(periodKey, tenantId));
  }

  protected isSyncAllPending() {
    return this.syncAllPending();
  }

  protected syncAllStatuses() {
    if (this.syncAllPending()) return;
    this.syncAllPending.set(true);
    this.apollo
      .mutate<SyncInvoiceSyncStatusesMutation, Record<string, never>>({
        mutation: SYNC_INVOICE_SYNC_STATUSES_MUTATION,
      })
      .pipe(
        finalize(() => this.syncAllPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.invoiceSyncQueryRef.refetch();
      });
  }

  protected createDraft(entry: InvoiceEntry) {
    this.createDraftMutation(entry)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.invoiceSyncQueryRef.refetch();
      });
  }

  protected retryDraft(entry: InvoiceEntry) {
    const sync = entry.invoiceSync;
    if (!sync) return;
    if (this.isActionPending(sync.periodKey, sync.tenantId)) return;

    const actionKey = this.actionKey(sync.periodKey, sync.tenantId);
    this.setActionPending(actionKey, true);
    this.apollo
      .mutate<RetryInvoiceSyncMutation, RetryInvoiceSyncVariables>({
        mutation: RETRY_INVOICE_SYNC_MUTATION,
        variables: { id: sync.id },
      })
      .pipe(
        finalize(() => this.setActionPending(actionKey, false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.invoiceSyncQueryRef.refetch();
      });
  }

  protected resetDraft(entry: InvoiceEntry) {
    const sync = entry.invoiceSync;
    if (!sync) return;
    if (this.isActionPending(sync.periodKey, sync.tenantId)) return;

    const actionKey = this.actionKey(sync.periodKey, sync.tenantId);
    this.setActionPending(actionKey, true);
    this.apollo
      .mutate<DeleteInvoiceSyncMutation, DeleteInvoiceSyncVariables>({
        mutation: DELETE_INVOICE_SYNC_MUTATION,
        variables: { id: sync.id },
      })
      .pipe(
        finalize(() => this.setActionPending(actionKey, false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.invoiceSyncQueryRef.refetch();
      });
  }

  protected bookInvoice(entry: InvoiceEntry) {
    const sync = entry.invoiceSync;
    if (!sync) return;
    if (this.isActionPending(sync.periodKey, sync.tenantId)) return;

    const actionKey = this.actionKey(sync.periodKey, sync.tenantId);
    this.setActionPending(actionKey, true);
    this.apollo
      .mutate<BookInvoiceSyncMutation, BookInvoiceSyncVariables>({
        mutation: BOOK_INVOICE_SYNC_MUTATION,
        variables: { id: sync.id },
      })
      .pipe(
        finalize(() => this.setActionPending(actionKey, false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.invoiceSyncQueryRef.refetch();
      });
  }

  private createDraftMutation(entry: InvoiceEntry): Observable<unknown> {
    if (this.isActionPending(entry.periodKey, entry.tenantId)) return EMPTY;
    const period = entry.periodStart && entry.periodEnd ? entry : null;
    if (!period) return EMPTY;

    const input: CreateInvoiceSyncInput = {
      tenantId: entry.tenantId,
      periodKey: entry.periodKey,
      periodStart:
        period.periodStart.toISO() ??
        period.periodStart.toJSDate().toISOString(),
      periodEnd:
        period.periodEnd.toISO() ?? period.periodEnd.toJSDate().toISOString(),
      currency: entry.currency,
      volume: entry.revenue,
      expectedFee: entry.expectedFee,
      collectedFee: entry.netAmount,
      roundingDifference: entry.roundingDifference,
      discount: entry.volumeDiscount,
      payload: {
        transactionCount: entry.transactionCount,
        collectedFeeEur: entry.netAmountEur ?? undefined,
        collectedFeeConverted: entry.netAmountConverted ?? undefined,
        exchangeRate: entry.exchangeRate ?? undefined,
      },
    };

    const actionKey = this.actionKey(entry.periodKey, entry.tenantId);
    this.setActionPending(actionKey, true);
    return this.apollo
      .mutate<CreateInvoiceSyncDraftMutation, CreateInvoiceSyncDraftVariables>({
        mutation: CREATE_INVOICE_SYNC_DRAFT_MUTATION,
        variables: { input },
      })
      .pipe(finalize(() => this.setActionPending(actionKey, false)));
  }

  protected statusLabel(status: InvoiceSyncStatus | undefined | null) {
    if (!status) return 'Not created';
    switch (status) {
      case InvoiceSyncStatus.Draft:
        return 'Draft created';
      case InvoiceSyncStatus.Open:
        return 'Open';
      case InvoiceSyncStatus.Paid:
        return 'Paid';
      case InvoiceSyncStatus.Pending:
        return 'Pending';
      case InvoiceSyncStatus.Failed:
        return 'Failed';
      default:
        return status;
    }
  }

  protected statusPillClass(status: InvoiceSyncStatus | undefined | null) {
    if (!status) {
      return 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600';
    }
    switch (status) {
      case InvoiceSyncStatus.Draft:
        return 'inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700';
      case InvoiceSyncStatus.Open:
        return 'inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700';
      case InvoiceSyncStatus.Paid:
        return 'inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700';
      case InvoiceSyncStatus.Pending:
        return 'inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700';
      case InvoiceSyncStatus.Failed:
        return 'inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700';
      default:
        return 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600';
    }
  }

  protected invoiceLink(invoiceId: string | null | undefined) {
    if (!invoiceId) return null;
    return `https://my.sevdesk.de/fi/detail/type/RE/id/${invoiceId}`;
  }

  private actionKey(periodKey: string, tenantId: string) {
    return `${periodKey}:${tenantId}`;
  }

  private setActionPending(actionKey: string, pending: boolean) {
    this.pendingActions.update((current) => {
      const next = new Set(current);
      if (pending) {
        next.add(actionKey);
      } else {
        next.delete(actionKey);
      }
      return next;
    });
  }

  protected isPeriodClosed(entry: InvoiceEntry) {
    return DateTime.local() > entry.periodEnd;
  }

  private async refetchRangeData(): Promise<void> {
    await Promise.all([
      this.queryRef.refetch(this.globalAdminFeeOverviewVariables()),
      this.invoiceSyncQueryRef.refetch(this.selectedRangeVariables()),
    ]);
  }

  private globalAdminFeeOverviewVariables(): GlobalAdminFeeOverviewQueryVariables {
    return {
      currentMonth: this.currentMonth,
      lastMonth: this.lastMonth,
      monthBeforeLast: this.monthBeforeLast,
      ...this.selectedRangeVariables(),
    };
  }

  private selectedRangeVariables(): InvoiceSyncsQueryVariables {
    const range = this.dateRangeForm.get('range')?.value;
    return {
      startDate: this.serializeRangeDate(range?.start, 'start'),
      endDate: this.serializeRangeDate(range?.end, 'end'),
    };
  }

  private serializeRangeDate(
    value: DateTime | Date | string | null | undefined,
    boundary: 'start' | 'end',
  ): string | undefined {
    if (!value) return undefined;
    const date =
      typeof value === 'string'
        ? DateTime.fromISO(value)
        : value instanceof Date
          ? DateTime.fromJSDate(value)
          : value;
    if (!date.isValid) return undefined;
    const periodUnit = date >= this.quarterlyStart ? 'quarter' : 'month';
    const normalized =
      boundary === 'start' ? date.startOf(periodUnit) : date.endOf(periodUnit);
    return normalized.toISO() ?? undefined;
  }

  private lastFourQuartersRange(): { start: DateTime; end: DateTime } {
    const currentQuarterStart = DateTime.local().startOf('quarter');
    return {
      start: currentQuarterStart.minus({ months: 9 }),
      end: currentQuarterStart.endOf('quarter'),
    };
  }

  private parseQuarter(month: DateTime) {
    const quarter = month.quarter;
    const year = month.year;
    const start = DateTime.fromObject({
      year,
      month: (quarter - 1) * 3 + 1,
      day: 1,
    }).startOf('day');
    const end = start.plus({ months: 2 }).endOf('month');
    return {
      periodKey: `${year}-Q${quarter}`,
      start,
      end,
    };
  }

  private buildInvoiceEntries(): Array<InvoiceEntry> {
    const entries = this.tenantFeeMonthList();
    const aggregated = new Map<string, AggregatedInvoiceEntry>();

    for (const entry of entries) {
      const parsedMonth = DateTime.fromFormat(entry.month, 'yyyy-MM');
      if (!parsedMonth.isValid) continue;

      const useQuarter = parsedMonth >= this.quarterlyStart;
      const period = useQuarter
        ? this.parseQuarter(parsedMonth)
        : {
            periodKey: entry.month,
            start: parsedMonth.startOf('month'),
            end: parsedMonth.endOf('month'),
          };
      const key = `${period.periodKey}:${entry.tenantId}`;
      const existing = aggregated.get(key);

      if (!existing) {
        aggregated.set(key, {
          periodKey: period.periodKey,
          periodStart: period.start,
          periodEnd: period.end,
          tenantId: entry.tenantId,
          tenantName: entry.tenantName,
          currency: entry.currency,
          revenue: entry.revenue ?? 0,
          expectedFee: entry.expectedFee ?? 0,
          netAmount: entry.netAmount ?? 0,
          netAmountEur: entry.netAmountEur ?? 0,
          netAmountConverted: entry.netAmountConverted ?? 0,
          exchangeRate: entry.exchangeRate ?? null,
          roundingDifference: entry.roundingDifference ?? 0,
          volumeDiscount: entry.volumeDiscount ?? 0,
          transactionCount: entry.transactionCount ?? 0,
          missingNetAmountEur:
            entry.netAmountEur === null || entry.netAmountEur === undefined,
        });
        continue;
      }

      existing.revenue += entry.revenue ?? 0;
      existing.expectedFee += entry.expectedFee ?? 0;
      existing.netAmount += entry.netAmount ?? 0;
      existing.netAmountConverted += entry.netAmountConverted ?? 0;
      existing.roundingDifference += entry.roundingDifference ?? 0;
      existing.volumeDiscount += entry.volumeDiscount ?? 0;
      existing.transactionCount += entry.transactionCount ?? 0;
      if (entry.netAmountEur === null || entry.netAmountEur === undefined) {
        existing.missingNetAmountEur = true;
      } else {
        existing.netAmountEur += entry.netAmountEur;
      }
    }

    return Array.from(aggregated.values()).map((entry) => {
      const netAmountEurValue = entry.missingNetAmountEur
        ? null
        : entry.netAmountEur;
      return {
        periodKey: entry.periodKey,
        periodStart: entry.periodStart,
        periodEnd: entry.periodEnd,
        tenantId: entry.tenantId,
        tenantName: entry.tenantName,
        currency: entry.currency,
        revenue: entry.revenue,
        expectedFee: entry.expectedFee,
        netAmount: entry.netAmount,
        netAmountEur: netAmountEurValue,
        netAmountConverted: entry.netAmountConverted,
        exchangeRate:
          entry.currency !== 'EUR' &&
          netAmountEurValue !== null &&
          entry.netAmount !== 0
            ? netAmountEurValue / entry.netAmount
            : null,
        roundingDifference: entry.roundingDifference,
        volumeDiscount: entry.volumeDiscount,
        transactionCount: entry.transactionCount,
      };
    });
  }

  private updateTotals(totals: PeriodCurrencyTotals[], entry: InvoiceEntry) {
    const currency = entry.currency;
    const existing = totals.find((total) => total.currency === currency);
    if (existing) {
      existing.volume += entry.revenue;
      existing.expected += entry.expectedFee;
      existing.collected += entry.netAmount;
      existing.difference += entry.roundingDifference;
      existing.discount += entry.volumeDiscount;
      existing.transactions += entry.transactionCount;
      return totals;
    }

    return [
      ...totals,
      {
        currency,
        volume: entry.revenue,
        expected: entry.expectedFee,
        collected: entry.netAmount,
        difference: entry.roundingDifference,
        discount: entry.volumeDiscount,
        transactions: entry.transactionCount,
      },
    ];
  }
}

type TenantFeeMonthEntry =
  GlobalAdminFeeOverviewQuery['tenantFeeMonths'][number];

type InvoiceEntry = {
  periodKey: string;
  periodStart: DateTime;
  periodEnd: DateTime;
  tenantId: TenantFeeMonthEntry['tenantId'];
  tenantName: TenantFeeMonthEntry['tenantName'];
  currency: TenantFeeMonthEntry['currency'];
  revenue: number;
  expectedFee: number;
  netAmount: number;
  netAmountEur: number | null;
  netAmountConverted: number;
  exchangeRate: number | null;
  roundingDifference: number;
  volumeDiscount: number;
  transactionCount: number;
  invoiceSync?: InvoiceSync;
};

type AggregatedInvoiceEntry = Omit<
  InvoiceEntry,
  'invoiceSync' | 'netAmountEur'
> & {
  netAmountEur: number;
  missingNetAmountEur: boolean;
};

type PeriodCurrencyTotals = {
  currency: InvoiceEntry['currency'];
  volume: number;
  expected: number;
  collected: number;
  difference: number;
  discount: number;
  transactions: number;
};

type PeriodSummary = {
  periodKey: string;
  periodStart: DateTime;
  periodEnd: DateTime;
  entries: InvoiceEntry[];
  totalsByCurrency: PeriodCurrencyTotals[];
};

type InvoiceSyncsQuery = {
  invoiceSyncs: InvoiceSync[];
};

type InvoiceSyncsQueryVariables = {
  startDate?: string;
  endDate?: string;
};

type CreateInvoiceSyncDraftMutation = {
  createInvoiceSyncDraft: InvoiceSync;
};

type CreateInvoiceSyncDraftVariables = {
  input: CreateInvoiceSyncInput;
};

type RetryInvoiceSyncMutation = {
  retryInvoiceSync: InvoiceSync;
};

type RetryInvoiceSyncVariables = {
  id: string;
};

type DeleteInvoiceSyncMutation = {
  deleteInvoiceSync: { id: string };
};

type DeleteInvoiceSyncVariables = {
  id: string;
};

type SyncInvoiceSyncStatusesMutation = {
  syncInvoiceSyncStatuses: number;
};

type BookInvoiceSyncMutation = {
  bookInvoiceSync: InvoiceSync;
};

type BookInvoiceSyncVariables = {
  id: string;
};
