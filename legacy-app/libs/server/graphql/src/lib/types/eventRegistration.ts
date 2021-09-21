import { list, nonNull, objectType, queryField } from 'nexus';
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
  },
});

export const getRegistrationsQuery = queryField('registrations', {
  type: nonNull(list(nonNull(eventRegistrationType))),
  resolve: (source, args, context) =>
    context.prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    }),
});
