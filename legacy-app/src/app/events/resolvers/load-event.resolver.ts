import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class LoadEventResolver implements Resolve<TumiEvent> {
  constructor(private eventService: EventService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TumiEvent> | Promise<TumiEvent> | TumiEvent {
    return this.eventService.getEventWithRegistrations(route.paramMap.get('eventId')).pipe(first());
  }
}
