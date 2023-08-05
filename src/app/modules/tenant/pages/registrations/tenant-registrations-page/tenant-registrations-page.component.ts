import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  GetRegistrationCountGQL,
  GetRegistrationCountQuery,
  GetRegistrationsGQL,
  GetRegistrationsQuery,
} from '@tumi/legacy-app/generated/generated';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { map, Observable } from 'rxjs';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { RouterLink } from '@angular/router';
import { TransactionListComponent } from '../../../../shared/components/transaction-list/transaction-list.component';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { EventChipComponent } from '../../../../shared/components/event-chip/event-chip.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, AsyncPipe, TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
    selector: 'app-tenant-registrations-page',
    templateUrl: './tenant-registrations-page.component.html',
    styleUrls: ['./tenant-registrations-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ReactiveToolbarComponent,
        MatToolbarModule,
        BackButtonComponent,
        ResetScrollDirective,
        NgIf,
        MatProgressBarModule,
        MatTableModule,
        EventChipComponent,
        UserChipComponent,
        TransactionListComponent,
        RouterLink,
        MatPaginatorModule,
        AsyncPipe,
        TitleCasePipe,
        CurrencyPipe,
        DatePipe,
        ExtendDatePipe,
    ],
})
export class TenantRegistrationsPageComponent implements OnDestroy {
  public registrations$: Observable<GetRegistrationsQuery['registrations']>;
  public registrationCount$: Observable<
    GetRegistrationCountQuery['registrationCount']
  >;
  public displayedColumns = [
    'event',
    'user',
    'created',
    'type',
    'amount',
    'status',
  ];
  private registrationsQueryRef;

  constructor(
    private getRegistrationsGQL: GetRegistrationsGQL,
    private getRegistrationCountGQL: GetRegistrationCountGQL
  ) {
    this.registrationsQueryRef = this.getRegistrationsGQL.watch({
      pageLength: 20,
      pageIndex: 0,
    });
    this.registrationCount$ = this.getRegistrationCountGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.registrationCount));
    this.registrations$ = this.registrationsQueryRef.valueChanges.pipe(
      map(({ data }) => data.registrations)
    );
  }

  ngOnDestroy(): void {
    this.registrationsQueryRef.stopPolling();
  }

  updatePage($event: PageEvent) {
    this.registrationsQueryRef.refetch({
      pageIndex: $event.pageIndex,
      pageLength: $event.pageSize,
    });
  }
}
