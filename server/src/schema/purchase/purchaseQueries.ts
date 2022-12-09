import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  purchases: t.prismaField({
    type: ['Purchase'],
    args: {
      limitToOwn: t.arg.boolean(),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.purchase.findMany({
        ...query,
        where: {
          ...(args.limitToOwn
            ? {
                userId: context.user?.id,
              }
            : {}),
          user: {
            tenants: {
              some: {
                tenantId: context.tenant.id,
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  }),
  purchase: t.prismaField({
    type: 'Purchase',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.purchase.findUniqueOrThrow({
        where: {
          id: args.id,
        },
      });
    },
  }),
}));
