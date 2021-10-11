import {
  arg,
  idArg,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { StripeUserData } from 'nexus-prisma';
import { eventType } from './event';
import { LogSeverity, RegistrationType, Role } from '@tumi/server-models';
import { ApolloError } from 'apollo-server-express';
import { Json } from 'nexus-prisma/scalars';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_KEY);

export const stripeUserDataType = objectType({
  name: StripeUserData.$name,
  description: StripeUserData.$description,
  definition(t) {
    t.field(StripeUserData.id);
    t.field(StripeUserData.paymentMethodId);
    t.field(StripeUserData.customerId);
  },
});

export const paymentSetupSessionType = objectType({
  name: 'paymentSetupSession',
  definition(t) {
    t.nonNull.string('id');
  },
});

export const paymentIntentType = objectType({
  name: 'paymentIntent',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('status');
    t.string('client_secret');
  },
});

export const getPaymentSetupSessionQuery = queryField(
  'getPaymentSetupSession',
  {
    type: nonNull(paymentSetupSessionType),
    resolve: async (source, args, context) => {
      let stripeData = await context.prisma.stripeUserData.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsTenantId: context.tenant.id,
            usersOfTenantsUserId: context.user.id,
          },
        },
      });
      if (!stripeData) {
        const customer = await stripe.customers.create({
          email: context.user.email,
          name: `${context.user.firstName} ${context.user.lastName}`,
          metadata: { userId: context.user.id },
        });
        console.log(customer);
        stripeData = await context.prisma.stripeUserData.create({
          data: {
            customerId: customer.id,
            userOfTenant: {
              connect: {
                userId_tenantId: {
                  userId: context.user.id,
                  tenantId: context.tenant.id,
                },
              },
            },
          },
        });
      }
      const baseURL = process.env.DEV
        ? 'http://localhost:4200/'
        : 'https://tumi.esn.world/';
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit'],
        mode: 'setup',
        customer: stripeData.customerId,
        client_reference_id: stripeData.id,
        success_url: `${baseURL}profile?stripe=success`,
        cancel_url: `${baseURL}profile?stripe=fail`,
      });
      return session;
    },
  }
);

export const deregisterUserWithRefundMutation = mutationField(
  'deregisterUserWithRefund',
  {
    type: nonNull(eventType),
    args: { eventId: nonNull(idArg()), userId: idArg() },
    resolve: async (source, { eventId, userId }, context) => {
      if (userId) {
        const { role } = await context.prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: context.user.id,
              tenantId: context.tenant.id,
            },
          },
        });
        if (role !== Role.ADMIN) {
          throw new ApolloError('Only admins can deregister other users');
        }
      } else {
        userId = context.user.id;
      }
      const event = await context.prisma.tumiEvent.findUnique({
        where: { id: eventId },
      });
      if (event.title.includes('ESNcard')) {
        throw new ApolloError(`No refunds on ESNcard possible`);
      }
      const registration = await context.prisma.eventRegistration.findUnique({
        where: { userId_eventId: { eventId, userId } },
      });
      if (registration.paymentStatus !== 'succeeded') {
        throw new ApolloError('Only succeeded payments can be refunded');
      }
      const refund = await stripe.refunds.create({
        payment_intent: registration.paymentIntentId,
        reason: 'requested_by_customer',
        metadata: { eventId, userId, event: event.title },
      });
      try {
        await context.prisma.eventRegistration.delete({
          where: { id: registration.id },
        });
      } catch (e) {
        await context.prisma.activityLog.create({
          data: {
            data: e,
            oldData: JSON.parse(JSON.stringify(registration)),
            severity: LogSeverity.ERROR,
            message:
              'Failed to remove event registration after requested refund!',
          },
        });
      }
      await context.prisma.refundedRegistration.create({
        data: {
          userId,
          eventId,
          registrationId: registration.id,
          tenant: { connect: { id: context.tenant.id } },
          chargeId: registration.chargeId,
          refundId: refund.id,
        },
      });
      return context.prisma.tumiEvent.findUnique({
        where: { id: eventId },
      });
    },
  }
);

export const registerWithStripeMutation = mutationField('registerWithStripe', {
  type: nonNull(paymentIntentType),
  args: { id: nonNull(idArg()), submissions: arg({ type: Json }) },
  resolve: async (source, { id, submissions }, context) =>
    context.prisma.$transaction(async (prisma) => {
      const event = await context.prisma.tumiEvent.findUnique({
        where: { id },
        include: { submissionItems: true },
      });
      if (!event) {
        throw new ApolloError('Event could not be found!');
      }
      if (event.submissionItems.some((item) => !submissions[item.name])) {
        throw new ApolloError('Missing info for signup!');
      }

      const registeredParticipants = await prisma.eventRegistration.count({
        where: { event: { id }, type: RegistrationType.PARTICIPANT },
      });
      if (registeredParticipants >= event.participantLimit) {
        throw new ApolloError('Event does not have an available spot!');
      }
      const hasRegistration = await context.prisma.eventRegistration.findUnique(
        {
          where: {
            userId_eventId: { userId: context.user.id, eventId: event.id },
          },
        }
      );
      if (hasRegistration) {
        throw new ApolloError('You are already registered for this event!');
      }
      const stripeData = await context.prisma.stripeUserData.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsTenantId: context.tenant.id,
            usersOfTenantsUserId: context.user.id,
          },
        },
      });
      if (!stripeData) {
        throw new ApolloError('User does not have payment data!');
      }

      let amount = event.price.toNumber() * 100;
      if (event.esnDiscount) {
        const cardBought = !!(await context.prisma.eventRegistration.count({
          where: {
            user: { id: context.user.id },
            event: { title: { contains: 'ESNcard' } },
            type: RegistrationType.PARTICIPANT,
          },
        }));
        const { esnCardOverride } = await context.prisma.user.findUnique({
          where: { id: context.user.id },
          select: { esnCardOverride: true },
        });
        if (esnCardOverride || cardBought) {
          amount = event.discountedPrice.toNumber() * 100;
        }
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'EUR',
        confirm: true,
        customer: stripeData.customerId,
        payment_method: stripeData.paymentMethodId,
        payment_method_types: ['card', 'sepa_debit'],
        description: `Participation fee for ${event.title}`,
        metadata: {
          eventId: event.id,
          userId: context.user.id,
        },
      });
      await context.prisma.eventRegistration.create({
        data: {
          type: RegistrationType.PARTICIPANT,
          event: { connect: { id: paymentIntent.metadata.eventId } },
          user: { connect: { id: paymentIntent.metadata.userId } },
          paymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          amountPaid: paymentIntent.amount,
          submissions: {
            create: event.submissionItems.map((item) => ({
              submissionItem: { connect: { id: item.id } },
              data: { value: submissions[item.name] },
            })),
          },
        },
      });
      return paymentIntent;
    }),
});
