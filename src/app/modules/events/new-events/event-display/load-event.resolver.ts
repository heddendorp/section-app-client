import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import {
  LoadEventDisplayDataGQL,
  LoadEventDisplayDataQuery,
} from '@tumi/legacy-app/generated/generated';
import { map } from 'rxjs';

export const loadEventResolver: ResolveFn<
  LoadEventDisplayDataQuery['event']
> = (route) => {
  return inject(LoadEventDisplayDataGQL)
    .fetch({ variables: { eventID: route.paramMap.get('eventId') ?? '' } })
    .pipe(
      map(({ data }) => {
        if (!data) {
          throw new Error('Unable to load the event.');
        }
        return data.event;
      }),
    );
};
