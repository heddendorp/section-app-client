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

export class LoadUpcomingEvents {
  static readonly type = '[Events] Load upcoming events';
}

export class LoadTutoredEvents {
  static readonly type = '[Events] Load tutored events';
}

export class SelectEvent {
  static readonly type = '[Events] Select Event';

  constructor(public eventId: string) {}
}

export class LoadRegistrations {
  static readonly type = '[Events] Load registrations for Event';

  constructor(public eventId: string) {}
}
