import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { GetInitialGlobalStatisticsDataGQL } from '@tumi/legacy-app/generated/generated';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-global-statistics',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './global-statistics.component.html',
  styleUrl: './global-statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalStatisticsComponent {
  private getInitialGlobalStatisticsDataGQL = inject(
    GetInitialGlobalStatisticsDataGQL,
  );
  private initialData = toSignal(
    this.getInitialGlobalStatisticsDataGQL
      .fetch()
      .pipe(map(({ data }) => data)),
  );
  protected allTimeStats = computed(
    () => this.initialData()?.allTimeStatistics,
  );
}
