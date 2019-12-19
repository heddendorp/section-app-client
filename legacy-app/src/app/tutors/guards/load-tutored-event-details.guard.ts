/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadEvent, LoadRegistrations, SelectEvent } from '../../shared/state/events.actions';
import { EventsState } from '../../shared/state/events.state';
import { LoadUsers } from '../../shared/state/users.actions';

@Injectable({
  providedIn: 'root'
})
export class LoadTutoredEventDetailsGuard implements CanActivate {
  constructor(private store: Store) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    this.store.dispatch([
      new LoadRegistrations(next.paramMap.get('eventId')),
      new SelectEvent(next.paramMap.get('eventId'))
    ]);
    await this.store.dispatch(new LoadEvent(next.paramMap.get('eventId'))).toPromise();
    const activeEvent = this.store.selectSnapshot(EventsState.getEvent(next.paramMap.get('eventId')));
    this.store.dispatch(new LoadUsers(activeEvent.tutorSignups));
    return true;
  }
}
