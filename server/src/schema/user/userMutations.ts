import { builder } from '../../builder';
import prisma from '../../client';

builder.mutationFields((t) => ({
  updateESNCard: t.prismaField({
    type: 'User',
    args: {
      id: t.arg.id({ required: true }),
      esnCardOverride: t.arg.boolean({ required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.user.update({
        ...query,
        where: { id: args.id },
        data: { esnCardOverride: args.esnCardOverride },
      }),
  }),
}));
