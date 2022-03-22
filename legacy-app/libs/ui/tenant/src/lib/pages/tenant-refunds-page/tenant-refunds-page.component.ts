import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetCancelledRegistrationsGQL,
  GetCancelledRegistrationsQuery,
} from '@tumi/data-access';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-refunds-page',
  templateUrl: './tenant-refunds-page.component.html',
  styleUrls: ['./tenant-refunds-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantRefundsPageComponent implements OnDestroy {
  public refunds$: Observable<GetCancelledRegistrationsQuery['registrations']>;
  public displayedColumns = ['event', 'user', 'created'];
  private refundsQueryRef;
  constructor(
    private title: Title,
    private cancelledRegistrationsGQL: GetCancelledRegistrationsGQL
  ) {
    this.title.setTitle('TUMi - manage registrations');
    this.refundsQueryRef = this.cancelledRegistrationsGQL.watch();
    this.refundsQueryRef.startPolling(5000);
    this.refunds$ = this.refundsQueryRef.valueChanges.pipe(
      map(({ data }) => data.registrations)
    );
  }

  ngOnDestroy(): void  {
    this.refundsQueryRef.stopPolling();
  }
}
