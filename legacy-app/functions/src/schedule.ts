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

import * as functions from 'firebase-functions';
import * as got from 'got';
import * as moment from 'moment-timezone';
import { firestore } from './index';

export const openEvents = functions
  .region('europe-west1')
  .pubsub.schedule('every day 18:00')
  .timeZone('Europe/Berlin')
  .onRun(async (context) => {
    const now = new Date();
    const then = new Date();
    then.setDate(now.getDate() + 5);
    const querySnapshot = await firestore
      .collection('events')
      .where('isVisibleInternally', '==', true)
      .where('isExternal', '==', false)
      .where('isInternal', '==', false)
      .where('start', '>', now)
      .where('start', '<', then)
      .get();
    if (querySnapshot.empty) {
      console.log('No events found');
      return;
    }
    const events = querySnapshot.docs
      .map((doc) =>
        Object.assign(doc.data(), { start: moment(doc.data().start.toDate()), end: moment(doc.data().end.toDate()) }),
      )
      .filter((event) => event.tutorSpots > event.tutorSignups.length);
    if (!events.length) {
      console.log('No open events found');
      return;
    }
    const event_blocks = events.map((event) => {
      const iconString = event.icon;
      const [icon, style] = iconString.split(':');
      const image_url = `https://img.icons8.com/${style || 'color'}/192/${
        icon || 'tear-off-calendar'
      }.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${event.name}*\n_${event.start.tz('Europe/Berlin').format('DD.MM. HH:mm')} - ${event.end
            .tz('Europe/Berlin')
            .format('DD.MM. HH:mm')}_\n${event.tutorSpots - event.tutorSignups.length}/${
            event.tutorSpots
          } Tutors still needed\nhttps://esn-tumi.de/events/show/${event.id}`,
        },
        accessory: {
          type: 'image',
          image_url,
          alt_text: event.icon,
        },
      };
    });
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            'Good evening lovely @channel, in the coming days we have some events that are still missing Tutors :astonished:\n\n *Please take a look:*',
        },
      },
      { type: 'divider' },
      ...event_blocks,
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: "If you're interested in one of these events feel free to follow the link and sign up",
          },
        ],
      },
    ];
    try {
      const response = await got('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${functions.config().slack.token}`,
        },
        json: true,
        body: {
          token: functions.config().slack.token,
          blocks,
          channel: '#event-updates',
          text: 'Click for the daily update of events that need tutors',
        },
      });
      console.log(response.body);
    } catch (error) {
      console.log(error.response.body);
    }
  });
