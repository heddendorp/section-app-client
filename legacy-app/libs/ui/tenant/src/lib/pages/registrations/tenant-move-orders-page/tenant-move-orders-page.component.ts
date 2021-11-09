import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetEventRegistrationCodesGQL,
  GetEventRegistrationCodesQuery,
} from '@tumi/data-access';

@Component({
  selector: 'tumi-tenant-move-orders-page',
  templateUrl: './tenant-move-orders-page.component.html',
  styleUrls: ['./tenant-move-orders-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantMoveOrdersPageComponent implements OnDestroy {
  public codes$: Observable<
    GetEventRegistrationCodesQuery['eventRegistrationCodes']
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
    private title: Title,
    private getEventRegistrationCodesGQL: GetEventRegistrationCodesGQL
  ) {
    this.title.setTitle('TUMi - manage registrations');
    this.ordersQueryRef = this.getEventRegistrationCodesGQL.watch();
    this.ordersQueryRef.startPolling(5000);
    this.codes$ = this.ordersQueryRef.valueChanges.pipe(
      map(({ data }) => data.eventRegistrationCodes)
    );
  }

  ngOnDestroy() {
    this.ordersQueryRef.stopPolling();
  }
}
