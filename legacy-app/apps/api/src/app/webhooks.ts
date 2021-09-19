import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Stripe from 'stripe';

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
        }
      }
    }
  );
  return router;
};
