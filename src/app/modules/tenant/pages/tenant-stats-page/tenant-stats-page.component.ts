import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  GetInitialStatisticsDataGQL,
  GetRangeStatisticsGQL,
} from '@tumi/legacy-app/generated/generated';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  tap,
  withLatestFrom,
} from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-tenant-stats-page',
  templateUrl: './tenant-stats-page.component.html',
  styleUrls: ['./tenant-stats-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DecimalPipe,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    AgChartsAngularModule,
  ],
})
export class TenantStatsPageComponent {
  protected timeForm = new FormGroup({
    start: new FormControl(DateTime.local().minus({ days: 7 }).toISO()),
    end: new FormControl(DateTime.local().toISO()),
    timeFrame: new FormControl('week'),
  });
  private getInitialStatisticsDataGQL = inject(GetInitialStatisticsDataGQL);
  private getRangeStatisticsGQL = inject(GetRangeStatisticsGQL);
  private rangeStatisticsReference = this.getRangeStatisticsGQL.watch({
    startDate: DateTime.local().minus({ days: 7 }).toISO(),
    endDate: DateTime.local().toISO(),
    unit: 'day',
  });
  protected rangeStats = toSignal(
    this.rangeStatisticsReference.valueChanges.pipe(
      map(({ data }) => data.rangeStatistics),
      filter((data) => !!data),
    ),
  );
  protected userDataStats = toSignal(
    this.rangeStatisticsReference.valueChanges.pipe(
      map(({ data }) => data.userDataStatistics as any),
      filter((data) => !!data),
      tap((data) => console.log(data)),
    ),
  );
  private registrationHistory = toSignal(
    this.rangeStatisticsReference.valueChanges.pipe(
      map(({ data }) => data.registrationHistory),
      filter((data) => !!data),
    ),
  );
  registrationChart = computed<AgChartOptions>(() => ({
    title: {
      text: 'Registrations',
    },
    data: this.registrationHistory()?.map((item) => ({
      ...item,
      date: DateTime.fromISO(item.date).toJSDate(),
    })),
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'eventRegistrations',
        yName: 'Event Registrations',
        marker: {
          enabled: false,
        },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'usersCheckedIn',
        yName: 'User Check-Ins',
        marker: {
          enabled: false,
        },
      },
    ],
    axes: [
      {
        type: 'time',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
      },
    ],
  }));
  private eventHistory = toSignal(
    this.rangeStatisticsReference.valueChanges.pipe(
      map(({ data }) => data.eventHistory),
      filter((data) => !!data),
    ),
  );
  eventsChart = computed<AgChartOptions>(() => ({
    title: {
      text: 'Events',
    },
    data: this.eventHistory()?.map((item) => ({
      ...item,
      date: DateTime.fromISO(item.date).toJSDate(),
    })),
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'eventsCreated',
        yName: 'Events Created',
        marker: {
          enabled: false,
        },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'eventsStarted',
        yName: 'Events Started',
        marker: {
          enabled: false,
        },
      },
    ],
    axes: [
      {
        type: 'time',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
      },
    ],
  }));
  private initialData = toSignal(
    this.getInitialStatisticsDataGQL.fetch().pipe(map(({ data }) => data)),
  );
  protected allTimeStats = computed(
    () => this.initialData()?.allTimeStatistics,
  );

  constructor() {
    effect(() => {
      const tenantData = this.initialData()?.currentTenant;
      if (!tenantData) return;
      const startField = this.timeForm.get('start');
      // if (startField)
      // startField.setValue(
      //   DateTime.fromISO(tenantData.createdAt).toISO({
      //     includeOffset: false,
      //   }),
      // );
    });
    const timeFrameField = this.timeForm.get('timeFrame');
    this.timeForm
      .get('timeFrame')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value) => {
        switch (value) {
          case 'all':
            this.timeForm.patchValue({
              start: DateTime.fromISO(
                this.initialData()?.currentTenant.createdAt ??
                  new Date().toISOString(),
              ).toISO(),
              end: DateTime.local().toISO(),
            });
            break;
          case 'year':
            this.timeForm.patchValue({
              start: DateTime.local().minus({ years: 1 }).toISO(),
              end: DateTime.local().toISO(),
            });
            break;
          case 'half':
            this.timeForm.patchValue({
              start: DateTime.local().minus({ months: 6 }).toISO(),
              end: DateTime.local().toISO(),
            });
            break;
          case 'quarter':
            this.timeForm.patchValue({
              start: DateTime.local().minus({ months: 3 }).toISO(),
              end: DateTime.local().toISO(),
            });
            break;
          case 'week':
            this.timeForm.patchValue({
              start: DateTime.local().minus({ weeks: 1 }).toISO(),
              end: DateTime.local().toISO(),
            });
            break;
          case 'day':
            this.timeForm.patchValue({
              start: DateTime.local().minus({ days: 1 }).toISO(),
              end: DateTime.local().toISO(),
            });
            break;
          default:
            console.log(value);
        }
      });
    const startField = this.timeForm.get('start');
    const endField = this.timeForm.get('end');
    if (startField && endField && timeFrameField) {
      combineLatest([startField.valueChanges, endField.valueChanges])
        .pipe(
          takeUntilDestroyed(),
          debounceTime(200),
          withLatestFrom(timeFrameField.valueChanges),
        )
        .subscribe(([[start, end], timeFrame]) => {
          let unit: string;
          switch (timeFrame) {
            case 'all':
            case 'year':
            case 'half':
            case 'quarter':
            case 'week':
              unit = 'day';
              break;
            case 'day':
              unit = 'hour';
              break;
            default:
              unit = 'day';
          }
          if (start && end) {
            void this.rangeStatisticsReference.refetch({
              startDate: start,
              endDate: end,
              unit,
            });
          }
        });
    }
  }
}
