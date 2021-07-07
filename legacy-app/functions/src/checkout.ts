import * as functions from 'firebase-functions';
import { firestore } from './index';
import * as nodemailer from 'nodemailer';
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
    const userId = metadata.user;
    const eventId = metadata.event;
    const userRef = await firestore.collection('users').doc(userId).get();
    const user = userRef.data();
    if (!user) {
      throw new Error('No user found');
    }

    if (!user.stripeCustomerId) {
      functions.logger.debug('Creating stripe customer for ' + user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone,
        metadata: { userId },
      });
      await userRef.ref.update({ stripeCustomerId: customer.id });
      user.stripeCustomerId = customer.id;
    }

    const eventRef = await firestore.collection('events').doc(eventId).get();
    const event = eventRef.data();
    if (!event) {
      throw new Error('No event found');
    }

    if (!event.stripeProductId) {
      const [icon, style] = event.icon.split(':');
      const stripeRequest = {
        name: event.name,
        images: [
          `https://img.icons8.com/${style ?? 'color'}/192/${
            icon ?? ''
          }.png?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`,
        ],
        url: `https://tumi.esn.world/events/${eventRef.id}`,
      };
      functions.logger.debug(stripeRequest);
      const product = await stripe.products.create(stripeRequest);
      functions.logger.debug(product);
      await eventRef.ref.update({ stripeProductId: product.id });
      event.stripeProductId = product.id;
    }

    if (!event.stripePriceId) {
      const stripeRequest = {
        currency: 'eur',
        product: event.stripeProductId,
        unit_amount: event.price * 100,
        billing_scheme: 'per_unit',
        metadata: { eventId },
      };
      functions.logger.debug(stripeRequest);
      const price = await stripe.prices.create(stripeRequest);
      functions.logger.debug(price);
      await eventRef.ref.update({ stripePriceId: price.id });
      event.stripePriceId = price.id;
    }

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        customer: user.stripeCustomerId,
        payment_method_types,
        line_items: [{ price: event.stripePriceId, quantity: 1 }],
        metadata,
        mode: 'payment',
        success_url,
        cancel_url,
        allow_promotion_codes: true,
      });
      functions.logger.debug(session);
    } catch (err) {
      functions.logger.debug('Session add failed');
      functions.logger.warn(err.message);
    }
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
    functions.logger.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const session = event.data.object;

  if (event.type === 'checkout.session.async_payment_failed') {
    const transporter = nodemailer.createTransport(
      {
        port: 587,
        host: 'postout.lrz.de',
        secure: false,
        auth: {
          user: 'tumi.tuzeio1@tum.de',
          pass: functions.config().email.pass,
        },
      },
      { replyTo: 'tumi@zv.tum.de', from: 'tumi.tuzeio1@tum.de' }
    );
    await transporter.sendMail({
      subject: '[TUMi] Payment fail',
      to: 'president@esn-tumi.de',
      bcc: 'lu.heddendorp@gmail.com',
      text: `failed payment at
        ${JSON.stringify(session)}
        Please check stripe right now`,
    });
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
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

    let fee;
    if (session.payment_status === 'paid') {
      fee = charges.data
        .map((charge: any) => charge.balance_transaction.fee)
        .reduce((acc: number, curr: number) => acc + curr, 0);
    } else {
      fee = 0;
    }

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
        timestamp: new Date(),
      });
  }
  res.status(200).send('ok');
});
