import { list, nonNull, objectType, queryField } from 'nexus';
import { RefundedRegistration } from 'nexus-prisma';
import { userType } from './user';
import { eventType } from './event';

export const refundedRegistrationType = objectType({
  name: RefundedRegistration.$name,
  description: RefundedRegistration.$description,
  definition(t) {
    t.field(RefundedRegistration.id);
    t.field(RefundedRegistration.createdAt);
    t.field({
      name: 'user',
      type: nonNull(userType),
      resolve: (source, args, context) =>
        context.prisma.user.findUnique({ where: { id: source.userId } }),
    });
    t.field(RefundedRegistration.userId);
    t.field({
      name: 'event',
      type: eventType,
      resolve: (source, args, context) =>
        context.prisma.tumiEvent.findUnique({ where: { id: source.eventId } }),
    });
    t.field(RefundedRegistration.eventId);
    t.field(RefundedRegistration.chargeId);
    t.field(RefundedRegistration.refundId);
  },
});

export const getRefundedRegistrationsQuery = queryField(
  'refundedRegistrations',
  {
    type: nonNull(list(nonNull(refundedRegistrationType))),
    resolve: (source, args, context) =>
      context.prisma.refundedRegistration.findMany({
        orderBy: { createdAt: 'desc' },
      }),
  }
);
