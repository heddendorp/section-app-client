import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RatingItemComponent } from '../../../shared/components/rating-item/rating-item.component';
import {
  GetEventTemplateRatingsGQL,
  GetEventTemplateRatingsQuery,
} from '@tumi/legacy-app/generated/generated';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';

type EventInstances = NonNullable<
  GetEventTemplateRatingsQuery['eventTemplate']
>['eventInstances'];

@Component({
  selector: 'app-template-ratings',
  templateUrl: './template-ratings.component.html',
  styleUrls: ['./template-ratings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RatingItemComponent, DatePipe, DecimalPipe],
})
export class TemplateRatingsComponent {
  private readonly getTemplateRatingsGQL = inject(GetEventTemplateRatingsGQL);

  readonly templateId = input.required<string>();

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly events = signal<EventInstances>([] as EventInstances);

  protected readonly ratedEvents = computed(() =>
    (this.events() ?? []).filter((event) => {
      const participantCount = event.participantRatingCount ?? 0;
      const organizerCount = event.organizerRatingCount ?? 0;
      return participantCount > 0 || organizerCount > 0;
    }),
  );

  constructor() {
    toObservable(this.templateId)
      .pipe(
        filter((id): id is string => !!id),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(
          (id) => this.getTemplateRatingsGQL.watch({ id }).valueChanges,
        ),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: ({ data, loading, errors }) => {
          const events = (data.eventTemplate?.eventInstances ??
            []) as EventInstances;
          this.events.set(events);
          this.loading.set(loading);
          if (errors && errors.length > 0) {
            this.error.set(errors.map((err) => err.message).join('\n'));
          } else {
            this.error.set(null);
          }
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Failed to load ratings');
          this.loading.set(false);
        },
      });
  }
}
