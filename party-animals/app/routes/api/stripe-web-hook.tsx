import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Stripe from 'stripe';
import { db } from '~/utils/db.server';
import { PaymentStatus } from '~/generated/prisma';

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature') ?? '';
  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2020-08-27',
    });
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET ?? ''
    );
  } catch (err: any) {
    console.log(err);
    throw json({ errors: [{ message: err.message }] }, 400);
  }
  // console.log('event', event);
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const registrationId = intent.metadata.registrationId;
    if (!registrationId) {
      throw json({ response: [{ message: 'No registrationId found' }] }, 200);
    }
    await db.registration.update({
      where: { id: registrationId },
      data: { paymentStatus: PaymentStatus.SUCCESS },
    });
  }
  return new Response(null, { status: 200 });
};
