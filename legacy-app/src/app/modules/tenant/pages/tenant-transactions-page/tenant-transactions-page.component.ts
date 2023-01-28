import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  LoadTransactionsGQL,
  LoadTransactionsQuery,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateTransactionDialogComponent } from '@tumi/legacy-app/modules/tenant/components/create-transaction-dialog/create-transaction-dialog.component';

@Component({
  selector: 'app-tenant-transactions-page',
  templateUrl: './tenant-transactions-page.component.html',
  styleUrls: ['./tenant-transactions-page.component.scss'],
})
export class TenantTransactionsPageComponent implements OnInit, OnDestroy {
  public displayedColumns = [
    'subject',
    'amount',
    'direction',
    'type',
    'status',
    'date',
    'user',
    'event',
  ];
  public transactions$: Observable<LoadTransactionsQuery['transactions']>;
  public transactionCount$: Observable<
    LoadTransactionsQuery['transactionCount']
  >;
  public netAmount$: Observable<LoadTransactionsQuery['transactionNetAmount']>;
  public filterForm = new FormGroup({
    range: new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    }),
    search: new FormControl(''),
    status: new FormControl([TransactionStatus.Confirmed]),
    directions: new FormControl<TransactionDirection[]>(Object.values([])),
    types: new FormControl<TransactionType[]>(Object.values([])),
  });
  public TransactionDirection = TransactionDirection;
  public TransactionType = TransactionType;
  public TransactionStatus = TransactionStatus;
  private loadTransactionsRef;
  private destroyed$ = new Subject();

  constructor(
    private loadTransactionsGQL: LoadTransactionsGQL,
    private dialog: MatDialog
  ) {
    this.loadTransactionsRef = this.loadTransactionsGQL.watch({
      take: 20,
      skip: 0,
    });
    this.transactions$ = this.loadTransactionsRef.valueChanges.pipe(
      map((res) => res.data.transactions)
    );
    this.transactionCount$ = this.loadTransactionsRef.valueChanges.pipe(
      map((res) => res.data.transactionCount)
    );
    this.netAmount$ = this.loadTransactionsRef.valueChanges.pipe(
      map((res) => res.data.transactionNetAmount)
    );
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.loadTransactionsRef.refetch({
          range: {
            start: value.range?.start,
            end: value.range?.end,
          },
          search: value.search ?? undefined,
          status: value.status,
          directions: value.directions,
          types: value.types,
        });
      });
  }

  openCreateTransactionDialog() {
    this.dialog.open(CreateTransactionDialogComponent, { minWidth: '70vw' });
  }

  updatePage($event: PageEvent): void {
    this.loadTransactionsRef.refetch({
      skip: $event.pageIndex * $event.pageSize,
      take: $event.pageSize,
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
