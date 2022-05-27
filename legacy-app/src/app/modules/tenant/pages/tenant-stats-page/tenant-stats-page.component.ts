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
import { map, Observable, tap } from 'rxjs';
import * as Highcharts from 'highcharts';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tenant-stats-page',
  templateUrl: './tenant-stats-page.component.html',
  styleUrls: ['./tenant-stats-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantStatsPageComponent implements OnDestroy {
  rangeControl = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [
      {
        data: [1, 2, 3],
        type: 'line',
      },
    ],
  };
  charts$: Observable<Highcharts.Options[]>;
  public tenant$: Observable<GetStatisticsQuery['currentTenant']>;
  // public legendPosition = LegendPosition.Right;
  private getStatisticsRef;
  private rangeSubscription;
  constructor(private getStatistics: GetStatisticsGQL) {
    this.getStatisticsRef = this.getStatistics.watch();
    this.rangeSubscription = this.rangeControl.valueChanges.subscribe(
      (value) => {
        if (value.start && value.end) {
          this.getStatisticsRef.refetch({
            range: value,
          });
        }
      }
    );
    this.getStatisticsRef.startPolling(30000);
    this.tenant$ = this.getStatisticsRef.valueChanges.pipe(
      map(({ data }) => data.currentTenant)
    );
    this.charts$ = this.tenant$.pipe(
      map((tenant) => {
        const stats = tenant?.statistics;
        if (!stats) {
          return [];
        }
        return [
          {
            series: stats.userHistory.map((series) => ({
              name: series.name,
              data: series.series.map((data: any) => [
                new Date(data.name).getTime(),
                data.value,
              ]),
              type: 'line',
            })),
            title: {
              text: 'User History',
            },
            xAxis: {
              type: 'datetime',
            },
          },
          {
            series: stats.registrationHistory.map((series) => ({
              name: series.name,
              data: series.series.map((data: any) => [
                new Date(data.name).getTime(),
                data.value,
              ]),
              type: 'line',
            })),
            title: {
              text: 'Registration History',
            },
            xAxis: {
              type: 'datetime',
            },
          },
          {
            series: stats.refundHistory.map((series) => ({
              name: series.name,
              data: series.series.map((data: any) => [
                new Date(data.name).getTime(),
                data.value,
              ]),
              type: 'line',
            })),
            title: {
              text: 'Refund History',
            },
            xAxis: {
              type: 'datetime',
            },
          },
        ];
      })
    );
  }

  ngOnDestroy(): void {
    this.getStatisticsRef.stopPolling();
    this.rangeSubscription.unsubscribe();
  }
}
