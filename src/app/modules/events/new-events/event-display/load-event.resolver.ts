import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import {
  LoadEventDisplayDataGQL,
  LoadEventDisplayDataQuery,
} from '@tumi/legacy-app/generated/generated';
import { map } from 'rxjs';

export const loadEventResolver: ResolveFn<
  LoadEventDisplayDataQuery['event']
> = (route, state) => {
  return inject(LoadEventDisplayDataGQL)
    .fetch({ eventID: route.paramMap.get('eventId') ?? '' })
    .pipe(map(({ data }) => data.event));
};
