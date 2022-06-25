import { builder } from '../../builder';
import { costItemType } from './costItemType';
import prisma from '../../client';

builder.mutationFields((t) => ({
  deleteCostItem: t.prismaField({
    authScopes: { admin: true },
    type: costItemType,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.costItem.delete({
        ...query,
        where: { id: args.id },
      });
    },
  }),
}));
