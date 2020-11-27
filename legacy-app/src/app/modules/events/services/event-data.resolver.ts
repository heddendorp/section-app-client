import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { EventService } from '@tumi/services';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventDataResolver implements Resolve<any> {
  constructor(private eventService: EventService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get('id');
    if (id !== null) {
      return this.eventService.getOne$(id).pipe(first());
    } else {
      throw new Error('No id provided');
    }
  }
}
