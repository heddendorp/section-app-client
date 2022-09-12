import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  eventTemplates: t.prismaField({
    authScopes: { member: true },
    type: ['EventTemplate'],
    args: { onlyWithoutCategory: t.arg.boolean() },
    resolve: async (query, parent, { onlyWithoutCategory }, context, info) => {
      return prisma.eventTemplate.findMany({
        ...query,
        where: {
          tenant: {
            id: context.tenant.id,
          },
          ...(onlyWithoutCategory ? { category: null } : {}),
        },
        orderBy: {
          title: 'asc',
        },
      });
    },
  }),
  eventTemplate: t.prismaField({
    authScopes: { member: true },
    type: 'EventTemplate',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.eventTemplate.findUniqueOrThrow({
        ...query,
        where: { id: args.id },
      });
    },
  }),
}));
