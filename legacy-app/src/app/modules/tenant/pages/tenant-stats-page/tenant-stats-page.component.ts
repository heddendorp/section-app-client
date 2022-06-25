import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  GetStatisticsGQL,
  GetStatisticsQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import * as Highcharts from 'highcharts';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-tenant-stats-page',
  templateUrl: './tenant-stats-page.component.html',
  styleUrls: ['./tenant-stats-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantStatsPageComponent implements OnDestroy {
  rangeControl = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  Highcharts: typeof Highcharts = Highcharts;
  charts$: Observable<{
    line: Highcharts.Options[];
    pie: Highcharts.Options[];
  }>;
  public statistics$: Observable<GetStatisticsQuery['statistics']>;
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
    this.statistics$ = this.getStatisticsRef.valueChanges.pipe(
      map(({ data }) => data.statistics)
    );
    this.charts$ = this.statistics$.pipe(
      map((stats) => {
        if (!stats) {
          return { line: [], pie: [] };
        }
        return {
          line: [
            {
              series: stats.userHistory.map((series: any, index: number) => ({
                name: series.name,
                yAxis: index,
                data: series.series.map((data: any) => [
                  new Date(data.name).getTime(),
                  data.value,
                ]),
                type: 'line',
              })),
              title: {
                text: 'Signup History',
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: [
                {
                  title: {
                    text: 'New Users',
                  },
                  opposite: true,
                },
                {
                  title: {
                    text: 'Total Users',
                  },
                },
              ],
            },
            {
              series: stats.registrationHistory.map(
                (series: any, index: number) => ({
                  name: series.name,
                  yAxis: index,
                  data: series.series.map((data: any) => [
                    new Date(data.name).getTime(),
                    data.value,
                  ]),
                  type: 'line',
                })
              ),
              title: {
                text: 'Registration History',
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: [
                {
                  title: {
                    text: 'New Registrations',
                  },
                  opposite: true,
                },
                {
                  title: {
                    text: 'Total Registrations',
                  },
                },
              ],
            },

            {
              series: stats.checkinHistory.map(
                (series: any, index: number) => ({
                  name: series.name,
                  yAxis: index,
                  data: series.series.map((data: any) => [
                    new Date(data.name).getTime(),
                    data.value,
                  ]),
                  type: 'line',
                })
              ),
              title: {
                text: 'Checkin History',
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: [
                {
                  title: {
                    text: 'New Checkins',
                  },
                  opposite: true,
                },
                {
                  title: {
                    text: 'Total Checkins',
                  },
                },
              ],
            },
            /*{
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
            },*/
          ],
          pie: [
            {
              title: {
                text: 'University distribution',
              },
              chart: {
                type: 'pie',
              },
              series: [
                {
                  colorByPoint: true,
                  type: 'pie',
                  data: stats.userUniversityDistribution.map((data: any) => ({
                    name: data.uni ?? 'not set',
                    y: data.count,
                  })),
                },
              ],
            },
            {
              title: {
                text: 'Enrolment status distribution',
              },
              chart: {
                type: 'pie',
              },
              series: [
                {
                  colorByPoint: true,
                  type: 'pie',
                  data: stats.userStatusDistribution.map((data: any) => ({
                    name: data.status,
                    y: data.count,
                  })),
                },
              ],
            },
          ],
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.getStatisticsRef.stopPolling();
    this.rangeSubscription.unsubscribe();
  }
}
