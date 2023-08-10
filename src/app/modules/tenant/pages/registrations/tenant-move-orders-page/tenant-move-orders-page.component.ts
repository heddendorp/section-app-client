import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  GetEventRegistrationCodeCountGQL,
  GetEventRegistrationCodeCountQuery,
  GetEventRegistrationCodesGQL,
  GetEventRegistrationCodesQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { ExtendDatePipe } from '@tumi/legacy-app/modules/shared/pipes/extended-date.pipe';
import { RouterLink } from '@angular/router';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { EventChipComponent } from '../../../../shared/components/event-chip/event-chip.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { ResetScrollDirective } from '../../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-tenant-move-orders-page',
  templateUrl: './tenant-move-orders-page.component.html',
  styleUrls: ['./tenant-move-orders-page.component.scss'],
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
    RouterLink,
    MatPaginatorModule,
    AsyncPipe,
    DatePipe,
    ExtendDatePipe,
  ],
})
export class TenantMoveOrdersPageComponent implements OnDestroy {
  public codes$: Observable<
    GetEventRegistrationCodesQuery['eventRegistrationCodes']
  >;
  public codesCount$: Observable<
    GetEventRegistrationCodeCountQuery['eventRegistrationCodeCount']
  >;
  public displayedColumns = [
    'event',
    'creator',
    'created',
    'receiver',
    'used',
    'status',
  ];
  private ordersQueryRef;

  constructor(
    private getEventRegistrationCodesGQL: GetEventRegistrationCodesGQL,
    private getEventRegistrationCodeCountGQL: GetEventRegistrationCodeCountGQL,
  ) {
    this.ordersQueryRef = this.getEventRegistrationCodesGQL.watch({
      pageLength: 20,
      pageIndex: 0,
    });
    this.codesCount$ = this.getEventRegistrationCodeCountGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.eventRegistrationCodeCount));
    this.ordersQueryRef.startPolling(5000);
    this.codes$ = this.ordersQueryRef.valueChanges.pipe(
      map(({ data }) => data.eventRegistrationCodes),
    );
  }

  ngOnDestroy(): void {
    this.ordersQueryRef.stopPolling();
  }

  updatePage($event: PageEvent) {
    this.ordersQueryRef.refetch({
      pageIndex: $event.pageIndex,
      pageLength: $event.pageSize,
    });
  }
}
