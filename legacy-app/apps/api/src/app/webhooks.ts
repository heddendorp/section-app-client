import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Stripe from 'stripe';
import { RegistrationType } from '@tumi/server-models';

const stripe = new Stripe.default.Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2020-08-27',
});

export const webhookRouter = (prisma) => {
  const router = express.Router();

  router.post(
    '/stripe',
    bodyParser.raw({ type: 'application/json' }),
    async (request, response) => {
      const sig = request.headers['stripe-signature'];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          process.env.STRIPE_WH_SECRET
        );
      } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
      }
      switch (event.type) {
        case 'checkout.session.completed': {
          const session: Stripe.Stripe.Checkout.Session = event.data.object;
          if (
            typeof session.setup_intent === 'string' &&
            typeof session.client_reference_id === 'string'
          ) {
            const setupIntent = await stripe.setupIntents.retrieve(
              session.setup_intent
            );
            if (typeof setupIntent.payment_method === 'string') {
              await prisma.stripeUserData.update({
                where: { id: session.client_reference_id },
                data: {
                  paymentMethodId: setupIntent.payment_method,
                },
              });
            }
          }
          break;
        }
        case 'payment_intent.processing': {
          const paymentIntent: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.processing');
          const charge = paymentIntent.charges.data[0];
          await prisma.eventRegistration.create({
            data: {
              type: RegistrationType.PARTICIPANT,
              event: { connect: { id: paymentIntent.metadata.eventId } },
              user: { connect: { id: paymentIntent.metadata.userId } },
              paymentIntentId: paymentIntent.id,
              chargeId: charge.id,
              paymentStatus: paymentIntent.status,
              amountPaid: charge.amount,
            },
          });
          break;
        }
        case 'payment_intent.succeeded': {
          const paymentIntent: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.succeeded');
          const charge = paymentIntent.charges.data[0];
          if (typeof charge?.balance_transaction === 'string') {
            const balanceTransaction =
              await stripe.balanceTransactions.retrieve(
                charge.balance_transaction
              );
            await prisma.eventRegistration.upsert({
              where: {
                userId_eventId: {
                  userId: paymentIntent.metadata.userId,
                  eventId: paymentIntent.metadata.eventId,
                },
              },
              create: {
                type: RegistrationType.PARTICIPANT,
                event: { connect: { id: paymentIntent.metadata.eventId } },
                user: { connect: { id: paymentIntent.metadata.userId } },
                paymentIntentId: paymentIntent.id,
                chargeId: charge.id,
                paymentStatus: 'succeeded',
                amountPaid: balanceTransaction.amount,
                netPaid: balanceTransaction.net,
                stripeFee: balanceTransaction.fee,
              },
              update: {
                amountPaid: balanceTransaction.amount,
                netPaid: balanceTransaction.net,
                stripeFee: balanceTransaction.fee,
                paymentStatus: 'succeeded',
              },
            });
          }
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      response.sendStatus(200);
    }
  );
  return router;
};
