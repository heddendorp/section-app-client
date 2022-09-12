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
        ...(args.limitToOwn
          ? {
              where: {
                userId: context.user?.id,
              },
            }
          : {}),
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
