import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { EventListGQL, EventListQuery } from '@tumi/data-access';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventListResolver implements Resolve<EventListQuery['events']> {
  constructor(private eventListGQL: EventListGQL) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<EventListQuery['events']> {
    return this.eventListGQL.fetch().pipe(map(({ data }) => data.events));
  }
}
