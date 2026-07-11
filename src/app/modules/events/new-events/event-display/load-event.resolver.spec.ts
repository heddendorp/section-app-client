import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  RouterStateSnapshot,
} from '@angular/router';
import {
  LoadEventDisplayDataGQL,
  LoadEventDisplayDataQuery,
} from '@tumi/legacy-app/generated/generated';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { loadEventResolver } from './load-event.resolver';

describe('loadEventResolver', () => {
  let fetchSpy: Mock;
  const event = { id: 'event-1' } as LoadEventDisplayDataQuery['event'];
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    fetchSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoadEventDisplayDataGQL,
          useValue: { fetch: fetchSpy },
        },
      ],
    });
  });

  function resolve(eventId: string) {
    const route = {
      paramMap: convertToParamMap({ eventId }),
    } as ActivatedRouteSnapshot;

    return TestBed.runInInjectionContext(() =>
      loadEventResolver(route, state),
    ) as Observable<LoadEventDisplayDataQuery['event']>;
  }

  it('loads the route event through the unbatched resolver query', async () => {
    fetchSpy.mockReturnValue(of({ data: { event } }));

    await expect(firstValueFrom(resolve('event-1'))).resolves.toBe(event);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith({
      variables: { eventID: 'event-1' },
    });
  });

  it('reports missing resolver data instead of completing silently', async () => {
    fetchSpy.mockReturnValue(of({ data: undefined }));

    await expect(firstValueFrom(resolve('event-1'))).rejects.toThrow(
      'Unable to load the event.',
    );
  });
});
