import {
  booleanArg,
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { EventRegistration } from 'nexus-prisma';

export const eventRegistrationType = objectType({
  name: EventRegistration.$name,
  description: EventRegistration.$description,
  definition(t) {
    t.field(EventRegistration.id);
    t.field(EventRegistration.createdAt);
    t.field(EventRegistration.type);
    t.field({
      ...EventRegistration.user,
      resolve: (source, args, context) =>
        context.prisma.user.findUnique({ where: { id: source.userId } }),
    });
    t.field(EventRegistration.userId);
    t.field({
      ...EventRegistration.event,
      resolve: (source, args, context) =>
        context.prisma.tumiEvent.findUnique({ where: { id: source.eventId } }),
    });
    t.field(EventRegistration.eventId);
    t.field(EventRegistration.amountPaid);
    t.field(EventRegistration.netPaid);
    t.field(EventRegistration.stripeFee);
    t.field(EventRegistration.paymentStatus);
    t.field(EventRegistration.chargeId);
    t.field(EventRegistration.paymentIntentId);
    t.field(EventRegistration.checkInTime);
    t.field(EventRegistration.manualCheckin);
    t.field({
      ...EventRegistration.moveOrders,
      resolve: (source, args, context) =>
        context.prisma.eventRegistrationMoveOrder.findMany({
          where: { registration: { id: source.id } },
        }),
    });
    t.field({
      ...EventRegistration.moveOrders,
      name: 'openMoveOrders',
      resolve: (source, args, context) =>
        context.prisma.eventRegistrationMoveOrder.findMany({
          where: { registration: { id: source.id }, usedBy: null },
        }),
    });
    t.nonNull.boolean('didAttend', {
      resolve: (source) => !!source.checkInTime,
    });
  },
});

export const getRegistrationsQuery = queryField('registrations', {
  type: nonNull(list(nonNull(eventRegistrationType))),
  resolve: (source, args, context) =>
    context.prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    }),
});

export const getOneRegistrationQuery = queryField('registration', {
  type: nonNull(eventRegistrationType),
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.eventRegistration.findUnique({
      where: { id },
    }),
});

export const checkInUserMutation = mutationField('checkInUser', {
  type: eventRegistrationType,
  args: {
    id: nonNull(idArg()),
    manualCheckin: booleanArg({ default: false }),
  },
  resolve: (source, { id, manualCheckin }, context) =>
    context.prisma.eventRegistration.update({
      where: { id },
      data: { checkInTime: new Date(), manualCheckin },
    }),
});
