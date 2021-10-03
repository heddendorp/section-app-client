import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { GetMoveOrdersGQL, GetMoveOrdersQuery } from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-move-orders-page',
  templateUrl: './tenant-move-orders-page.component.html',
  styleUrls: ['./tenant-move-orders-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantMoveOrdersPageComponent implements OnDestroy {
  public orders$: Observable<GetMoveOrdersQuery['moveOrders']>;
  public displayedColumns = [
    'event',
    'creator',
    'created',
    'receiver',
    'used',
    'status',
  ];
  private ordersQueryRef;
  constructor(private title: Title, private loadMoveOrders: GetMoveOrdersGQL) {
    this.title.setTitle('TUMi - manage registrations');
    this.ordersQueryRef = this.loadMoveOrders.watch();
    this.ordersQueryRef.startPolling(5000);
    this.orders$ = this.ordersQueryRef.valueChanges.pipe(
      map(({ data }) => data.moveOrders)
    );
  }

  ngOnDestroy() {
    this.ordersQueryRef.stopPolling();
  }
}
