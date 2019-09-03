import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EventService, TumiEvent } from '../../shared/services/event.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class LoadFullEventResolver implements Resolve<TumiEvent> {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TumiEvent> | Promise<TumiEvent> | TumiEvent {
    return this.userService.getEventWithUsers(route.paramMap.get('eventId')).pipe(first());
  }
}
