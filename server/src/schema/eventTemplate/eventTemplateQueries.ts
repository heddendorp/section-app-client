import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  eventTemplates: t.prismaField({
    authScopes: { member: true },
    type: ['EventTemplate'],
    resolve: async (query, parent, args, context, info) => {
      return prisma.eventTemplate.findMany({
        ...query,
        where: {
          tenant: {
            id: context.tenant.id,
          },
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
      return prisma.eventTemplate.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
}));
