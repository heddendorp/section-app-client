import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Stripe from 'stripe';
import {
  LogSeverity,
  PrismaClient,
  PurchaseStatus,
  RegistrationStatus,
  RegistrationType,
} from '@tumi/server-models';

const stripe = new Stripe.default.Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2020-08-27',
});

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
        return;
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
                paymentMethod: charge.payment_method,
                paymentMethodType: charge.payment_method_details.type,
                events: [
                  ...stripePayment.events,
                  {
                    type: 'payment_intent.processing',
                    name: 'processing',
                    date: Date.now(),
                  },
                ],
              },
              include: {
                eventRegistration: true,
                productPurchase: true,
                eventRegistrationCode: true,
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
          }
          break;
        }
        case 'payment_intent.succeeded': {
          const paymentIntent: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.succeeded');
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
            payment = await prisma.stripePayment.update({
              where: { paymentIntent: paymentIntent.id },
              data: {
                status: paymentIntent.status,
                paymentMethod: charge.payment_method,
                paymentMethodType: charge.payment_method_details.type,
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
                eventRegistration: true,
                productPurchase: true,
                eventRegistrationCode: true,
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
          if (payment.eventRegistration) {
            await prisma.eventRegistration.update({
              where: { id: payment.eventRegistration.id },
              data: { status: RegistrationStatus.SUCCESSFUL },
            });
          } else if (payment.productPurchase) {
            await prisma.productPurchase.update({
              where: { id: payment.productPurchase.id },
              data: { status: PurchaseStatus.SUCCESSFUL },
            });
          } else if (payment.eventRegistrationCode) {
            if (payment.eventRegistrationCode.registrationToRemoveId) {
              await prisma.eventRegistration.update({
                where: {
                  id: payment.eventRegistrationCode.registrationToRemoveId,
                },
                data: {
                  status: RegistrationStatus.CANCELLED,
                  cancellationReason: 'Event was moved to another person',
                },
              });
            }

            const newRegistration = await prisma.eventRegistration.upsert({
              where: {
                id: payment.eventRegistrationCode.registrationCreatedId,
              },
              update: { status: RegistrationStatus.SUCCESSFUL },
              create: {
                type: RegistrationType.PARTICIPANT,
                event: {
                  connect: { id: payment.eventRegistrationCode.eventId },
                },
                payment: { connect: { id: payment.id } },
                user: { connect: { id: payment.userId } },
                status: RegistrationStatus.SUCCESSFUL,
              },
            });
            await prisma.eventRegistrationCode.update({
              where: { id: payment.eventRegistrationCode.id },
              data: {
                registrationCreatedId: newRegistration.id,
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
                productPurchase: true,
                eventRegistrationCode: true,
                eventRegistration: true,
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
          if (payment.eventRegistration) {
            await prisma.eventRegistration.update({
              where: { id: payment.eventRegistration.id },
              data: {
                status: RegistrationStatus.CANCELLED,
                cancellationReason: 'Payment failed',
              },
            });
          } else if (payment.productPurchase) {
            await prisma.productPurchase.update({
              where: { id: payment.productPurchase.id },
              data: {
                status: PurchaseStatus.CANCELLED,
                cancellationReason: 'Payment failed',
              },
            });
          } else if (payment.eventRegistrationCode) {
            if (payment.eventRegistrationCode.registrationToRemoveId) {
              await prisma.eventRegistration.update({
                where: {
                  id: payment.eventRegistrationCode.registrationToRemoveId,
                },
                data: {
                  status: RegistrationStatus.SUCCESSFUL,
                  cancellationReason: null,
                },
              });
            }

            if (payment.eventRegistrationCode.registrationCreatedId) {
              await prisma.eventRegistration.update({
                where: {
                  id: payment.eventRegistrationCode.registrationCreatedId,
                },
                data: {
                  status: RegistrationStatus.CANCELLED,
                  cancellationReason: 'Payment for move failed',
                },
              });
            }
            await prisma.eventRegistrationCode.update({
              where: { id: payment.eventRegistrationCode.id },
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
              : charge.payment_intent.id;
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
                productPurchase: true,
                eventRegistrationCode: true,
                eventRegistration: true,
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
          const charge: Stripe.Stripe.Charge = event.data.object;
          console.log('Processing event: charge.refunded');
          const paymentIntentId =
            typeof charge.payment_intent === 'string'
              ? charge.payment_intent
              : charge.payment_intent.id;
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
                productPurchase: true,
                eventRegistrationCode: true,
                eventRegistration: true,
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
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      response.sendStatus(200);
    }
  );
  return router;
};

export const webhookRouter2 = (prisma) => {
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
          if (paymentIntent.invoice) {
            console.log('Skipping upsert for invoice success');
            break;
          }
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
              response.status(500).send(e);
              return;
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
          if (paymentIntent.invoice) {
            console.log('Skipping upsert for invoice success');
            break;
          }
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
                response.status(500).send(e);
                return;
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
                  severity: LogSeverity.INFO,
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
              response.status(500).send(e);
              return;
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
        case 'charge.dispute.created': {
          await prisma.activityLog.create({
            data: {
              message: 'SEPA dispute created',
              data: event.data.object,
              severity: LogSeverity.WARNING,
            },
          });
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
