import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  GetStatisticsGQL,
  GetStatisticsQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-tenant-stats-page',
  templateUrl: './tenant-stats-page.component.html',
  styleUrls: ['./tenant-stats-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantStatsPageComponent implements OnDestroy {
  public tenant$: Observable<GetStatisticsQuery['currentTenant']>;
  public legendPosition = LegendPosition.Right;
  private getStatisticsRef;
  constructor(private getStatistics: GetStatisticsGQL) {
    this.getStatisticsRef = this.getStatistics.watch();
    this.getStatisticsRef.startPolling(5000);
    this.tenant$ = this.getStatisticsRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant)
    );
  }

  ngOnDestroy(): void {
    this.getStatisticsRef.stopPolling();
  }
}
