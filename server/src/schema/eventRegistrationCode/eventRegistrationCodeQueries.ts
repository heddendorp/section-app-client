import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  eventRegistrationCodes: t.prismaField({
    type: ['EventRegistrationCode'],
    args: {
      includePrivate: t.arg.boolean({ defaultValue: false }),
      includePassed: t.arg.boolean({ defaultValue: false }),
      includeUsed: t.arg.boolean({ defaultValue: false }),
      orderByEvent: t.arg.boolean({ defaultValue: false }),
    },
    resolve: async (
      query,
      root,
      { includePrivate, includePassed, includeUsed, orderByEvent },
      context
    ) => {
      return prisma.eventRegistrationCode.findMany({
        ...query,
        where: {
          targetEvent: { eventTemplate: { tenant: { id: context.tenant.id } } },
          ...(includePrivate ? {} : { isPublic: true }),
          ...(includeUsed ? {} : { registrationCreatedId: null }),
          ...(includePassed
            ? {}
            : { targetEvent: { start: { gt: new Date() } } }),
        },
        orderBy: orderByEvent
          ? { targetEvent: { start: 'asc' } }
          : { createdAt: 'desc' },
      });
    },
  }),
  eventRegistrationCode: t.prismaField({
    type: 'EventRegistrationCode',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { id }, context) => {
      return prisma.eventRegistrationCode.findUnique({
        where: { id },
        ...query,
      });
    },
  }),
}));
