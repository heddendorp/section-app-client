import * as functions from 'firebase-functions';
import * as moment from 'moment-timezone';
import { firestore } from './index';
import got from 'got';

export const updatePayments = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async () => {
    const openPayments = await firestore
      .collectionGroup('signups')
      .where('paypal', '!=', false)
      .get();
    await Promise.all(
      openPayments.docs
        .filter((doc) => !doc.get('paypal.completed'))
        .map(async (doc) => {
          const registration = doc.data();
          const orderInfo = await got(
            `https://api.paypal.com/v2/checkout/orders/${registration.paypal.orderId}`,
            {
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `${functions.config().paypal.id}:${
                    functions.config().paypal.secret
                  }`
                ).toString('base64')}`,
              },
            }
          ).json<any>();
          const completed = !orderInfo.purchase_units.find((unit: any) =>
            unit.payments.captures.find(
              (capture: any) => capture.status !== 'COMPLETED'
            )
          );
          const fullFees = orderInfo.purchase_units.reduce(
            (acc: number, item: any) =>
              acc +
              item.payments.captures
                .filter((capture: any) => capture.status === 'COMPLETED')
                .reduce(
                  (acc: number, item: any) =>
                    acc +
                    parseFloat(
                      item.seller_receivable_breakdown.paypal_fee.value
                    ),
                  0
                ),
            0
          );
          const fullValue = orderInfo.purchase_units.reduce(
            (acc: number, item: any) =>
              acc +
              item.payments.captures.reduce(
                (acc: number, item: any) => acc + parseFloat(item.amount.value),
                0
              ),
            0
          );
          const fullNet = orderInfo.purchase_units.reduce(
            (acc: number, item: any) =>
              acc +
              item.payments.captures
                .filter((capture: any) => capture.status === 'COMPLETED')
                .reduce(
                  (acc: number, item: any) =>
                    acc +
                    parseFloat(
                      item.seller_receivable_breakdown.net_amount.value
                    ),
                  0
                ),
            0
          );
          const paypal = {
            orderId: registration.paypal.orderId,
            orderStatus: orderInfo.status,
            completed,
            fullValue,
            fullNet,
            fullFees,
          };
          functions.logger.info(paypal);
          return doc.ref.update({ paypal });
        })
    );
  });

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
      .where('visibility', 'in', ['public', 'internal'])
      .where('type', '==', 'event')
      .where('start', '>', now)
      .where('start', '<', then)
      .get();
    if (querySnapshot.empty) {
      functions.logger.log('No events found');
      return;
    }
    const events = querySnapshot.docs
      .map((doc) =>
        Object.assign(doc.data(), {
          start: moment(doc.data().start.toDate()),
          end: moment(doc.data().end.toDate()),
        })
      )
      .filter((event) => event.tutorSpots > event.tutorSignups.length);
    if (!events.length) {
      functions.logger.log('No open events found');
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
          text: `*${event.name}*\n_${event.start
            .tz('Europe/Berlin')
            .format('DD.MM. HH:mm')} - ${event.end
            .tz('Europe/Berlin')
            .format('DD.MM. HH:mm')}_\n${
            event.tutorSpots - event.tutorSignups.length
          }/${
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
            text:
              "If you're interested in one of these events feel free to follow the link and sign up",
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
        json: {
          token: functions.config().slack.token,
          blocks,
          channel: '#event-updates',
          text: 'Click for the daily update of events that need tutors',
        },
      });
      functions.logger.info(response.body);
    } catch (error) {
      functions.logger.error(error.response.body);
    }
  });
