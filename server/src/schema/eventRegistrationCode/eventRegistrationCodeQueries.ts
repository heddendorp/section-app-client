import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  eventRegistrationCodes: t.prismaField({
    type: ['EventRegistrationCode'],
    args: {
      pageIndex: t.arg.int(),
      pageLength: t.arg.int(),
      includePrivate: t.arg.boolean({ defaultValue: false }),
      includePassed: t.arg.boolean({ defaultValue: false }),
      includeUsed: t.arg.boolean({ defaultValue: false }),
      orderByEvent: t.arg.boolean({ defaultValue: false }),
    },
    resolve: async (
      query,
      root,
      {
        pageIndex,
        pageLength,
        includePrivate,
        includePassed,
        includeUsed,
        orderByEvent,
      },
      context
    ) => {
      let page = {};
      if (typeof pageIndex === 'number' && typeof pageLength === 'number') {
        page = { skip: pageIndex * pageLength, take: pageLength };
      }
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
        ...page,
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
      return prisma.eventRegistrationCode.findUniqueOrThrow({
        where: { id },
        ...query,
      });
    },
  }),
  eventRegistrationCodeCount: t.int({
    resolve: async (root, args, context) => {
      return prisma.eventRegistrationCode.count();
    },
  }),
}));
