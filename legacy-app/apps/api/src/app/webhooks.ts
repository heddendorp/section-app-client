import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Stripe from 'stripe';
import { LogSeverity, RegistrationType } from '@tumi/server-models';

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
          if (!paymentIntent.metadata.isMove) {
            try {
              await prisma.eventRegistration.upsert({
                where: {
                  userId_eventId: {
                    userId: paymentIntent.metadata.userId,
                    eventId: paymentIntent.metadata.eventId,
                  },
                },
                update: {
                  paymentIntentId: paymentIntent.id,
                  chargeId: charge.id,
                  paymentStatus: paymentIntent.status,
                },
                create: {
                  type: RegistrationType.PARTICIPANT,
                  event: { connect: { id: paymentIntent.metadata.eventId } },
                  user: { connect: { id: paymentIntent.metadata.userId } },
                  paymentIntentId: paymentIntent.id,
                  chargeId: charge.id,
                  paymentStatus: paymentIntent.status,
                },
              });
            } catch (e) {
              await prisma.activityLog.create({
                data: {
                  data: e,
                  oldData: paymentIntent,
                  severity: LogSeverity.ERROR,
                  message:
                    'Failed to upsert event registration after processing payment on registration!',
                },
              });
            }
          } else {
            const registration = await prisma.eventRegistration.findUnique({
              where: { id: paymentIntent.metadata.registrationId },
              include: { event: true, user: true },
            });
            if (!registration) {
              await prisma.activityLog.create({
                data: {
                  message: `Registration move failed because registration was not found`,
                  data: paymentIntent,
                  severity: LogSeverity.ERROR,
                },
              });
              throw new Error(
                'Could not process event registration move because of missing registration'
              );
            }
            const moveOrder =
              await prisma.eventRegistrationMoveOrder.findUnique({
                where: { id: paymentIntent.metadata.moveOrderId },
              });
            if (!moveOrder) {
              await prisma.activityLog.create({
                data: {
                  message: `Registration move failed because move order was not found`,
                  data: paymentIntent,
                  severity: LogSeverity.ERROR,
                },
              });
              throw new Error(
                'Could not process event registration move because of missing order'
              );
            }
            try {
              await stripe.refunds.create({
                payment_intent: registration.paymentIntentId,
                reason: 'requested_by_customer',
                metadata: {
                  eventId: registration.event.id,
                  userId: registration.user.id,
                  event: event.title,
                },
              });
            } catch (e) {
              await prisma.activityLog.create({
                data: {
                  message: `Refund failed during registration move`,
                  data: e,
                  oldData: paymentIntent,
                  severity: LogSeverity.ERROR,
                },
              });
            }
            await prisma.eventRegistrationMoveOrder.update({
              where: { id: moveOrder.id },
              data: {
                usedBy: paymentIntent.metadata.userId,
                usedAt: new Date(),
              },
            });
            await prisma.eventRegistration.update({
              where: { id: registration.id },
              data: {
                user: { connect: { id: paymentIntent.metadata.userId } },
                paymentIntentId: paymentIntent.id,
                chargeId: charge.id,
                paymentStatus: paymentIntent.status,
                amountPaid: paymentIntent.amount,
                netPaid: null,
                stripeFee: null,
              },
            });
          }
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
            if (!paymentIntent.metadata.isMove) {
              try {
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
                    paymentStatus: paymentIntent.status,
                    amountPaid: balanceTransaction.amount,
                    netPaid: balanceTransaction.net,
                    stripeFee: balanceTransaction.fee,
                  },
                  update: {
                    amountPaid: balanceTransaction.amount,
                    netPaid: balanceTransaction.net,
                    stripeFee: balanceTransaction.fee,
                    paymentIntentId: paymentIntent.id,
                    chargeId: charge.id,
                    paymentStatus: paymentIntent.status,
                  },
                });
              } catch (e) {
                await prisma.activityLog.create({
                  data: {
                    data: e,
                    oldData: paymentIntent,
                    severity: LogSeverity.ERROR,
                    message:
                      'Failed to upsert event registration after succeeded payment on registration!',
                  },
                });
              }
            } else {
              const registration = await prisma.eventRegistration.findUnique({
                where: { id: paymentIntent.metadata.registrationId },
                include: { event: true, user: true },
              });
              if (!registration) {
                await prisma.activityLog.create({
                  data: {
                    message: `Registration move failed because registration was not found`,
                    data: paymentIntent,
                    severity: LogSeverity.ERROR,
                  },
                });
                throw new Error(
                  'Could not process event registration move because of missing registration'
                );
              }
              const moveOrder =
                await prisma.eventRegistrationMoveOrder.findUnique({
                  where: { id: paymentIntent.metadata.moveOrderId },
                });
              if (!moveOrder) {
                await prisma.activityLog.create({
                  data: {
                    message: `Registration move failed because move order was not found`,
                    data: paymentIntent,
                    severity: LogSeverity.ERROR,
                  },
                });
                throw new Error(
                  'Could not process event registration move because of missing order'
                );
              }
              if (registration.paymentStaus !== 'processing') {
                try {
                  await stripe.refunds.create({
                    payment_intent: registration.paymentIntentId,
                    reason: 'requested_by_customer',
                    metadata: {
                      eventId: registration.event.id,
                      userId: registration.user.id,
                      event: event.title,
                    },
                  });
                } catch (e) {
                  await prisma.activityLog.create({
                    data: {
                      message: `Refund failed during registration move`,
                      data: e,
                      oldData: paymentIntent,
                      severity: LogSeverity.ERROR,
                    },
                  });
                }
                await prisma.eventRegistrationMoveOrder.update({
                  where: { id: moveOrder.id },
                  data: {
                    usedBy: paymentIntent.metadata.userId,
                    usedAt: new Date(),
                  },
                });
              }
              await prisma.eventRegistration.update({
                where: { id: registration.id },
                data: {
                  user: { connect: { id: paymentIntent.metadata.userId } },
                  amountPaid: balanceTransaction.amount,
                  netPaid: balanceTransaction.net,
                  stripeFee: balanceTransaction.fee,
                  paymentIntentId: paymentIntent.id,
                  chargeId: charge.id,
                  paymentStatus: paymentIntent.status,
                },
              });
            }
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.payment_failed');
          if (!paymentIntent.metadata.isMove) {
            try {
              await prisma.eventRegistration.delete({
                where: {
                  userId_eventId: {
                    userId: paymentIntent.metadata.userId,
                    eventId: paymentIntent.metadata.eventId,
                  },
                },
              });
            } catch (e) {
              await prisma.activityLog.create({
                data: {
                  data: e,
                  oldData: paymentIntent,
                  severity: LogSeverity.ERROR,
                  message:
                    'Failed to remove event registration after failed payment on registration!',
                },
              });
            }
          } else {
            await prisma.eventRegistrationMoveOrder.delete({
              where: { id: paymentIntent.metadata.moveOrderId },
            });
            try {
              await prisma.eventRegistration.delete({
                where: { id: paymentIntent.metadata.registrationId },
              });
            } catch (e) {
              await prisma.activityLog.create({
                data: {
                  data: e,
                  oldData: paymentIntent,
                  severity: LogSeverity.ERROR,
                  message:
                    'Failed to remove event registration after failed payment on move!',
                },
              });
            }
            await prisma.activityLog.create({
              data: {
                message: `Event move was aborted due to failed payment`,
                data: paymentIntent,
                severity: LogSeverity.WARNING,
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
