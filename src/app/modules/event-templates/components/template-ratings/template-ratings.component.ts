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
import { CombinedGraphQLErrors } from '@apollo/client/errors';

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
          (id) =>
            this.getTemplateRatingsGQL.watch({ variables: { id } })
              .valueChanges,
        ),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: ({ data, dataState, loading, error }) => {
          if (dataState === 'complete') {
            this.events.set(data.eventTemplate?.eventInstances ?? []);
          }
          this.loading.set(loading);
          this.error.set(this.getErrorMessage(error));
        },
        error: (error: unknown) => {
          this.error.set(
            this.getErrorMessage(error) ?? 'Failed to load ratings',
          );
          this.loading.set(false);
        },
      });
  }

  private getErrorMessage(error: unknown): string | null {
    if (CombinedGraphQLErrors.is(error)) {
      return error.errors.map(({ message }) => message).join('\n');
    }

    return error instanceof Error ? error.message : null;
  }
}
