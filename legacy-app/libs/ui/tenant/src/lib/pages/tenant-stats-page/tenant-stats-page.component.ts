import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetStatisticsGQL, GetStatisticsQuery } from '@tumi/data-access';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tumi-tenant-stats-page',
  templateUrl: './tenant-stats-page.component.html',
  styleUrls: ['./tenant-stats-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantStatsPageComponent implements OnInit {
  public tenant$: Observable<GetStatisticsQuery['currentTenant']>;
  private getStatisticsRef;
  constructor(private getStatistics: GetStatisticsGQL) {
    this.getStatisticsRef = this.getStatistics.watch();
    this.tenant$ = this.getStatisticsRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant)
    );
  }

  ngOnInit(): void {}
}
