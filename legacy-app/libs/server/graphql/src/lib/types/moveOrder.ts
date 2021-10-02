import { idArg, mutationField, nonNull, objectType, queryField } from 'nexus';
import { EventRegistrationMoveOrder } from 'nexus-prisma';
import { ApolloError } from 'apollo-server-express';
import { paymentIntentType } from './stripeUserData';
import { eventRegistrationType } from './eventRegistration';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_KEY);

export const moveOrderType = objectType({
  name: EventRegistrationMoveOrder.$name,
  description: EventRegistrationMoveOrder.$description,
  definition(t) {
    t.field(EventRegistrationMoveOrder.id);
    t.field(EventRegistrationMoveOrder.createdAt);
    t.field(EventRegistrationMoveOrder.createdBy);
    t.field(EventRegistrationMoveOrder.usedBy);
    t.field(EventRegistrationMoveOrder.usedAt);
    t.field({
      ...EventRegistrationMoveOrder.registration,
      resolve: (source, args, context) =>
        context.prisma.eventRegistration.findUnique({
          where: { id: source.eventRegistrationId },
        }),
    });
    t.field(EventRegistrationMoveOrder.eventRegistrationId);
  },
});

export const createEventMoveOrderMutation = mutationField(
  'createRegistrationMoveOrder',
  {
    type: nonNull(eventRegistrationType),
    args: {
      id: nonNull(idArg()),
    },
    resolve: async (source, { id }, context) => {
      await context.prisma.eventRegistrationMoveOrder.create({
        data: {
          createdBy: context.user.id,
          registration: { connect: { id } },
        },
      });
      return context.prisma.eventRegistration.findUnique({ where: { id } });
    },
  }
);

export const getMoveOrder = queryField('moveOrder', {
  args: { id: nonNull(idArg()) },
  type: moveOrderType,
  resolve: (source, { id }, context) =>
    context.prisma.eventRegistrationMoveOrder.findUnique({ where: { id } }),
});

export const useMoveOrderMutation = mutationField('useMoveOrder', {
  type: nonNull(paymentIntentType),
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.$transaction(async (prisma) => {
      const moveOrder = await prisma.eventRegistrationMoveOrder.findUnique({
        where: { id },
        include: { registration: true },
      });
      if (!moveOrder) {
        throw new ApolloError('Move Order could not be found');
      }
      if (moveOrder.usedBy) {
        throw new ApolloError('Code was already used');
      }
      const event = await prisma.tumiEvent.findUnique({
        where: { id: moveOrder.registration.eventId },
      });
      const stripeData = await prisma.stripeUserData.findUnique({
        where: {
          usersOfTenantsUserId_usersOfTenantsTenantId: {
            usersOfTenantsUserId: context.user.id,
            usersOfTenantsTenantId: context.tenant.id,
          },
        },
      });
      if (!stripeData || !stripeData.paymentMethodId) {
        throw new ApolloError('Payment Information missing');
      }
      return await stripe.paymentIntents.create({
        amount: event.price.toNumber() * 100,
        currency: 'EUR',
        confirm: true,
        customer: stripeData.customerId,
        payment_method: stripeData.paymentMethodId,
        payment_method_types: ['card', 'sepa_debit'],
        description: `Participation move fee for ${event.title}`,
        metadata: {
          isMove: true,
          registrationId: moveOrder.registration.id,
          moveOrderId: moveOrder.id,
          userId: context.user.id,
        },
      });
    }),
});
