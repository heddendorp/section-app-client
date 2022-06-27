import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Stripe from 'stripe';
import {
  LogSeverity,
  Prisma,
  PrismaClient,
  PurchaseStatus,
  RegistrationStatus,
} from '../generated/prisma';
import InputJsonObject = Prisma.InputJsonObject;

const stripe: Stripe.Stripe = require('stripe')(process.env['STRIPE_KEY']);

export const webhookRouter = (prisma: PrismaClient) => {
  const router = express.Router();
  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.send(err);
  });
  router.post(
    '/stripe',
    bodyParser.raw({ type: 'application/json' }),
    async (request, response, next) => {
      const sig = request.headers['stripe-signature'] as string;

      let event;
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          process.env.STRIPE_WH_SECRET ?? ''
        );
      } catch (err: any) {
        console.error(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      console.log(event.type);
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
          const stripePayment = await prisma.stripePayment.findUnique({
            where: { paymentIntent: paymentIntent.id },
          });
          if (!stripePayment) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                message: 'No database payment found for incoming event',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          const charge = paymentIntent.charges.data[0];
          if (Array.isArray(stripePayment.events)) {
            await prisma.stripePayment.update({
              where: { paymentIntent: paymentIntent.id },
              data: {
                status: paymentIntent.status,
                shipping: paymentIntent.shipping
                  ? JSON.parse(JSON.stringify(paymentIntent.shipping))
                  : undefined,
                paymentMethod: charge.payment_method,
                paymentMethodType: charge.payment_method_details?.type,
                events: [
                  ...stripePayment.events,
                  {
                    type: 'payment_intent.processing',
                    name: 'processing',
                    date: Date.now(),
                  },
                ],
              },
              // include: {
              //   transaction: {
              //     include: {
              //       eventRegistration: true,
              //       eventRegistrationCode: true,
              //     },
              //   },
              //   purchase: true,
              // },
            });
          } else {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                oldData: JSON.parse(JSON.stringify(stripePayment)),
                message: 'Saved payment events are not an array',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
          }
          break;
        }
        case 'payment_intent.succeeded': {
          const eventObject: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.succeeded');
          const paymentIntent = await stripe.paymentIntents.retrieve(
            eventObject.id
          );
          if (paymentIntent.status !== 'succeeded') {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                oldData: JSON.parse(JSON.stringify(eventObject)),
                message: 'Payment intent status is not succeeded',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          const stripePayment = await prisma.stripePayment.findUnique({
            where: { paymentIntent: paymentIntent.id },
          });
          if (!stripePayment) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                message: 'No database payment found for incoming event',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          const charge = paymentIntent.charges.data[0];
          let balanceTransaction;
          if (typeof charge?.balance_transaction === 'string') {
            balanceTransaction = await stripe.balanceTransactions.retrieve(
              charge.balance_transaction
            );
          } else {
            balanceTransaction = charge?.balance_transaction;
          }
          let payment;
          if (Array.isArray(stripePayment.events)) {
            try {
              payment = await prisma.stripePayment.update({
                where: { paymentIntent: paymentIntent.id },
                data: {
                  status: paymentIntent.status,
                  shipping: paymentIntent.shipping
                    ? JSON.parse(JSON.stringify(paymentIntent.shipping))
                    : undefined,
                  paymentMethod: charge.payment_method,
                  paymentMethodType: charge.payment_method_details?.type,
                  feeAmount: balanceTransaction.fee,
                  netAmount: balanceTransaction.net,
                  events: [
                    ...stripePayment.events,
                    {
                      type: 'payment_intent.succeeded',
                      name: 'succeeded',
                      date: Date.now(),
                    },
                  ],
                },
                include: {
                  transaction: {
                    include: {
                      eventRegistration: true,
                      eventRegistrationCode: true,
                      purchase: true,
                    },
                  },
                },
              });
            } catch (e) {
              await prisma.activityLog.create({
                data: {
                  data: JSON.parse(JSON.stringify(paymentIntent)),
                  oldData: e as InputJsonObject,
                  message: 'Error updating payment in webhook',
                  severity: 'ERROR',
                  category: 'webhook',
                },
              });
            }
          } else {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                oldData: JSON.parse(JSON.stringify(stripePayment)),
                message: 'Saved payment events are not an array',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          if (payment.transaction.eventRegistration) {
            await prisma.eventRegistration.update({
              where: { id: payment.transaction.eventRegistration.id },
              data: { status: RegistrationStatus.SUCCESSFUL },
            });
          }
          if (payment.transaction.purchase) {
            try {
              await prisma.purchase.update({
                where: { paymentId: payment.transaction.id },
                data: { status: PurchaseStatus.PAID },
              });
            } catch (e) {
              await prisma.activityLog.create({
                data: {
                  data: e as InputJsonObject,
                  oldData: JSON.parse(JSON.stringify(payment)),
                  message: 'Could not update the purchase',
                  severity: 'WARNING',
                  category: 'webhook',
                },
              });
            }
          }
          if (payment.transaction.eventRegistrationCode) {
            if (
              payment.transaction.eventRegistrationCode?.registrationToRemoveId
            ) {
              const registrationToRemove =
                await prisma.eventRegistration.findUnique({
                  where: {
                    id: payment.transaction.eventRegistrationCode
                      .registrationToRemoveId,
                  },
                });
              if (
                registrationToRemove?.status !== RegistrationStatus.CANCELLED
              ) {
                const removedRegistration =
                  await prisma.eventRegistration.update({
                    where: {
                      id: payment.transaction.eventRegistrationCode
                        .registrationToRemoveId,
                    },
                    data: {
                      status: RegistrationStatus.CANCELLED,
                      cancellationReason: 'Event was moved to another person',
                    },
                    include: {
                      transaction: { include: { stripePayment: true } },
                    },
                  });
                await prisma.tumiEvent.update({
                  where: { id: removedRegistration.eventId },
                  data: { participantRegistrationCount: { decrement: 1 } },
                });
                if (removedRegistration.transaction?.stripePayment) {
                  try {
                    await stripe.refunds.create({
                      payment_intent:
                        removedRegistration.transaction.stripePayment
                          .paymentIntent,
                    });
                  } catch (e) {
                    await prisma.activityLog.create({
                      data: {
                        message: `Refund failed during registration move`,
                        category: 'webhook',
                        data: e as InputJsonObject,
                        oldData: JSON.parse(
                          JSON.stringify(removedRegistration)
                        ),
                        severity: LogSeverity.ERROR,
                      },
                    });
                  }
                }
              }
            }

            if (
              payment.transaction.eventRegistrationCode?.registrationCreatedId
            ) {
              await prisma.eventRegistration.update({
                where: {
                  id: payment.transaction.eventRegistrationCode
                    .registrationCreatedId,
                },
                data: {
                  status: RegistrationStatus.SUCCESSFUL,
                },
              });
            }

            await prisma.eventRegistrationCode.update({
              where: { id: payment.transaction.eventRegistrationCode.id },
              data: {
                // registrationCreatedId: newRegistration.id,
                status: RegistrationStatus.SUCCESSFUL,
              },
            });
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.payment_failed');
          const stripePayment = await prisma.stripePayment.findUnique({
            where: { paymentIntent: paymentIntent.id },
          });
          if (!stripePayment) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                message: 'No database payment found for incoming event',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          let payment;
          if (Array.isArray(stripePayment.events)) {
            payment = await prisma.stripePayment.update({
              where: { paymentIntent: paymentIntent.id },
              data: {
                status: paymentIntent.status,
                shipping: paymentIntent.shipping
                  ? JSON.parse(JSON.stringify(paymentIntent.shipping))
                  : undefined,
                events: [
                  ...stripePayment.events,
                  {
                    type: 'payment_intent.payment_failed',
                    name: 'failed',
                    date: Date.now(),
                  },
                ],
              },
              include: {
                transaction: {
                  include: {
                    eventRegistration: true,
                    eventRegistrationCode: true,
                    purchase: true,
                  },
                },
              },
            });
          } else {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                oldData: JSON.parse(JSON.stringify(stripePayment)),
                message: 'Saved payment events are not an array',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          /*if (payment.transaction.eventRegistration) {
            await prisma.eventRegistration.update({
              where: { id: payment.transaction.eventRegistration.id },
              data: {
                status: RegistrationStatus.CANCELLED,
                cancellationReason: 'Payment failed',
              },
            });
            await prisma.tumiEvent.update({
              where: { id: payment.transaction.eventRegistration.eventId },
              data: { participantRegistrationCount: { decrement: 1 } },
            });
          }*/
          /*if (payment.transaction.purchase) {
            await prisma.purchase.update({
              where: { id: payment.transaction.purchase.id },
              data: {
                status: PurchaseStatus.CANCELLED,
                cancellationReason: 'Payment failed',
              },
            });
          }*/
          /*if (payment.transaction.eventRegistrationCode) {
            if (
              payment.transaction.eventRegistrationCode.registrationToRemoveId
            ) {
              await prisma.eventRegistration.update({
                where: {
                  id: payment.transaction.eventRegistrationCode
                    .registrationToRemoveId,
                },
                data: {
                  status: RegistrationStatus.SUCCESSFUL,
                  cancellationReason: null,
                },
              });
              await prisma.tumiEvent.update({
                where: { id: payment.transaction.eventRegistration.eventId },
                data: { participantRegistrationCount: { increment: 1 } },
              });
            }

            if (
              payment.transaction.eventRegistrationCode.registrationCreatedId
            ) {
              await prisma.eventRegistration.update({
                where: {
                  id: payment.transaction.eventRegistrationCode
                    .registrationCreatedId,
                },
                data: {
                  status: RegistrationStatus.CANCELLED,
                  cancellationReason: 'Payment for move failed',
                },
              });
              await prisma.tumiEvent.update({
                where: { id: payment.transaction.eventRegistration.eventId },
                data: { participantRegistrationCount: { decrement: 1 } },
              });
            }
            await prisma.eventRegistrationCode.update({
              where: { id: payment.transaction.eventRegistrationCode.id },
              data: {
                registrationCreatedId: null,
                status: RegistrationStatus.PENDING,
              },
            });
          }*/
          break;
        }
        case 'payment_intent.canceled': {
          const eventObject: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.canceled');
          const paymentIntent = await stripe.paymentIntents.retrieve(
            eventObject.id
          );
          if (paymentIntent.status !== 'canceled') {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                oldData: JSON.parse(JSON.stringify(eventObject)),
                message: 'Payment intent status is not canceled',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          const stripePayment = await prisma.stripePayment.findUnique({
            where: { paymentIntent: paymentIntent.id },
          });
          if (!stripePayment) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                message: 'No database payment found for incoming event',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          let payment;
          if (Array.isArray(stripePayment.events)) {
            payment = await prisma.stripePayment.update({
              where: { paymentIntent: paymentIntent.id },
              data: {
                status: paymentIntent.status,
                events: [
                  ...stripePayment.events,
                  {
                    type: 'payment_intent.canceled',
                    name: 'canceled',
                    date: Date.now(),
                  },
                ],
              },
              include: {
                transaction: {
                  include: {
                    eventRegistration: true,
                    eventRegistrationCode: true,
                    purchase: true,
                  },
                },
              },
            });
          } else {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                oldData: JSON.parse(JSON.stringify(stripePayment)),
                message: 'Saved payment events are not an array',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          if (
            payment.transaction.eventRegistration &&
            payment.transaction.eventRegistration.status !==
              RegistrationStatus.CANCELLED
          ) {
            await prisma.eventRegistration.update({
              where: { id: payment.transaction.eventRegistration.id },
              data: {
                status: RegistrationStatus.CANCELLED,
                cancellationReason: 'Payment intent timed out',
              },
            });
            await prisma.tumiEvent.update({
              where: { id: payment.transaction.eventRegistration.eventId },
              data: { participantRegistrationCount: { decrement: 1 } },
            });
          }
          if (payment.transaction.purchase) {
            await prisma.purchase.update({
              where: { id: payment.transaction.purchase.id },
              data: {
                status: PurchaseStatus.CANCELLED,
                cancellationReason: 'Payment intent timed out',
              },
            });
          }
          if (payment.transaction.eventRegistrationCode) {
            if (
              payment.transaction.eventRegistrationCode.registrationToRemoveId
            ) {
              const registrationToRemove =
                await prisma.eventRegistration.findUnique({
                  where: {
                    id: payment.transaction.eventRegistrationCode
                      .registrationToRemoveId,
                  },
                });
              if (
                registrationToRemove?.status !== RegistrationStatus.SUCCESSFUL
              ) {
                await prisma.eventRegistration.update({
                  where: {
                    id: payment.transaction.eventRegistrationCode
                      .registrationToRemoveId,
                  },
                  data: {
                    status: RegistrationStatus.SUCCESSFUL,
                    cancellationReason: null,
                  },
                });
                await prisma.tumiEvent.update({
                  where: { id: payment.transaction.eventRegistration.eventId },
                  data: { participantRegistrationCount: { increment: 1 } },
                });
              }
            }

            if (
              payment.transaction.eventRegistrationCode.registrationCreatedId
            ) {
              const registrationCreated =
                await prisma.eventRegistration.findUnique({
                  where: {
                    id: payment.transaction.eventRegistrationCode
                      .registrationCreatedId,
                  },
                });
              if (
                registrationCreated?.status !== RegistrationStatus.CANCELLED
              ) {
                await prisma.eventRegistration.update({
                  where: {
                    id: payment.transaction.eventRegistrationCode
                      .registrationCreatedId,
                  },
                  data: {
                    status: RegistrationStatus.CANCELLED,
                    cancellationReason: 'Payment for move failed',
                  },
                });
                await prisma.tumiEvent.update({
                  where: { id: payment.transaction.eventRegistration.eventId },
                  data: { participantRegistrationCount: { decrement: 1 } },
                });
              }
            }
            await prisma.eventRegistrationCode.update({
              where: { id: payment.transaction.eventRegistrationCode.id },
              data: {
                registrationCreatedId: null,
                status: RegistrationStatus.PENDING,
              },
            });
          }
          break;
        }
        case 'charge.dispute.created': {
          const charge: Stripe.Stripe.Charge = event.data.object;
          console.log('Processing event: charge.dispute.created');
          const paymentIntentId =
            typeof charge.payment_intent === 'string'
              ? charge.payment_intent
              : charge.payment_intent?.id;
          const stripePayment = await prisma.stripePayment.findUnique({
            where: { paymentIntent: paymentIntentId },
          });
          if (!stripePayment) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(charge)),
                message: 'No database payment found for incoming event',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          let payment;
          if (Array.isArray(stripePayment.events)) {
            payment = await prisma.stripePayment.update({
              where: { paymentIntent: paymentIntentId },
              data: {
                status: charge.status,
                events: [
                  ...stripePayment.events,
                  {
                    type: 'charge.dispute.created',
                    name: 'disputed',
                    date: Date.now(),
                  },
                ],
              },
              include: {
                transaction: {
                  include: {
                    eventRegistration: true,
                    eventRegistrationCode: true,
                    purchase: true,
                  },
                },
              },
            });
          } else {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(charge)),
                oldData: JSON.parse(JSON.stringify(stripePayment)),
                message: 'Saved payment events are not an array',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          break;
        }
        case 'charge.refunded': {
          const eventObject: Stripe.Stripe.Charge = event.data.object;
          console.log('Processing event: charge.refunded');
          const charge = await stripe.charges.retrieve(eventObject.id);
          const paymentIntentId =
            typeof charge.payment_intent === 'string'
              ? charge.payment_intent
              : charge.payment_intent?.id;
          const stripePayment = await prisma.stripePayment.findUnique({
            where: { paymentIntent: paymentIntentId },
          });
          if (!stripePayment) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(charge)),
                message: 'No database payment found for incoming event',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            console.debug('No database payment found for incoming event');
            break;
          }
          let balanceTransaction;
          if (typeof charge?.balance_transaction === 'string') {
            balanceTransaction = await stripe.balanceTransactions.retrieve(
              charge.balance_transaction
            );
          } else {
            balanceTransaction = charge?.balance_transaction;
          }
          if (Array.isArray(stripePayment.events)) {
            await prisma.stripePayment.update({
              where: { paymentIntent: paymentIntentId },
              data: {
                status: 'refunded',
                refundedAmount: { increment: charge.amount_refunded },
                events: [
                  ...stripePayment.events,
                  {
                    type: 'charge.refunded',
                    name: 'refunded',
                    date: Date.now(),
                  },
                ],
              },
            });
          } else {
            console.warn('Saved payment events are not an array');
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(charge)),
                oldData: JSON.parse(JSON.stringify(stripePayment)),
                message: 'Saved payment events are not an array',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
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
