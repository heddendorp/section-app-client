import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Stripe from 'stripe';
import {
  LogSeverity,
  Prisma,
  PrismaClient,
  PurchaseStatus,
  RegistrationStatus,
  StripePayment,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../generated/prisma';
import InputJsonObject = Prisma.InputJsonObject;

const stripe: Stripe.Stripe = require('stripe')(process.env['STRIPE_KEY']);

export const webhookRouter = (prisma: PrismaClient) => {
  const cancelPayment = async (stripePayment: StripePayment | null, object) => {
    if (!stripePayment) {
      await prisma.activityLog.create({
        data: {
          data: JSON.parse(JSON.stringify(object)),
          message: 'No database payment found for incoming event',
          severity: 'WARNING',
          category: 'webhook',
        },
      });
      return;
    }
    const payment = await prisma.stripePayment.update({
      where: { id: stripePayment.id },
      data: {
        status: object.status,
        events: [
          ...(Array.isArray(stripePayment.events) ? stripePayment.events : []),
          {
            type: object.object,
            name: 'canceled',
            date: Date.now(),
          },
        ],
      },
      include: {
        transactions: {
          where: { direction: TransactionDirection.USER_TO_TUMI },
          include: {
            eventRegistration: {
              include: {
                eventRegistrationCode: true,
              },
            },
            purchase: true,
          },
        },
      },
    });
    let transaction;
    if (payment.transactions.length === 1) {
      transaction = payment.transactions[0];
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.CANCELLED,
        },
      });
    } else {
      await prisma.activityLog.create({
        data: {
          data: JSON.parse(JSON.stringify(object)),
          oldData: JSON.parse(JSON.stringify(stripePayment)),
          message: 'Transaction for payment intent is not singular',
          severity: 'WARNING',
          category: 'webhook',
        },
      });
    }
    if (!transaction) {
      await prisma.activityLog.create({
        data: {
          data: JSON.parse(JSON.stringify(object)),
          oldData: JSON.parse(JSON.stringify(stripePayment)),
          message: "Transaction for payment intent wasn't found",
          severity: 'WARNING',
          category: 'webhook',
        },
      });
    }
    if (
      transaction &&
      transaction.eventRegistration &&
      transaction.eventRegistration.status !== RegistrationStatus.CANCELLED
    ) {
      await prisma.eventRegistration.update({
        where: { id: transaction.eventRegistration.id },
        data: {
          status: RegistrationStatus.CANCELLED,
          cancellationReason: 'Payment intent timed out',
        },
      });
    }
    if (transaction && transaction.purchase) {
      await prisma.purchase.update({
        where: { id: transaction.purchase.id },
        data: {
          status: PurchaseStatus.CANCELLED,
          cancellationReason: 'Payment intent timed out',
        },
      });
    }
    if (transaction && transaction.eventRegistration.eventRegistrationCode) {
      if (
        transaction.eventRegistration.eventRegistrationCode
          .registrationToRemoveId
      ) {
        const registrationToRemove = await prisma.eventRegistration.findUnique({
          where: {
            id: transaction.eventRegistration.eventRegistrationCode
              .registrationToRemoveId,
          },
        });
        if (
          registrationToRemove &&
          registrationToRemove?.status !== RegistrationStatus.SUCCESSFUL
        ) {
          await prisma.eventRegistration.update({
            where: {
              id: registrationToRemove.id,
            },
            data: {
              status: RegistrationStatus.SUCCESSFUL,
              cancellationReason: null,
            },
          });
        }
      }

      if (
        transaction.eventRegistration.eventRegistrationCode
          .registrationCreatedId
      ) {
        const registrationCreated = await prisma.eventRegistration.findUnique({
          where: {
            id: transaction.eventRegistration.eventRegistrationCode
              .registrationCreatedId,
          },
        });
        if (
          registrationCreated &&
          registrationCreated?.status !== RegistrationStatus.CANCELLED
        ) {
          await prisma.eventRegistration.update({
            where: {
              id: registrationCreated.id,
            },
            data: {
              status: RegistrationStatus.CANCELLED,
              cancellationReason: 'Payment for move failed',
            },
          });
        }
      }
      await prisma.eventRegistrationCode.update({
        where: {
          id: transaction.eventRegistration.eventRegistrationCode.id,
        },
        data: {
          registrationCreatedId: null,
          status: RegistrationStatus.PENDING,
        },
      });
    }
    return;
  };
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

      let event = request.body;
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
          if (typeof session.setup_intent === 'string') {
            const setupIntent = await stripe.setupIntents.retrieve(
              session.setup_intent
            );
            if (typeof setupIntent.payment_method === 'string') {
              await prisma.stripeUserData.update({
                where: { id: session.client_reference_id ?? undefined },
                data: {
                  paymentMethodId: setupIntent.payment_method,
                },
              });
            }
          }
          if (typeof session.payment_intent === 'string') {
            await prisma.stripePayment.update({
              where: { checkoutSession: session.id },
              data: { paymentIntent: session.payment_intent },
            });
          }
          break;
        }
        case 'checkout.session.expired': {
          const session: Stripe.Stripe.Checkout.Session = event.data.object;
          const stripePayment = await prisma.stripePayment.findUnique({
            where: { checkoutSession: session.id },
          });
          await cancelPayment(stripePayment, session);
          break;
        }
        case 'payment_intent.processing': {
          const paymentIntent: Stripe.Stripe.PaymentIntent = event.data.object;
          console.log('Processing event: payment_intent.processing');
          let stripePayment: StripePayment | null;
          if (paymentIntent.metadata.stripePaymentId) {
            stripePayment = await prisma.stripePayment.findUnique({
              where: { id: paymentIntent.metadata.stripePaymentId },
            });
          } else {
            stripePayment = await prisma.stripePayment.findUnique({
              where: { paymentIntent: paymentIntent.id },
            });
          }
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
          if (!paymentIntent.charges) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                message: 'No charges found for payment intent',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
            break;
          }
          const charge = paymentIntent.charges.data[0];
          if (Array.isArray(stripePayment.events)) {
            await prisma.stripePayment.update({
              where: { id: stripePayment.id },
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
          let stripePayment: StripePayment | null;
          if (paymentIntent.metadata.stripePaymentId) {
            stripePayment = await prisma.stripePayment.findUnique({
              where: { id: paymentIntent.metadata.stripePaymentId },
            });
          } else {
            stripePayment = await prisma.stripePayment.findUnique({
              where: { paymentIntent: paymentIntent.id },
            });
          }
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
          if (!paymentIntent.charges) {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                message: 'No charges found for payment intent',
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
                where: { id: stripePayment.id },
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
                  transactions: {
                    where: { direction: TransactionDirection.USER_TO_TUMI },
                    include: {
                      eventRegistration: {
                        include: { eventRegistrationCode: true },
                      },
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
          let transaction;
          if (payment && payment.transactions.length === 1) {
            transaction = payment.transactions[0];
            await prisma.transaction.update({
              where: { id: transaction.id },
              data: {
                status: TransactionStatus.CONFIRMED,
              },
            });
          } else {
            await prisma.activityLog.create({
              data: {
                data: JSON.parse(JSON.stringify(paymentIntent)),
                oldData: JSON.parse(JSON.stringify(payment)),
                message: 'Transaction for payment intent is not singular',
                severity: 'WARNING',
                category: 'webhook',
              },
            });
          }

          if (transaction) {
            const existingFeeTransaction = await prisma.transaction.findFirst({
              where: {
                direction: TransactionDirection.TUMI_TO_EXTERNAL,
                amount: balanceTransaction.fee / 100,
                stripePayment: { id: payment.id },
              },
            });
            if (!existingFeeTransaction) {
              await prisma.transaction.create({
                data: {
                  type: TransactionType.STRIPE,
                  direction: TransactionDirection.TUMI_TO_EXTERNAL,
                  subject: `Stripe fees for ${transaction.id}`,
                  amount: balanceTransaction.fee / 100,
                  status: TransactionStatus.CONFIRMED,
                  user: {
                    connect: {
                      id: transaction.userId,
                    },
                  },
                  createdBy: {
                    connect: {
                      id: transaction.userId,
                    },
                  },
                  tenant: {
                    connect: {
                      id: transaction.tenantId,
                    },
                  },
                  stripePayment: {
                    connect: {
                      id: payment.id,
                    },
                  },
                  ...(transaction.eventRegistrationId
                    ? {
                        eventRegistration: {
                          connect: {
                            id: transaction.eventRegistrationId,
                          },
                        },
                      }
                    : {}),
                  ...(transaction.purchaseId
                    ? {
                        purchase: {
                          connect: {
                            id: transaction.purchaseId,
                          },
                        },
                      }
                    : {}),
                },
              });
            }
          }

          if (transaction.eventRegistration) {
            await prisma.eventRegistration.update({
              where: { id: transaction.eventRegistration.id },
              data: { status: RegistrationStatus.SUCCESSFUL },
            });
          }
          if (transaction.purchase) {
            try {
              await prisma.purchase.update({
                where: { paymentId: transaction.id },
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
          if (transaction.eventRegistration.eventRegistrationCode) {
            if (
              transaction.eventRegistration.eventRegistrationCode
                ?.registrationToRemoveId
            ) {
              const registrationToRemove =
                await prisma.eventRegistration.findUnique({
                  where: {
                    id: transaction.eventRegistration.eventRegistrationCode
                      .registrationToRemoveId,
                  },
                });
              if (
                registrationToRemove &&
                registrationToRemove?.status !== RegistrationStatus.CANCELLED
              ) {
                const removedRegistration =
                  await prisma.eventRegistration.update({
                    where: {
                      id: registrationToRemove.id,
                    },
                    data: {
                      status: RegistrationStatus.CANCELLED,
                      cancellationReason: 'Event was moved to another person',
                    },
                    include: {
                      transactions: {
                        where: { direction: TransactionDirection.USER_TO_TUMI },
                        include: { stripePayment: true },
                      },
                    },
                  });
                if (removedRegistration.transactions[0]?.stripePayment) {
                  if (
                    !removedRegistration.transactions[0].stripePayment
                      .paymentIntent
                  ) {
                    await prisma.activityLog.create({
                      data: {
                        data: JSON.parse(JSON.stringify(removedRegistration)),
                        oldData: JSON.parse(JSON.stringify(payment)),
                        message:
                          'Transaction to refund is missing payment intent',
                        severity: 'ERROR',
                        category: 'webhook',
                      },
                    });
                  } else {
                    try {
                      await stripe.refunds.create({
                        payment_intent:
                          removedRegistration.transactions[0].stripePayment
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
            }

            if (
              transaction.eventRegistration.eventRegistrationCode
                .registrationCreatedId
            ) {
              await prisma.eventRegistration.update({
                where: {
                  id: transaction.eventRegistration.eventRegistrationCode
                    .registrationCreatedId,
                },
                data: {
                  status: RegistrationStatus.SUCCESSFUL,
                },
              });
            }

            await prisma.eventRegistrationCode.update({
              where: {
                id: transaction.eventRegistration.eventRegistrationCode.id,
              },
              data: {
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
          await cancelPayment(stripePayment, paymentIntent);
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
              where: { id: stripePayment.id },
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
                transactions: {
                  include: {
                    eventRegistration: true,
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
            include: { transactions: true },
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
              where: { id: stripePayment.id },
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
            if (
              stripePayment.transactions[0]?.eventRegistrationId &&
              stripePayment.transactions[0]?.tenantId &&
              stripePayment.transactions[0]?.userId
            ) {
              await prisma.transaction.create({
                data: {
                  subject: `Refund for ${stripePayment.transactions[0].eventRegistrationId}`,
                  status: TransactionStatus.CONFIRMED,
                  user: {
                    connect: { id: stripePayment.transactions[0].userId },
                  },
                  createdBy: {
                    connect: { id: stripePayment.transactions[0].userId },
                  },
                  tenant: {
                    connect: { id: stripePayment.transactions[0].tenantId },
                  },
                  direction: TransactionDirection.TUMI_TO_USER,
                  amount: charge.amount_refunded / 100,
                  type: TransactionType.STRIPE,
                  eventRegistration: {
                    connect: {
                      id: stripePayment.transactions[0].eventRegistrationId,
                    },
                  },
                  stripePayment: {
                    connect: {
                      id: stripePayment.id,
                    },
                  },
                },
              });
            } else {
              await prisma.activityLog.create({
                data: {
                  data: JSON.parse(JSON.stringify(stripePayment)),
                  message: 'No connected transaction for stripe payment',
                  severity: 'WARNING',
                  category: 'webhook',
                },
              });
            }
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
