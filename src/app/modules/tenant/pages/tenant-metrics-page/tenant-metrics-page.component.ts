import { Component } from '@angular/core';
import { interval, map, Observable, share, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, NgFor, AsyncPipe, DecimalPipe } from '@angular/common';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
    selector: 'app-tenant-metrics-page',
    templateUrl: './tenant-metrics-page.component.html',
    styleUrls: ['./tenant-metrics-page.component.scss'],
    standalone: true,
    imports: [
        ReactiveToolbarComponent,
        MatToolbarModule,
        BackButtonComponent,
        ResetScrollDirective,
        NgIf,
        MatProgressBarModule,
        GridComponent,
        NgFor,
        HighchartsChartModule,
        AsyncPipe,
        DecimalPipe,
    ],
})
export class TenantMetricsPageComponent {
  Highcharts: typeof Highcharts = Highcharts;
  counters$: Observable<any[]>;
  gauges$: Observable<any[]>;
  histograms$: Observable<Highcharts.Options[]>;

  constructor(private http: HttpClient) {
    const metrics$ = interval(5000).pipe(
      switchMap(() => this.http.get(`${environment.server}/metrics`)),
      share()
    );
    this.counters$ = metrics$.pipe(map((data: any) => data.counters));
    this.gauges$ = metrics$.pipe(map((data: any) => data.gauges));
    this.histograms$ = metrics$.pipe(
      map((data: any) =>
        data.histograms.map((histogram: any) => ({
          title: { text: histogram.key },
          caption: { text: histogram.description },
          chart: {
            type: 'column',
          },
          plotOptions: {
            column: {
              pointPadding: 0,
              borderWidth: 0,
              groupPadding: 0,
              shadow: false,
            },
          },
          xAxis: {
            type: 'logarithmic',
          },
          series: [
            {
              data: histogram.value.buckets,
            },
          ],
        }))
      )
    );
  }
}
