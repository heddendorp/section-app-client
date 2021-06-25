import * as functions from 'firebase-functions';
import { firestore } from './index';
// import { firestore } from './index';
// import * as _ from 'lodash';
const stripe = require('stripe')(functions.config().stripe.key);

export const createCheckoutSession = functions.https.onCall(
  async ({
    customer_email,
    payment_method_types,
    line_items,
    metadata,
    success_url,
    cancel_url,
  }) => {
    const session = await stripe.checkout.sessions.create({
      customer_email,
      payment_method_types,
      line_items,
      metadata,
      mode: 'payment',
      success_url,
      cancel_url,
    });
    return { id: session.id };
  }
);

export const paymentWebhook = functions.https.onRequest(async (req, res) => {
  const endpointSecret = functions.config().stripe.webhook;
  const sig = req.header('stripe-signature');
  const payload = req.rawBody;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log({
      payment_intent: session.payment_intent,
      extend: ['balance_transaction'],
    });
    let charges;

    try {
      charges = await stripe.charges.list({
        payment_intent: session.payment_intent,
        expand: ['data.balance_transaction'],
      });
    } catch (err) {
      console.error(err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const fee = charges.data
      .map((charge: any) => charge.balance_transaction.fee)
      .reduce((acc: number, curr: number) => acc + curr, 0);

    const eventId = session.metadata.event;
    const userId = session.metadata.user;
    await firestore
      .collection('events')
      .doc(eventId)
      .collection('signups')
      .doc(userId)
      .set({
        id: userId,
        partySize: 1,
        hasPayed: true,
        hasAttended: false,
        stripe: {
          id: session.id,
          payment_status: session.payment_status,
          payment_intent: session.payment_intent,
          fee,
          chargeIds: charges.data.map((charge: any) => charge.id),
        },
        timestap: new Date(),
      });
  }
  res.status(200).send('ok');
});
