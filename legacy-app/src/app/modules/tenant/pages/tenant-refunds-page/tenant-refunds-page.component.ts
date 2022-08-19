import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  GetCancelledRegistrationsGQL,
  GetCancelledRegistrationsQuery,
} from '@tumi/legacy-app/generated/generated';
import { Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-refunds-page',
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
    this.title.setTitle('Refunds - TUMi');
    this.refundsQueryRef = this.cancelledRegistrationsGQL.watch();
    this.refundsQueryRef.startPolling(5000);
    this.refunds$ = this.refundsQueryRef.valueChanges.pipe(
      map(({ data }) => data.registrations)
    );
  }

  ngOnDestroy(): void {
    this.refundsQueryRef.stopPolling();
  }
}
