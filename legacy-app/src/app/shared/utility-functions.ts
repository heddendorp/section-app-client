/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
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

import { EventSignup, TumiEvent } from './services/event.service';

export const getFreeSpots = (event: TumiEvent) => {
  const participants = event.usersSignedUp;
  const quota = participants / event.participantSpots;
  if (quota < 0.5) {
    return 'Many free spots';
  } else if (quota < 0.8) {
    return 'Some spots left';
  } else if (quota < 1) {
    return 'Few spots left';
  } else {
    return 'Event is full';
  }
};

export const gtagFunction = (...args) => {
  // @ts-ignore
  gtag(...args);
};

export const gtagConfig = (value: any) => {
  gtagFunction('config', 'G-04YZMLFE3Z', value);
};

export const sendEvent = (name: string, data: any = {}) => {
  gtagFunction('event', name, data);
};

export const countSignups = (acc: number, curr: EventSignup) => acc + curr.partySize;

export const filterEvents = (filter, isTutor) => {
  return (event: TumiEvent) => {
    if (!filter.showExternal && event.isExternal) {
      return false;
    }
    if (
      !filter.showFullTutors &&
      event.tutorSpots <= event.tutorSignups.length &&
      !event.isInternal &&
      !event.isExternal &&
      !event.isTicketTracker &&
      isTutor
    ) {
      return false;
    }
    if (
      !filter.showFull &&
      event.usersSignedUp >= event.participantSpots &&
      !event.isInternal &&
      !event.isExternal &&
      !event.isTicketTracker
    ) {
      return false;
    }
    return true;
  };
};
