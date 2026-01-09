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
import { Apollo, gql } from 'apollo-angular';
import { EMPTY, finalize, map, Observable } from 'rxjs';
import {
  CreateInvoiceSyncInput,
  GlobalAdminFeeOverviewGQL,
  GlobalAdminFeeOverviewQuery,
  InvoiceSync,
  InvoiceSyncStatus,
} from '@tumi/legacy-app/generated/generated';

const INVOICE_SYNCS_QUERY = gql`
  query GlobalAdminInvoiceSyncs {
    invoiceSyncs {
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

@Component({
  selector: 'app-invoices',
  imports: [CurrencyPipe],
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

  private queryRef = this.globalAdminFeeOverviewGQL.watch({
    currentMonth: this.currentMonth,
    lastMonth: this.lastMonth,
    monthBeforeLast: this.monthBeforeLast,
  });

  private invoiceSyncQueryRef = this.apollo.watchQuery<InvoiceSyncsQuery>({
    query: INVOICE_SYNCS_QUERY,
    fetchPolicy: 'network-only',
  });
  private invoiceSyncs = toSignal(
    this.invoiceSyncQueryRef.valueChanges.pipe(
      map(({ data }) => data.invoiceSyncs ?? []),
    ),
    { initialValue: [] as InvoiceSync[] },
  );
  private pendingActions = signal(new Set<string>());

  private tenantFeeMonthList = toSignal(
    this.queryRef.valueChanges.pipe(map(({ data }) => data.tenantFeeMonths)),
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

  protected monthSummaries = computed(() => {
    const summaries = new Map<string, MonthSummary>();
    const invoiceSyncLookup = this.invoiceSyncLookup();

    for (const entry of this.tenantFeeMonthList()) {
      const month = entry.month;
      const summary =
        summaries.get(month) ??
        ({
          month,
          entries: [],
          totalsByCurrency: [],
        } satisfies MonthSummary);

      summary.entries.push({
        ...entry,
        invoiceSync: invoiceSyncLookup.get(entry.month)?.get(entry.tenantId),
      });
      summary.totalsByCurrency = this.updateTotals(
        summary.totalsByCurrency,
        entry,
      );
      summaries.set(month, summary);
    }

    const result = Array.from(summaries.values());
    for (const summary of result) {
      summary.entries.sort((a, b) => a.tenantName.localeCompare(b.tenantName));
      summary.totalsByCurrency.sort((a, b) =>
        a.currency.localeCompare(b.currency),
      );
    }
    result.sort((a, b) => b.month.localeCompare(a.month));
    return result;
  });

  protected totalMonths = computed(() => this.monthSummaries().length);
  protected invoiceSyncStatus = InvoiceSyncStatus;

  ngOnInit() {
    this.queryRef.startPolling(60000);
    this.title.setTitle('[GA] Invoices');
    this.invoiceSyncQueryRef.startPolling(60000);
  }

  ngOnDestroy() {
    this.queryRef.stopPolling();
    this.invoiceSyncQueryRef.stopPolling();
  }

  protected isActionPending(periodKey: string, tenantId: string) {
    return this.pendingActions().has(this.actionKey(periodKey, tenantId));
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

  private createDraftMutation(entry: InvoiceEntry): Observable<unknown> {
    if (this.isActionPending(entry.month, entry.tenantId)) return EMPTY;
    const period = this.parseMonth(entry.month);
    if (!period) return EMPTY;

    const input: CreateInvoiceSyncInput = {
      tenantId: entry.tenantId,
      periodKey: entry.month,
      periodStart:
        period.start.toISO() ?? period.start.toJSDate().toISOString(),
      periodEnd: period.end.toISO() ?? period.end.toJSDate().toISOString(),
      currency: entry.currency,
      volume: entry.revenue,
      expectedFee: entry.expectedFee,
      collectedFee: entry.netAmount,
      roundingDifference: entry.roundingDifference,
      discount: entry.volumeDiscount,
      payload: {
        transactionCount: entry.transactionCount,
      },
    };

    const actionKey = this.actionKey(entry.month, entry.tenantId);
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

  private parseMonth(month: string) {
    const parsed = DateTime.fromFormat(month, 'yyyy-MM');
    if (!parsed.isValid) return null;
    return {
      start: parsed.startOf('month'),
      end: parsed.endOf('month'),
    };
  }

  private updateTotals(
    totals: MonthCurrencyTotals[],
    entry: TenantFeeMonthEntry,
  ) {
    const currency = entry.currency;
    const existing = totals.find((total) => total.currency === currency);
    if (existing) {
      existing.volume += entry.revenue ?? 0;
      existing.expected += entry.expectedFee ?? 0;
      existing.collected += entry.netAmount ?? 0;
      existing.difference += entry.roundingDifference ?? 0;
      existing.discount += entry.volumeDiscount ?? 0;
      existing.transactions += entry.transactionCount ?? 0;
      return totals;
    }

    return [
      ...totals,
      {
        currency,
        volume: entry.revenue ?? 0,
        expected: entry.expectedFee ?? 0,
        collected: entry.netAmount ?? 0,
        difference: entry.roundingDifference ?? 0,
        discount: entry.volumeDiscount ?? 0,
        transactions: entry.transactionCount ?? 0,
      },
    ];
  }
}

type TenantFeeMonthEntry =
  GlobalAdminFeeOverviewQuery['tenantFeeMonths'][number];

type InvoiceEntry = TenantFeeMonthEntry & {
  invoiceSync?: InvoiceSync;
};

type MonthCurrencyTotals = {
  currency: TenantFeeMonthEntry['currency'];
  volume: number;
  expected: number;
  collected: number;
  difference: number;
  discount: number;
  transactions: number;
};

type MonthSummary = {
  month: string;
  entries: InvoiceEntry[];
  totalsByCurrency: MonthCurrencyTotals[];
};

type InvoiceSyncsQuery = {
  invoiceSyncs: InvoiceSync[];
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
