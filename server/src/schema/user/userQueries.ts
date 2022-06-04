import { builder } from '../../builder';
import prisma from '../../client';

builder.queryFields((t) => ({
  users: t.prismaField({
    type: ['User'],
    resolve: async (query, root, args, ctx, info) =>
      prisma.user.findMany({ ...query }),
  }),
}));
